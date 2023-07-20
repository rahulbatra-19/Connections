const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const passport = require('passport');

router.get('/profile',passport.checkAuthentication, userController.profile);
router.get('/profile/:id',passport.checkAuthentication, userController.profile);
router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);
router.post('/create', userController.create);
router.get('/sign-out', userController.destroySession);

router.get('/forgot-pass', userController.forgotPass);

 router.post('/passwordForgot', userController.passwordForgot);
 router.get('/passwordChange', userController.passChange); 
 router.post('/reset-password', userController.resetPass);

// authentication using google
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/users/sign-in'}), userController.createSession);

// authentication using gihtub
router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {
        failureRedirect: '/users/sign-in'
    },
),  userController.createSession );

module.exports = router; 