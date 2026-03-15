const express = require('express');
const roleController = require('../controllers/RoleController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Protect role routes (Admin only)
router.use(auth.protect);
router.use(auth.restrictTo('Admin'));

router.get('/', roleController.getAllRoles);

module.exports = router;
