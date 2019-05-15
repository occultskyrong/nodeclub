/**
 * Created by zhangrz on 2018/2/1.
 * Copyright© 2015-2020
 * @version 0.0.1 created
 */

const crypto = require('crypto');

/**
 * 在数字前按位补0
 * @param {int} num 原始数字
 * @param {int} n 数字位数
 */
const prefixInteger = (num, n) => (new Array(n).join('0') + num).slice(-n);

/**
 * 随机生成一个区间整数
 * @param {int} min 最小值
 * @param {int} max 最大值
 */
const randomInteger = (min, max) => (Math.floor(Math.random() * ((max - min) + 1)) + min);

/**
 * 生成md5值
 * @param str
 */
const md5 = str => crypto.createHash('md5').update(str).digest('hex');

/**
 * 判断一个字符串是否为时间格式
 * @param str
 * @return {boolean}
 */
const isDateTime = str => new Date(str).getTime() > 0;

/**
 * 延迟函数
 * @param ms
 * @link https://www.zhihu.com/question/31636244/answer/52835780
 * @return {Promise<*>}
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  md5, // 生成md5
  prefixInteger, // 数字前补0
  randomInteger, // 随机区间整数
  isDateTime, // 是否为时间格式
  sleep, // 延迟函数
};
