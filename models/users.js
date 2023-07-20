const mongoose = require('mongoose');

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
    resetToken: {
        token: {
            type: String,
            default: null
        },
        expiry: {
            type: Date,
            default: null
        }
    }
},   {
    timestamps: true 
});

const User = mongoose.model('User', userSchema);
module.exports = User;