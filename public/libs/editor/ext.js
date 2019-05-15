(function ext(Editor, markdownit, WebUploader) {
  function _replaceSelection(cm, active, start, end) {
    let text;
    const startPoint = cm.getCursor('start');
    const endPoint = cm.getCursor('end');
    end = end || '';
    if (active) {
      text = cm.getLine(startPoint.line);
      start = text.slice(0, startPoint.ch);
      end = text.slice(startPoint.ch);
      cm.setLine(startPoint.line, start + end);
    } else {
      text = cm.getSelection();
      cm.replaceSelection(start + text + end);

      startPoint.ch += start.length;
      endPoint.ch += start.length;
    }
    cm.setSelection(startPoint, endPoint);
    cm.focus();
  }

  /**
   * The state of CodeMirror at the given position.
   */
  function getState(cm, pos) {
    pos = pos || cm.getCursor('start');
    const stat = cm.getTokenAt(pos);
    if (!stat.type) return {};

    const types = stat.type.split(' ');

    const ret = {};
    let data;
    let
      text;
    for (let i = 0; i < types.length; i++) {
      data = types[i];
      if (data === 'strong') {
        ret.bold = true;
      } else if (data === 'variable-2') {
        text = cm.getLine(pos.line);
        if (/^\s*\d+\.\s/.test(text)) {
          ret['ordered-list'] = true;
        } else {
          ret['unordered-list'] = true;
        }
      } else if (data === 'atom') {
        ret.quote = true;
      } else if (data === 'em') {
        ret.italic = true;
      }
    }
    return ret;
  }

  // Set default options
  const md = new markdownit();

  md.set({
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks
    linkify: false, // Autoconvert URL-like text to links
    typographer: false, // Enable smartypants and other sweet transforms
  });

  window.markdowniter = md;

  const { toolbar } = Editor;

  function replaceTool(name, callback) {
    for (let i = 0, len = toolbar.length; i < len; i++) {
      const v = toolbar[i];
      if (typeof v !== 'string' && v.name === name) {
        v.action = callback;
        break;
      }
    }
  }

  const $body = $('body');

  // 添加链接工具
  function ToolLink() {
    const self = this;
    this.$win = $([
      '<div class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="editorToolImageTitle" aria-hidden="true">',
      '<div class="modal-header">',
      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
      '<h3 id="editorToolImageTitle">添加链接</h3>',
      '</div>',
      '<div class="modal-body">',
      '<form class="form-horizontal">',
      '<div class="control-group">',
      '<label class="control-label">标题</label>',
      '<div class="controls">',
      '<input type="text" name="title" placeholder="Title">',
      '</div>',
      '</div>',
      '<div class="control-group">',
      '<label class="control-label">链接</label>',
      '<div class="controls">',
      '<input type="text" name="link" value="http://" placeholder="Link">',
      '</div>',
      '</div>',
      '</form>',
      '</div>',
      '<div class="modal-footer">',
      '<button class="btn btn-primary" role="save">确定</button>',
      '</div>',
      '</div>',
    ].join('')).appendTo($body);

    this.$win.on('click', '[role=save]', () => {
      self.$win.find('form').submit();
    }).on('submit', 'form', function submitForm() {
      const $el = $(this);
      const title = $el.find('[name=title]').val();
      const link = $el.find('[name=link]').val();

      self.$win.modal('hide');

      const cm = self.editor.codemirror;
      const stat = getState(cm);
      _replaceSelection(cm, stat.link, `[${title}](${link})`);

      $el.find('[name=title]').val('');
      $el.find('[name=link]').val('http://');

      return false;
    });
  }

  ToolLink.prototype.bind = function toolLinkBind(editor) {
    this.editor = editor;
    this.$win.modal('show');
  };

  // 图片上传工具
  function ToolImage() {
    const self = this;
    this.$win = $([
      '<div class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="editorToolImageTitle" aria-hidden="true">',
      '<div class="modal-header">',
      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
      '<h3 id="editorToolImageTitle">图片</h3>',
      '</div>',
      '<div class="modal-body">',
      '<div class="upload-img">',
      '<div class="button">上传图片</div>',
      '<span class="tip"></span>',
      '<div class="alert alert-error hide"></div>',
      '</div>',
      '</div>',
      '<div class="model-footer" style="color:red;padding:10px;">',
      '<div>1. 仅限gif,jpg,jpeg,bmp,png等格式</div>',
      '<div>2. 大小在1M以内</div>',
      '</div>',
      '</div>',
    ].join('')).appendTo($body);

    this.$upload = this.$win.find('.upload-img').css({
      height: 50,
      padding: '60px 0',
      textAlign: 'center',
      border: '4px dashed#ddd',
    });

    this.$uploadBtn = this.$upload.find('.button').css({
      width: 86,
      height: 40,
      margin: '0 auto',
    });

    this.$uploadTip = this.$upload.find('.tip').hide();

    this.file = false;
    const _csrf = $('[name=_csrf]').val();

    this.uploader = WebUploader.create({
      swf: '/public/libs/webuploader/Uploader.swf',
      server: `/upload?_csrf=${_csrf}`,
      pick: this.$uploadBtn[0],
      paste: document.body,
      dnd: this.$upload[0],
      auto: true,
      fileSingleSizeLimit: 1 * 1024 * 1024,
      // sendAsBinary: true,
      // 只允许选择图片文件。
      accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*',
      },
    });

    this.uploader.on('beforeFileQueued', (file) => {
      if (self.file !== false || !self.editor) {
        return false;
      }
      self.showFile(file);
    });

    this.uploader.on('uploadProgress', (file, percentage) => {
      // console.log(percentage);
      self.showProgress(file, percentage * 100);
    });

    this.uploader.on('uploadSuccess', (file, res) => {
      if (res.success) {
        self.$win.modal('hide');

        const cm = self.editor.codemirror;
        const stat = getState(cm);
        _replaceSelection(cm, stat.image, `![${file.name}](${res.url})`);
      } else {
        self.removeFile();
        self.showError(res.msg || '服务器走神了，上传失败');
      }
    });

    this.uploader.on('uploadComplete', (file) => {
      self.uploader.removeFile(file);
      self.removeFile();
    });

    this.uploader.on('error', (type) => {
      self.removeFile();
      switch (type) {
        case 'Q_EXCEED_SIZE_LIMIT':
        case 'F_EXCEED_SIZE':
          self.showError('文件太大了, 不能超过1MB');
          break;
        case 'Q_TYPE_DENIED':
          self.showError('只能上传图片');
          break;
        default:
          self.showError('发生未知错误');
      }
    });

    this.uploader.on('uploadError', () => {
      self.removeFile();
      self.showError('服务器走神了，上传失败');
    });
  }

  ToolImage.prototype.removeFile = function toolImageRemoveFile() {
    // var self = this;
    this.file = false;
    this.$uploadBtn.show();
    this.$uploadTip.hide();
  };

  ToolImage.prototype.showFile = function toolImageShowFile(file) {
    // var self = this;
    this.file = file;
    this.$uploadBtn.hide();
    this.$uploadTip.html(`正在上传: ${file.name}`).show();
    this.hideError();
  };

  ToolImage.prototype.showError = function toolImageShowError(error) {
    this.$upload.find('.alert-error').html(error).show();
  };

  ToolImage.prototype.hideError = function toolImageHideError(error) {
    this.$upload.find('.alert-error').hide();
  };

  ToolImage.prototype.showProgress = function toolImageShowProgress(file, percentage) {
    this.$uploadTip
      .html(`正在上传: ${file.name} ${percentage}%`)
      .show();
  };

  ToolImage.prototype.bind = function toolImageBind(editor) {
    this.editor = editor;
    this.$win.modal('show');
  };

  const toolImage = new ToolImage();
  const toolLink = new ToolLink();

  replaceTool('image', (editor) => {
    toolImage.bind(editor);
  });
  replaceTool('link', (editor) => {
    toolLink.bind(editor);
  });

  // 当编辑器取得焦点时，绑定 toolImage；
  const { createToolbar } = Editor.prototype;
  Editor.prototype.createToolbar = function editorCreateToolbar(items) {
    createToolbar.call(this, items);
    const self = this;
    $(self.codemirror.display.input).on('focus', () => {
      toolImage.editor = self;
    });
  };

  // 追加内容
  Editor.prototype.push = function editorPush(txt) {
    const cm = this.codemirror;
    const line = cm.lastLine();
    cm.setLine(line, cm.getLine(line) + txt);
  };
}(window.Editor, window.markdownit, window.WebUploader));
