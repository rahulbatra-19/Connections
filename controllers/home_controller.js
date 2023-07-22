const User = require('../models/users');
const Post = require('../models/posts');
const Reaction = require('../models/reactions');
const FriendShip = require('../models/friendship');
module.exports.home = async function(req, res)
 {

    try{
        let friends = await FriendShip.find(
            {$or:[
                { sender: req.user._id },
                { receiver : req.user._id }
            ], status:'accepted'  }).populate('sender').populate('receiver');

            let friendsPost = [req.user._id];
            let i =1;
            for(let f of friends){
                if(f.sender.id == req.user._id)
                {
                    friendsPost[i++] = f.receiver.id;

                }else{

                    friendsPost[i++]  = f.sender.id;

                }
            }
            // console.log(friendsPost);

        let posts = await Post.find({user :{ $in: friendsPost }})
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
        });


        let friendRequests = await FriendShip.find({receiver: req.user._id , status:'pending'  }).populate('sender');
  

        let users = await User.find({});


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
            reactionPost : reactionPost,
            all_users : users,
            friendRequests : friendRequests,
            friends : friends
        });

    }
    catch(err){
        console.log("Error in finding user ",err)
    }

   
 } 

