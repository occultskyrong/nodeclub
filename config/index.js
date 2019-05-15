/**
 * config
 */

const path = require('path');

const secret = require('./secret');

const env = process.env.NODE_ENV || 'development';

const isProduction = () => env === 'production';

const config = {
  // debug 为 true 时，用于本地调试；即生产环境关闭调试模式
  debug: !isProduction(),

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  // NOTE: 站点基础信息
  name: '陷阵', // 社区名字
  description: '陷阵之志，向死而生', // 社区的描述
  keywords: '率土之滨 陷阵之志',
  // 添加到 html head 中的信息
  site_headers: [
    '<meta name="author" content="occultskyrong" />',
  ],
  site_logo: '/public/images/stzb_logo.webp', // default is `name`
  site_icon: '/public/images/xianzhen_icon.png', // 默认没有 favicon, 这里填写网址
  // 右上角的导航区
  site_navs: [
    // 格式 [ path, title, [target=''] ]
    // ['/about', '关于']
  ],
  // NOTE: 站点运行环境配置
  // 程序运行的端口
  host: 'www.xianzhen.vip', // 社区的域名
  port: 3000,
  log_dir: path.join(__dirname, '../logs'),
  // cdn host，如 http://cnodejs.qiniudn.com
  site_static_host: '', // 静态文件存储域名
  google_tracker_id: '', // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
  cnzz_tracker_id: '', // 默认的cnzz tracker ID，自有站点请修改
  // mongodb 配置
  db: 'mongodb://127.0.0.1/node_club_prod',
  // redis 配置，默认是本地
  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_db: 0,
  redis_password: '',

  // 话题列表显示的话题数量
  list_topic_count: 20,

  // NOTE: 未使用的配置
  // RSS配置
  rss: {
    title: '陷阵之志',
    link: 'http://cnodejs.org',
    language: 'zh-cn',
    description: '陷阵之志，率土之滨，陷阵团论坛',
    // 最多获取的RSS Item数量
    max_rss_items: 50,
  },
  // weibo app key
  weibo_key: 10000000,
  weibo_id: 'your_weibo_id',

  // github 登陆的配置
  GITHUB_OAUTH: {
    clientID: 'your GITHUB_CLIENT_ID',
    clientSecret: 'your GITHUB_CLIENT_SECRET',
    callbackURL: 'http://cnodejs.org/auth/github/callback',
  },
  // 是否允许直接注册（否则只能走 github 的方式）
  allow_sign_up: true,
  // oneapm 是个用来监控网站性能的服务
  oneapm_key: '',
  // 极光推送
  jpush: {
    appKey: 'YourAccessKeyyyyyyyyyyyy',
    masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
    isDebug: false,
  },
  // 下面两个配置都是文件上传的配置
  // 7牛的access信息，用于文件上传
  // qn_access: {
  // accessKey: 'your access key',
  // secretKey: 'your secret key',
  // bucket: 'your bucket name',
  // origin: 'http://your qiniu domain',
  // // 如果vps在国外，请使用 http://up.qiniug.com/ ，这是七牛的国际节点
  // // 如果在国内，此项请留空
  // uploadURL: 'http://xxxxxxxx',
  // },

  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  upload: {
    path: path.join(__dirname, '../public/upload/'),
    url: '/public/upload/',
  },
  file_limit: '1MB',
  // NOTE: 站点前端模块配置
  // 版块
  tabs: [
    ['X286xz', 'X286陷阵团'],
    ['S2314', 'S2314群聊'],
    ['chats', '闲聊'],
  ],
  create_post_per_day: 10, // 每个用户一天可以发的主题数
  create_reply_per_day: 20, // 每个用户一天可以发的评论数
  create_user_per_ip: 2, // 每个 ip 每天可以注册账号的次数
  visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/node_club_test';
}

// 合并基础配置和秘钥信息
module.exports = Object.assign(config, secret);
