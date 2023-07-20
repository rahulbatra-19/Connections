const mongoose = require('mongoose');


const reactionSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId
    },
    //  this defines the objectid of the liked object
    likeable : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        refPath : 'onModel'
    },
    // this defines the type of the liked object since it is the liked object
    onModel : {
        type: String,
        required : true,
        enum : ['Post', 'Comment']
    },
    type: {
      type: String,
    //   enum: ['like','love', 'funny', 'wow', 'sad', 'angry'],
      required: true
    }
},{
    timestamps : true
}
);

const Reaction = mongoose.model('Reaction', reactionSchema);
module.exports = Reaction;