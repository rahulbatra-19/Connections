const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
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
    message:{
        type: String,
        required : true
    }
},{
    timestamps: true
});



const Messages = mongoose.model('Messages', messageSchema);
module.exports = Messages;