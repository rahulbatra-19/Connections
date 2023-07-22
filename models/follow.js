const mongoose = require('mongoose');


const followSchema = new mongoose.Schema({
    user1:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
});



const Follow = mongoose.model('Follow', followSchema);
module.exports = Follow;