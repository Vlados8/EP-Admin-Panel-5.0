const express = require('express');
const inquiryController = require('../controllers/InquiryController');
const auth = require('../middlewares/auth');
const apiKeyAuth = require('../middlewares/apiKeyAuth');

const router = express.Router();

// Маршруты, требующие JWT (админка/менеджеры)
router.get('/', auth.protect, inquiryController.getAllInquiries);
router.get('/:id', auth.protect, inquiryController.getInquiry);
router.put('/:id', auth.protect, inquiryController.updateInquiry);
router.patch('/:id', auth.protect, inquiryController.updateInquiryStatus);
router.delete('/:id', auth.protect, inquiryController.deleteInquiry);

// Публичный маршрут создания через API Key
router.post('/', apiKeyAuth, inquiryController.createInquiry);

module.exports = router;
