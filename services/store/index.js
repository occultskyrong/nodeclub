const qiniu = require('./qiniu'); // 七牛云存储
const local = require('./local'); // 本地存储

// 使用七牛云存储文件或者本地存储文件
module.exports = qiniu || local;
