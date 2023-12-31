const User = require('../models/users');
const Post = require('../models/posts');
const Reaction = require('../models/reactions');
const FriendShip = require('../models/friendship');
const Follow = require('../models/follow');
module.exports.home = async function (req, res) {

    try {
        let friends = await FriendShip.find(
            {
                $or: [
                    { sender: req.user._id },
                    { receiver: req.user._id }
                ], status: 'accepted'
            }).populate('sender').populate('receiver');

            // console.log(friends);

        let friendsPost = [req.user.id];
        let i = 1;
        // console.log(friends);
        for (let f of friends) {
            if (f.sender.id == req.user.id) {
                friendsPost[i++] = f.receiver.id;

            } else {

                friendsPost[i++] = f.sender.id;

            }
        }
        // console.log(friendsPost);
        let posts = await Post.find({ user: { $in: friendsPost } })
            .sort('-createdAt')
            .populate('user')
            .populate('reactions')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'user',
                    },
                    {
                        path: 'reactions',
                    },
                ],
                options: {
                    sort: '-createdAt',
                },
            });

            let following = await Follow.find(
                    { user1 : req.user
            }).populate('user2').populate('user1');
            let friendsPage = await FriendShip.find(
                {

                    sender: req.user.id ,
                    status: 'accepted',
                }).populate('sender').populate('receiver');
            let followingPosts = [req.user.id];
            let j = 1;

                for(let fp of friendsPage){
                    followingPosts[j++] = fp.receiver.id;
                }
            // console.log(friends);
            for (let f of following) {
                followingPosts[j++] = f.user2.id;
            }
            console.log(following );
            // following += followingPosts;
            // console.log(followingPosts);


            let postsCeleb = await Post.find({ user: { $in: followingPosts } })
            .sort('-createdAt')
            .populate('user')
            .populate('reactions')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'user',
                    },
                    {
                        path: 'reactions',
                    },
                ],
                options: {
                    sort: '-createdAt',
                },
            });
            // console.log(postsCeleb);



        let friendRequests = await FriendShip.find({ receiver: req.user._id, status: 'pending' }).populate('sender');


        let users = await User.find({});

        let organizationORceleb = await User.find({isceleb_organization:true});


        let reactionComment = await Reaction.find({
            user: req.user,
            onModel: "Comment"
        }).populate('likeable').populate('onModel');

        let reactionPost = await Reaction.find({
            user: req.user,
            onModel: "Post"
        }).populate('likeable').populate('onModel');

        // console.log(reaction.user._id);
        // console.log(reactionComment);

        return res.render('home', {
            title: "Home Page",
            items: posts,
            reactionComment: reactionComment,
            reactionPost: reactionPost,
            all_users: users,
            friendRequests: friendRequests,
            friends: friends,
            celebORorgan : organizationORceleb,
            itemsOrganization : postsCeleb,
            following : following,
            friendsPage : friendsPage
        });

    }
    catch (err) {
        console.log("Error in finding user ", err)
    }


}

