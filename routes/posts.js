const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
const passport = require('passport');
const multer = require('multer');
const upload = multer({dest: 'uploads/posts'});

router.post('/create', upload.single('image')  ,  postController.create);
router.get('/destroy/:id',passport.checkAuthentication,postController.destroy);

module.exports = router;