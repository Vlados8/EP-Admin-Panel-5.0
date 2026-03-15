const express = require('express');
const path = require('path');
console.log('--- CONTROLLER RESOLUTION CHECK ---');
console.log('__dirname (routes):', __dirname);
const apiKeyControllerPath = path.join(__dirname, '../controllers/api-key.controller.js');
console.log('Target Controller Path:', apiKeyControllerPath);
const apiKeyController = require(apiKeyControllerPath);

const auth = require('../middlewares/auth');

const router = express.Router();

// Все маршруты API ключей требуют авторизации
router.use(auth.protect);
// Опционально: разрешить только админам
router.use(auth.restrictTo('Admin'));

router
    .route('/')
    .get(apiKeyController.getAllKeys)
    .post(apiKeyController.createKey);

router
    .route('/:id')
    .delete(apiKeyController.deleteKey); // Жесткое удаление

router
    .route('/:id/revoke')
    .patch(apiKeyController.revokeKey); // Мягкая деактивация (is_active = false)

module.exports = router;
