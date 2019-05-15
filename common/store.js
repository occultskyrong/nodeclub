const qn = require('./store_qn'); // 七牛云存储
const local = require('./store_local'); // 本地存储

// 使用七牛云存储文件或者本地存储文件
module.exports = qn || local;
