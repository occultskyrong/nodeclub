# CMS论坛

## 1. 目录

<!-- TOC -->

- [1. 目录](#1-目录)
- [2. 介绍](#2-介绍)
- [3. 环境说明](#3-环境说明)
- [4. 环境安装](#4-环境安装)
- [5. 线上部署](#5-线上部署)
- [6. 测试](#6-测试)
- [7. 贡献](#7-贡献)
- [8. License](#8-license)

<!-- /TOC -->

## 2. 介绍

基于 [`Nodeclub`](https://github.com/cnodejs/nodeclub)
某些功能点有所改动，包括但不限于：

- 注册&登录
  - 去除`GitHub`注册+登录的选项
  - 去除注册时必须填写邮箱的限制

## 3. 环境说明

生产环境：

- `CentOS`
- `Node v10.15.3`
  - `NPM 6.4.1`
- `MongoDB v4.0.9`
  - pwd: `/usr/local/mongodb/`
  - 启动命令: `/usr/local/mongodb/bin/mongod --config mongodb.conf`
- `Redis 5.0.4`
  - pwd: `/usr/local/redis-stable`
  - 启动命令: `/usr/local/redis-stable/src/redis-server 127.0.0.1:6379`

## 4. 环境安装

```bash
# 1. 安装 `Node.js[必须]` `MongoDB[必须]` `Redis[必须]`
# 2. 启动 MongoDB 和 Redis
# 3. `$ make install` 安装 Nodeclub 的依赖包
# 打包
make build
# 4. `cp config.default.js config.js` 请根据需要修改配置文件
# 5. `$ make test` 确保各项服务都正常
# 6. `$ node app.js`
# 7. visit `http://localhost:3000`
# 8. done!

# 更新线上 密钥配置文件
scp ~/code/github/nodeclub/config/secret.js root@vps:/root/code/nodeclub/config/
```

## 5. 线上部署

```bash
# 访问mongo
/usr/local/mongodb/bin/mongo
# 查看数据库
show dbs;
# 使用数据库
use database_name;
# 查看表列表
show collections;
# 查看索引
db.users.getIndexes();
# 删除索引，根据name删除
db.users.dropIndex('loginname_1');
```

## 6. 测试

跑测试

```bash
make test
```

跑覆盖率测试

```bash
make test-cov
```

## 8. License

MIT
