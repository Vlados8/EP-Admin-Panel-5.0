const express = require('express');
const router = express.Router();
const publicFileController = require('../controllers/PublicFileController');

router.get('/shared-folder/:token', publicFileController.getSharedFolder);
router.get('/shared-folder/:token/download', publicFileController.downloadSharedFile);

module.exports = router;
