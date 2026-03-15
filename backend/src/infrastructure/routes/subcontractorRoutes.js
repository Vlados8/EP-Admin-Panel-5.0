const express = require('express');
const subcontractorController = require('../controllers/SubcontractorController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Protect all subcontractor routes
router.use(auth.protect);

router
    .route('/')
    .get(subcontractorController.getAllSubcontractors)
    .post(subcontractorController.createSubcontractor);

router
    .route('/:id')
    .patch(subcontractorController.updateSubcontractor)
    .delete(subcontractorController.deleteSubcontractor);

module.exports = router;
