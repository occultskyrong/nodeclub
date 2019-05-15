/*!
 * nodeclub - app.js
 */

/**
 * Module dependencies.
 */

const config = require('./config');

if (!config.debug && config.oneapm_key) {
  require('oneapm');
}

require('colors');
const path = require('path');
const Loader = require('loader');
const LoaderConnect = require('loader-connect');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./middlewares/mongoose_log'); // 打印 mongodb 查询日志
require('./models');
const GitHubStrategy = require('passport-github').Strategy;
const githubStrategyMiddleware = require('./middlewares/github_strategy');
const webRouter = require('./web_router');
const apiRouterV1 = require('./api_router_v1');
const auth = require('./middlewares/auth');
const errorPageMiddleware = require('./middlewares/error_page');
const proxyMiddleware = require('./middlewares/proxy');
const RedisStore = require('connect-redis')(session);
const _ = require('lodash');
const csurf = require('csurf');
const compress = require('compression');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const errorhandler = require('errorhandler');
const cors = require('cors');
const requestLog = require('./middlewares/request_log');
const renderMiddleware = require('./middlewares/render');
const logger = require('./common/logger');
const helmet = require('helmet');
const bytes = require('bytes');


// 静态文件目录
const staticDir = path.join(__dirname, 'public');
// assets
let assets = {};

if (config.mini_assets) {
  try {
    assets = require('./assets.json');
  } catch (e) {
    logger.error('You must execute `make build` before start app when mini_assets is true.');
    throw e;
  }
}

const urlinfo = require('url').parse(config.host);

config.hostname = urlinfo.hostname || config.host;

const app = express();

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

app.locals._layoutFile = 'layout.html';
app.enable('trust proxy');

// Request logger。请求时间
app.use(requestLog);

if (config.debug) {
  // 渲染时间
  app.use(renderMiddleware.render);
}

// 静态资源
if (config.debug) {
  app.use(LoaderConnect.less(__dirname)); // 测试环境用，编译 .less on the fly
}
app.use('/public', express.static(staticDir));
app.use('/agent', proxyMiddleware.proxy);

// 通用的中间件
app.use(require('response-time')());

app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));

app.use(compress());
app.use(session({
  secret: config.session_secret,
  store: new RedisStore({
    port: config.redis_port,
    host: config.redis_host,
    db: config.redis_db,
    pass: config.redis_password,
  }),
  resave: false,
  saveUninitialized: false,
}));

// oauth 中间件
app.use(passport.initialize());

// github oauth
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(new GitHubStrategy(config.GITHUB_OAUTH, githubStrategyMiddleware));

// custom middleware
app.use(auth.authUser);
app.use(auth.blockUser());

if (!config.debug) {
  app.use((req, res, next) => {
    if (req.path === '/api' || req.path.indexOf('/api') === -1) {
      csurf()(req, res, next);
      return;
    }
    next();
  });
  app.set('view cache', true);
}

// for debug
// app.get('/err', function (req, res, next) {
//   next(new Error('haha'))
// });

// set static, dynamic helpers
_.extend(app.locals, {
  config,
  Loader,
  assets,
});

app.use(errorPageMiddleware.errorPage);
_.extend(app.locals, require('./common/render_helper'));

app.use((req, res, next) => {
  res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
  next();
});

app.use(busboy({ limits: { fileSize: bytes(config.file_limit) }, }));

// routes
app.use('/api/v1', cors(), apiRouterV1);
app.use('/', webRouter);

// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use((err, req, res, next) => {
    logger.error(err);
    return res.status(500).send('500 status');
  });
}

if (!module.parent) {
  app.listen(config.port, () => {
    logger.info('NodeClub listening on port', config.port);
    logger.info('God bless love....');
    logger.info(`You can debug your app with http://${config.hostname}:${config.port}`);
  });
}

module.exports = app;
