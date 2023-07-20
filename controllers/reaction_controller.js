const Reaction = require('../models/reactions');
const Post = require('../models/posts');
const Comment = require('../models/comments');

module.exports.toggleReaction = async function(req, res)
{
    try {
        // likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('reactions');
        }else{
            likeable = await Comment.findById(req.query.id).populate('reactions');
        }

        //  check if a like already exits 
        let existingLike = await Reaction.findOne({
            likeable : req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });
        let typeofreaction;
        //  if a like already exists then delete it
        if(existingLike){
            console.log('Reaction deleted');
            likeable.reactions.pull(existingLike._id);
            likeable.save();
            existingLike.deleteOne();
            deleted = true;
        } else {
            // make a new like 
            typeofreaction = req.query.reactiontype;
            console.log('Reaction created');
            let newReaction = await Reaction.create({
                user : req.user._id,
                likeable : req.query.id,
                onModel : req.query.type,
                type :  req.query.reactiontype
            });
            likeable.reactions.push(newReaction._id);
            likeable.save();


        }

    //    return res.redirect('/');

        return res.status(200).json( {
            message : 'Request successfull',
            data : {
                deleted : deleted,
                type: typeofreaction,
                comment: likeable,
                post : likeable,
                onModel : req.query.type
            }
        });



    } catch (error) {
        console.log(error);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}


