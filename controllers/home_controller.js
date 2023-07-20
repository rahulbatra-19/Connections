const User = require('../models/users');
const Post = require('../models/posts');
const Reaction = require('../models/reactions');
module.exports.home = async function(req, res)
 {

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate('reactions')
        .populate({
            path: 'comments',
            populate : {
                path:'user'
            },
            populate : {
                path:'reactions'
            },
            options:{
                sort: '-createdAt'
            }
        })

        let reactionComment = await Reaction.find({user: req.user,
        onModel:"Comment"}).populate('likeable').populate('onModel');

        let reactionPost = await Reaction.find({user: req.user,
            onModel:"Post"}).populate('likeable').populate('onModel');
        // console.log(reaction.user._id);
        // console.log(reactionComment);

        return res.render('home', {
            title: "Home Page",
            items : posts,
            reactionComment : reactionComment,
            reactionPost : reactionPost
        });

    }
    catch(err){
        console.log("Error in finding user ",err)
    }

   
 } 

