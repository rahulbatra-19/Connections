const User = require('../models/users');
const Post = require('../models/posts');
const forgotPass = require('../mailers/forgot_pass_mailer');
const crypto = require('crypto');
module.exports.profile = async function(req, res){
    try{
        let user= await User.findById(req.params.id);
        let posts = await Post.find({user:user})
        .sort('-createdAt')
        .populate('user')
        .populate('reactions')
        .populate({
            path: 'comments',
            populate : {
                path:'user'
            },
            options:{
                sort: '-createdAt'
            }
        })
        res.render('user_profile', {
            title: "User profile",
            profile_user : user,
            items : posts
        });


    }
    catch(err){
        console.log("Error in finding user ",err)
    }

};

module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_signIn', {
        title : "Sign In"
    });
}


module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_signUp', {
        title : "Sign Up"
    });
}

// getting Sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password ){
        return res.redirect('back');        
    }
    User.findOne({email:req.body.email}).then(user =>{
        if(!user){
            User.create(req.body).then(user=>{
                return res.redirect('/users/sign-in');
            }).catch(err =>{
                console.log('Error in creating user in signing-up', err);
            });
        }else{
            return res.redirect('back');
        }

    }).catch(err =>{
        console.log('Error in finding user in signing-up!!', err);
    });
}

// Sign in to create session for the user 
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in successfully:');
    return res.redirect('/');
}


// deleting the session 

module.exports.destroySession = function (req, res, next){
    req.logout(function(err){
        if(err) {return next(err);}
    });
    req.flash('success', 'Logged out successfully!');
    return res.redirect('/');
}




module.exports.forgotPass  = function(req, res){


    return res.render('forgot_pass',
    {
        title: "Forgot Password?"
    });
}

module.exports.passwordForgot = function(req, res){
    User.findOne({email : req.body.email}).then(user =>{
        if(user){
        req.flash('success', ' user found');
        const token = crypto.randomBytes(6).toString('hex').slice(0, 6).toUpperCase();
        user.resetToken.token = token;
        user.resetToken.expiry = Date.now() + 60000;
        user.save();
        forgotPass.PasswordForgot(user);
        return res.redirect('/users/passwordChange');
        }
        else{
            req.flash('success', 'Error in Finding user');
            return res.redirect('back');
        }

    }).catch(err =>{
    req.flash('error', 'Error in Founding user');
    return res.redirect('/users/sign-in');

    })
}

module.exports.passChange = function(req, res){
res.render('password-change',{
    title: "Change Password"
});
}

module.exports.resetPass = function(req, res)
{
    
    
    let token = req.body.token;

    User.findOne({
        'resetToken.token': token,
        'resetToken.expiry': { $gt: Date.now() }
      }).then(user=>{
        if (!user) {
            // Token is invalid or expired
            req.flash('success', 'Invalid or expired password reset token');
            return res.redirect('/users/forgot-pass');
          }

        if(req.body.password != req.body.confirmPassword){
            req.flash('success', 'Password do not match');
            return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetToken.token = null;
        user.resetToken.expiry = null;
        user.save();
        req.flash('success', 'Pasword Changed');
        return res.redirect('/users/sign-in');
      }).catch(err=>{
        console.log('Error finding user by token:', err);
      req.flash('error', 'Something went wrong');
      return res.redirect('/users/forgot-pass');
      });


}