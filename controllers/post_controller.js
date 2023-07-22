const Post = require('../models/posts');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const upload = multer({dest: 'uploads/posts'});
const Comment = require('../models/comments');



module.exports.create = async function(req, res){

    try{
    const filePath =  path.join("uploads/posts")+ "/" + req.file.filename;

    let post = await Post.create({
        caption : req.body.caption,
        img: filePath,
        user: req.user._id
    });


    
    if (req.xhr){
        return res.status(200).json({
            data: {
                post: post,
                user: req.user
            },
            message: "Post created!"
        });
    }
    
        req.flash('success', 'Post created');
        res.redirect('back');
    }
    catch(err){
      req.flash('error', err);
      return res.redirect('back');
    }
    
}

module.exports.destroy = async function(req, res){
    try {
        let post = await Post.findById(req.params.id);
         // .id means converting the object _id into string
        if(post.user == req.user.id){
            let comment = await Comment.deleteMany({post: req.params.id });


            fs.unlinkSync(path.join(__dirname,'..', post.img));
            post.deleteOne();

            req.flash('success', 'Posts and associated comments destroyed');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error', error);
        return res.redirect('back');
    }
}