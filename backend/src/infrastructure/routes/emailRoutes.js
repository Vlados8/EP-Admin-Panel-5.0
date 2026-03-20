const express = require('express');
const fs = require('fs');
const multer = require('multer');
const emailController = require('../controllers/EmailController');
const auth = require('../middlewares/auth');

const router = express.Router();

const path = require('path');

// Multer setup for email attachments
const uploadDir = path.join(__dirname, '../../../uploads/emails');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ 
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'email-' + uniqueSuffix + path.extname(file.originalname));
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Webhook route - MUST be before auth.protect
router.post('/webhook', upload.any(), emailController.receiveWebhook);

// All email routes below are protected and restricted to Admin/Büro and Managers
router.use(auth.protect);
router.use(auth.restrictTo('Admin', 'Büro', 'Projektleiter', 'Gruppenleiter'));

router.get('/', emailController.getEmailAccounts);
router.get('/domain', emailController.getDomain);
router.post('/', emailController.createEmailAccount);
router.delete('/:id', emailController.deleteEmailAccount);
router.get('/stats', emailController.getMailgunStats);
router.post('/send', upload.array('attachments'), emailController.sendEmail);
router.patch('/:id', emailController.updateEmailAccount);

// Message Management
router.get('/messages', emailController.getEmailMessages);
router.patch('/messages/:id/read', emailController.markAsRead);
router.delete('/messages/:id', emailController.deleteMessage);

module.exports = router;
