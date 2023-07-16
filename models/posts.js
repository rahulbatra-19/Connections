const mongoose = require("mongoose");
const multer = require('multer');  
const path = require('path');
const postsPath = path.join('/uploads/posts');
 

const postsSchema = new mongoose.Schema({
    caption: {
        type: String
    },
    img:
    {

        data: Buffer,
        contentType: String
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }


},{
    timestamps:true
});



let storage = multer.diskStorage({
    destination: function(req, file , cb){
        cb(null , path.join(__dirname, '..', postsPath));
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

var upload = multer({ storage: storage });


const Post = mongoose.model('Post', postsSchema);
module.exports = Post;