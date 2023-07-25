const mongoose = require('mongoose');
const multer = require('multer');  
const path = require('path');
const avatarPath = path.join('/uploads/users/avatar');
const fs = require('fs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password :{ 
        type: String,
        required: true 
    },
    name: {
        type: String, 
        required: true 
    },
    about :{
        type: String
    },
    resetToken: {
        token: {
            type: String,
            default: null
        },
        expiry: {
            type: Date,
            default: null
        }
    },
    avatar:{
        type: String
    },
    isceleb_organization :{
        type: Boolean,
        default: false
    }
},   {
    timestamps: true 
});


let storage = multer.diskStorage({
    destination: function(req, file , cb){
        cb(null , path.join(__dirname, '..', avatarPath));
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});


var upload = multer({ storage: storage });

const User = mongoose.model('User', userSchema);
module.exports = User;