const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments_controller');
router.post('/create', commentsController.create);

module.exports = router;