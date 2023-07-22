const passport = require('passport');
const User = require('../models/users');
const GitHubStrategy = require('passport-github2').Strategy;
const crypto = require('crypto');
passport.use(new GitHubStrategy({
    clientID: "a0f7e0b00234ddd85777",
    clientSecret: "dba2ed193bad9598d1bc708b7a79431c30bb500c",
    callbackURL: "http://localhost:6/users/auth/github/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    //

    try {
      console.log(profile);
      let user = await User.findOne({ email: profile.emails[0].value });
      if(user){
        return cb(null, user);
      }
      else {
        // User does not exist, create a new user
        let newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString('hex'),
          avatar : profile.photos[0].value
          // Set any other user properties based on the GitHub profile if needed
        });
        
        return cb(null , newUser);
      }
    } catch (error) {
      console.log(error, "ERRor ***");
      return cb(error);
    }
  }));

//     User.findOne({ email: profile.emails[0].value })
//       .then(user => {
//         console.log(accessToken, refreshToken);
//         console.log(profile);
//         if (user) {
//           // User already exists, return the user
//           return cb(null, user);
//         }
//          else {
//           // User does not exist, create a new user
//           const newUser = new User({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             password: crypto.randomBytes(20).toString('hex')
//             // Set any other user properties based on the GitHub profile if needed
//           });
//           return newUser.save();
//         }
//       })
//       .then(newUser => {
//         return cb(null, newUser);
//       })
//       .catch(err => {
//         return cb(err);
//       });
//     }

// )); 