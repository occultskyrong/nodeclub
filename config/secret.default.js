module.exports = {

  // admin 可删除话题，编辑标签。把 user_login_name 换成你的登录名
  admins: { user_login_name: true },

  // 邮箱配置
  mail_opts: {
    host: 'smtp.163.com',
    port: 465,
    secureConnection: true,
    auth: {
      user: 'user@163.com',
      pass: 'password',
    },
  },
  auth_cookie_name: '11', // cookie 加密key
  session_secret: '22', // session 加密key，用于生成session，多个网站相同会“踢掉”用户

};
