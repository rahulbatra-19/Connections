const Post = require('../models/posts');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const upload = multer({dest: 'uploads/posts'});
const Comment = require('../models/comments');



module.exports.create = function(req, res){

    const filePath =  path.join("/uploads/posts")+ "/" + req.file.filename;
    var obj = {
        caption : req.body.caption,
        img: filePath,
        user: req.user._id
    }


    console.log(obj);
    Post.create(obj)
    .then((createdPost) => {
      console.log('Post created:', createdPost);
      res.redirect('back');
    })
    .catch((err) => {
      console.log('Error:', err);
      res.status(500).json({ error: 'An error occurred' });
    });
    
}

module.exports.destroy = async function(req, res){
    try {
        let post = await Post.findById(req.params.id);
         // .id means converting the object _id into string
        if(post.user == req.user.id){
            let comment = await Comment.deleteMany({post: req.params.id });


             fs.unlinkSync(path.join(__dirname,'..', post.img));
            post.deleteOne();
            return res.redirect('back');
        }
        else{
            console.log('error You cannot delete this post');
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error in destroying post', error);
        return res.redirect('back');
    }
}