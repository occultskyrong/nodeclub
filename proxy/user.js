const utility = require('utility');
const uuid = require('node-uuid');

const models = require('../models');

const { User } = models;

/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
const getUsersByNames = (names, callback) => {
  if (names.length === 0) {
    return callback(null, []);
  }
  User.find({ loginname: { $in: names } }, callback);
};

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
const getUserByLoginName = (loginName, callback) => {
  User.findOne({ loginname: new RegExp(`^${loginName}$`, 'i') }, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
const getUserById = (id, callback) => {
  if (!id) {
    return callback();
  }
  User.findOne({ _id: id }, callback);
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
const getUserByMail = (email, callback) => {
  User.findOne({ email }, callback);
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 * @param {Function} callback 回调函数
 */
const getUsersByIds = (ids, callback) => {
  User.find({ _id: { $in: ids } }, callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
const getUsersByQuery = (query, opt, callback) => {
  User.find(query, '', opt, callback);
};

/**
 * 根据查询条件，获取一个用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 用户名
 * @param {String} key 激活码
 * @param {Function} callback 回调函数
 */
const getUserByNameAndKey = (loginname, key, callback) => {
  User.findOne({ loginname, retrieve_key: key }, callback);
};

const newAndSave = (name, loginname, pass, email, avatar_url, active, callback) => {
  const user = new User();
  user.name = loginname;
  user.loginname = loginname;
  user.pass = pass;
  user.email = email;
  user.avatar = avatar_url;
  user.active = active || false;
  user.accessToken = uuid.v4();

  user.save(callback);
};

const makeGravatar = email => `http://www.gravatar.com/avatar/${utility.md5(email.toLowerCase())}?size=48`;

const getGravatar = user => user.avatar || makeGravatar(user);

module.exports = {
  getUsersByQuery,
  getGravatar,
  makeGravatar,
  newAndSave,
  getUserByNameAndKey,
  getUsersByNames,
  getUserByLoginName,
  getUserById,
  getUsersByIds,
  getUserByMail,
};
