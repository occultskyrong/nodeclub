const utility = require('utility');
const path = require('path');
const fs = require('fs');

const logger = require('./logger');
const config = require('../config');

/**
 * 存储 - 文件 - 到本地
 * @param {object} file 文件对象
 * @param {object} options 配置
 * @param {function} callback 回调函数
 */
const upload = (file, options, callback) => {
  const { upload: { url: baseUrl, path: uploadPath } } = config; // 基础网址、上传文件的地址
  // 写入 - 临时文件路径
  const { filename } = options; // 原始文件名称，来获取扩展名
  const extname = path.extname(filename); // 获取文件扩展名
  const tmpFileName = utility.md5(Date.now() + filename) + extname; // 临时文件名称
  const tmpFilePath = path.join(__dirname, '../public/tmp', tmpFileName); // 临时文件写入地址
  file.on('end', () => {
    const tmpFilBuffer = fs.readFileSync(tmpFilePath); // 读取临时文件的buffer
    const fileMd5 = utility.md5(tmpFilBuffer); // 获取 - 文件 - md5值
    const newFilename = fileMd5 + extname; // 文件实际名
    const filePath = path.join(uploadPath, newFilename); // 文件实际地址
    const exists = fs.existsSync(filePath); // 此文件是否已经上传过了
    logger.info('临时文件路径:', tmpFilePath, '\n实际文件路径:', filePath, '\n是否已上传该文件:', exists);
    if (!exists) { // 不存在，则移动临时文件
      fs.renameSync(tmpFilePath, filePath);
    } else { // 存在则删除临时文件
      fs.unlinkSync(tmpFilePath); // 删除临时文件
    }
    const fileUrl = baseUrl + newFilename; // 文件路径
    callback(null, { url: fileUrl });
  });

  file.pipe(fs.createWriteStream(tmpFilePath)); // 使用字节流写入临时文件路径
};

module.exports = { upload };
