const express = require('express');
 const router = express.Router();
 const followController  = require('../controllers/follow_controller');
const passport = require('passport');

 router.get('/create',passport.checkAuthentication,followController.create);

 router.get('/destroy',passport.checkAuthentication, followController.destroy );

//  router.get('/destroy:id',passport.checkAuthentication ,friendsController.destroy);

 module.exports = router; 