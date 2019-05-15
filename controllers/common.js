const store = require('../common/store');
const { md5 } = require('../common/method');
const config = require('../config');

module.exports = {
  upload: (req, res, next) => {
    let isFileLimit = false;
    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      file.on('limit', () => {
        isFileLimit = true;
        res.json({
          success: false,
          msg: `上传文件不能大于${config.file_limit}`,
        });
      });

      store.upload(file, { filename }, (err, result) => {
        if (err) {
          return next(err);
        }
        if (isFileLimit) {
          return;
        }
        res.json({
          success: true,
          url: result.url,
        });
      });
    });

    req.pipe(req.busboy);
  },
};
