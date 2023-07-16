const Post = require('../models/posts');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const upload = multer({dest: 'uploads/posts'});





module.exports.create = function(req, res){
    if(req.file)
    {
        console.log('h1h11');
    }else{
        console.log('nono');
    }

    var obj = {
        caption : req.body.caption,
        img: {

            data: fs.readFileSync(path.join(__dirname ,"../uploads/posts/" , req.file.filename )),
            contentType: 'image/png'
        },
        user: req.user._id
    }


    // console.log(obj);
    Post.create(obj)
    .then((createdPost) => {
      console.log('Post created:', createdPost);
      res.redirect('back');
    })
    .catch((err) => {
      console.log('Error:', err);
      res.status(500).json({ error: 'An error occurred' });
    });
    
};