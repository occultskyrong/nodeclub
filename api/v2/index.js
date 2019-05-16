const express = require('express');

const router = express.Router();

const auth = require('../../middlewares/auth');
const uploadService = require('../../services/upload');

// 需要登录的接口
router.use(auth.userRequired);

// 上传文件
router.use('/upload', uploadService.uploadFile);

module.exports = router;
