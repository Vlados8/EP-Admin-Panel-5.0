const express = require('express');
const userController = require('../controllers/UserController');

const auth = require('../middlewares/auth');

const router = express.Router();

// Защита всех маршрутов пользователей
router.use(auth.protect);
router.use(auth.restrictTo('Admin')); // Только админы могут управлять пользователями

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
