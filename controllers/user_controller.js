const User = require('../models/users');
const Post = require('../models/posts');
const forgotPass = require('../mailers/forgot_pass_mailer');
const Reaction = require('../models/reactions');
const Message = require('../models/messages');
const crypto = require('crypto');
const fs = require('fs');

const FriendShip = require('../models/friendship');
const path = require('path');

const avatarPath = path.join('/uploads/users/avatar');
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
            populate : {
                path:'reactions'
            },
            options:{
                sort: '-createdAt'
            }
        });


        let messageUser = await Message.find({
            $or: [
           { sender : req.user._id, receiver : user.id},
            { receiver : req.user._id  , sender : user.id }
            ]
        }).sort('createdAt').populate('sender').populate('receiver');
        console.log(messageUser);
      
        let friends = await FriendShip.findOne(
            {$or:[
                { sender: req.user._id, receiver: user.id },
                { receiver : req.user._id , sender : user.id}
            ]}).populate('sender').populate('receiver');

            // console.log(friends);
        let reactionComment = await Reaction.find({user: req.user,
            onModel:"Comment"}).populate('likeable').populate('onModel');
    
        let reactionPost = await Reaction.find({user: req.user,
            onModel:"Post"}).populate('likeable').populate('onModel');

        res.render('user_profile', {
            title: "User profile",
            profile_user : user,
            reactionComment : reactionComment,
            reactionPost : reactionPost,
            items : posts,
            isfriend: friends,
            userMessage  : messageUser,
            // friendMessage : messageFriend
        });


    }
    catch(err){
        console.log("Error in finding user ",err)
    }

};


module.exports.update =  async function(req, res)
{
    

    if(req.query.id == req.user._id)
    {
        try {
            let user =  await User.findById(req.user._id );


                user.name = req.body.name;
                user.email = req.body.email;
                user.about = req.body.about;

                if(req.file)
                {

                    if(user.avatar){
                console.log(user.avatar);

                    console.log('hoho');

                        fs.unlinkSync(path.join(__dirname,'..', user.avatar));
                    }
                    console.log(req.file.filename);
                    // this is just saving the path of the uploaded file nto the avatar feild in the user
                    user.avatar = avatarPath + '/' +req.file.filename;
                }
                console.log(user.avatar);
                // console.log(req.file);

                user.save();
                return res.redirect('back');


        } catch (error) {
            req.flash('error', error);
            return res.redirect('back');
        }
      

    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }

}

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