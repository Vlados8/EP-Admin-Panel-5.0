const express = require('express');
const noteController = require('../controllers/NoteController');
const auth = require('../middlewares/auth');
const { getUploader } = require('../middlewares/uploadMiddleware');

const upload = getUploader('notizen');

const router = express.Router();

// Protect all note routes
router.use(auth.protect);

// Notes routes
router
    .route('/')
    .get(noteController.getNotes)
    .post(upload.array('files'), noteController.createNote);

router
    .route('/:id')
    .patch(upload.array('files'), noteController.updateNote)
    .delete(noteController.deleteNote);

module.exports = router;
