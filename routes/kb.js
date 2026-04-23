const express = require('express');
const router = express.Router();
const kbController = require('../controllers/kbController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', kbController.getArticles);
router.post('/', kbController.createArticle);
router.get('/:id', kbController.getArticleById);

module.exports = router;
