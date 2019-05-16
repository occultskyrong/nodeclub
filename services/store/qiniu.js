const qn = require('qn');
const config = require('../../config');

// 7牛 client
let qnClient = null;
if (config.qn_access && config.qn_access.secretKey !== 'your secret key') {
  qnClient = qn.create(config.qn_access);
}

module.exports = qnClient;
