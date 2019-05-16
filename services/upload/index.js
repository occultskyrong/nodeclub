const { upload } = require('../store');
const config = require('../../config');

const uploadFile = (req, res, next) => {
  let isFileLimit = false;
  req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    file.on('limit', () => {
      isFileLimit = true;
      res.json({
        success: false,
        msg: `上传文件不能大于${config.file_limit}`,
      });
    });

    upload(file, { filename }, (err, result) => {
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
};

module.exports = { uploadFile };
