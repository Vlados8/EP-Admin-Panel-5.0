const express = require('express');
const roleController = require('../controllers/RoleController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Protect role routes (Admin and Managers)
router.use(auth.protect);
router.use(auth.restrictTo('Admin', 'Büro', 'Projektleiter', 'Gruppenleiter'));

router.get('/', roleController.getAllRoles);

module.exports = router;
