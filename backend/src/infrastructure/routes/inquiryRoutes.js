const express = require('express');
const inquiryController = require('../controllers/InquiryController');
const auth = require('../middlewares/auth');
const apiKeyAuth = require('../middlewares/apiKeyAuth');
const flexibleAuth = require('../middlewares/flexibleAuth');

const router = express.Router();

// Маршруты, требующие JWT (админка/менеджеры)
router.get('/', auth.protect, inquiryController.getAllInquiries);
router.get('/:id', auth.protect, inquiryController.getInquiry);
router.put('/:id', auth.protect, inquiryController.updateInquiry);
router.patch('/:id', auth.protect, inquiryController.updateInquiryStatus);
router.delete('/:id', auth.protect, inquiryController.deleteInquiry);

// Гибкий маршрут создания (JWT для админки или API Key для сайтов)
router.post('/', flexibleAuth, inquiryController.createInquiry);

module.exports = router;
