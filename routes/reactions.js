const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reaction_controller');
const passport = require('passport');


router.post('/toggle', reactionController.toggleReaction);



module.exports = router;