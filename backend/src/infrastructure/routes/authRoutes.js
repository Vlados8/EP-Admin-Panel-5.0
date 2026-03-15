const express = require('express');
const authController = require('../controllers/AuthController');

const router = express.Router();

router.post('/login', authController.login);

// Placeholder for other auth routes
// router.post('/refresh-token', authController.refreshToken);
// router.post('/logout', authController.logout);

module.exports = router;
