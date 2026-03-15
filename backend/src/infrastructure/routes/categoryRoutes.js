const express = require('express');
const categoryController = require('../controllers/CategoryController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Protect all category-related routes
router.use(auth.protect);

// Categories
router
    .route('/')
    .get(categoryController.getAllCategories)
    .post(categoryController.createCategory);

router
    .route('/:id')
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

// Subcategories
router.post('/subcategories', categoryController.createSubcategory);
router.patch('/subcategories/:id', categoryController.updateSubcategory);
router.delete('/subcategories/:id', categoryController.deleteSubcategory);

// Questions
router.post('/questions', categoryController.createQuestion);
router.patch('/questions/:id', categoryController.updateQuestion);
router.delete('/questions/:id', categoryController.deleteQuestion);

// Answers
router.post('/answers', categoryController.createAnswer);
router.patch('/answers/:id', categoryController.updateAnswer);
router.delete('/answers/:id', categoryController.deleteAnswer);

module.exports = router;
