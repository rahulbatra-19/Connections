const express = require('express');
 const router = express.Router();
 const friendsController  = require('../controllers/friends_controller');
const passport = require('passport');

 router.get('/create',passport.checkAuthentication,friendsController.create);
 router.get('/accept',passport.checkAuthentication,friendsController.accept);
 router.get('/destroy',passport.checkAuthentication, friendsController.destroy );

//  router.get('/destroy:id',passport.checkAuthentication ,friendsController.destroy);

 module.exports = router; 