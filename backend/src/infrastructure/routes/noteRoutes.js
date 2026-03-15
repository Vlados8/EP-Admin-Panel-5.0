const express = require('express');
const noteController = require('../controllers/NoteController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Protect all note routes
router.use(auth.protect);

// Notes routes
router
    .route('/')
    .get(noteController.getNotes)
    .post(noteController.createNote);

router
    .route('/:id')
    .patch(noteController.updateNote)
    .delete(noteController.deleteNote);

module.exports = router;
