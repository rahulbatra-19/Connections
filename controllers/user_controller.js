const User = require('../models/users');
module.exports.profile = function(req, res){


    return res.render('user_profile', {
        title : "User Profile"
    });


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
    return res.redirect('/');
}


// deleting the session 

module.exports.destroySession = function (req, res, next){
    req.logout(function(err){
        if(err) {return next(err);}
    return res.redirect('/');
    });
}