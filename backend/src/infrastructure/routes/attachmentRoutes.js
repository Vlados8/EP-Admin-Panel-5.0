const express = require('express');
const attachmentController = require('../controllers/AttachmentController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Only authenticated users can delete attachments
router.use(auth.protect);

router.delete('/:id', attachmentController.deleteAttachment);

module.exports = router;
