const bcrypt = require('bcryptjs');
const moment = require('moment');

moment.locale('zh-cn'); // 使用中文

// 格式化时间
module.exports = {
  formatDate(date, friendly) {
    date = moment(date);
    if (friendly) {
      return date.fromNow();
    }
    return date.format('YYYY-MM-DD HH:mm');
  },

  // 校验用户名
  validateUserName(str) {
    return (/^[a-zA-Z0-9\-_\u4e00-\u9fa5]+$/i).test(str);
  },

  bhash(str, callback) {
    bcrypt.hash(str, 10, callback);
  },

  bcompare(str, hash, callback) {
    bcrypt.compare(str, hash, callback);
  },
};
