const express = require('express');
const projectStageController = require('../controllers/ProjectStageController');
const multer = require('multer');
const path = require('path');

// Temporary storage for Multer
const auth = require('../middlewares/auth');

const upload = multer({ dest: path.join(__dirname, '../../../../uploads/temp/') });
const router = express.Router();

// Protect all stage routes
router.use(auth.protect);

router
    .route('/')
    .get(projectStageController.getStages)
    .post(upload.array('images', 10), projectStageController.createStage);

router
    .route('/:id')
    .patch(upload.array('images', 10), projectStageController.updateStage)
    .delete(projectStageController.deleteStage);

module.exports = router;
