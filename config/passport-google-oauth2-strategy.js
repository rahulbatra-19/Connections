const passport = require('passport');
 const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
 const crypto = require('crypto');

 const User = require('../models/users');

 // Tell passport to use a new strategy for user login
 passport.use(new googleStrategy({
     clientID: "424511547690-3pj914c8sg2aiqrlj3o65can10j4jsvf.apps.googleusercontent.com",
     clientSecret: "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",
     callbackURL: "http://localhost:6/users/auth/google/callback"
 }, function(accessToken, refreshToken, profile, done) {
     // Find the user
     User.findOne({ email: profile.emails[0].value })
         .then(user => {
             console.log(accessToken, refreshToken);

             console.log(profile);
             console.log(profile.photos[0].value);
             if (user) {
                 // If found, set this user as req.user
                 return done(null, user);
             } else {
                 // If not found, create the user and set it as req.user
                 User.create({
                     name: profile.displayName,
                     email: profile.emails[0].value,
                     password: crypto.randomBytes(20).toString('hex'),
                     avatar : profile.photos[0].value
                 }).then(user => {
                     return done(null, user);
                 }).catch(err => {
                     console.log('Error in creating user', err);
                     return done(err);
                 });
             }
         })
         .catch(err => {
             console.log('Error in Google strategy-passport', err);
             return done(err);
         });
 }));

 module.exports = passport;