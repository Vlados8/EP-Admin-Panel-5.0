const express = require('express');
const taskController = require('../controllers/TaskController');
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: path.join(__dirname, '../../../../uploads/temp/') });
const router = express.Router();
const auth = require('../middlewares/auth');

// Protect all task routes
router.use(auth.protect);

router
    .route('/')
    .get(taskController.getTasks)
    .post(upload.array('images', 10), taskController.createTask);

router
    .route('/:id')
    .patch(upload.array('images', 10), taskController.updateTask)
    .delete(taskController.deleteTask);

module.exports = router;
