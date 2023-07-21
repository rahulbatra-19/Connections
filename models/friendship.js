const mongoose = require('mongoose');


const friendshipSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String,
        required : true
    }
},{
    timestamps: true
});



const FriendShip = mongoose.model('FriendShip', friendshipSchema);
module.exports = FriendShip;