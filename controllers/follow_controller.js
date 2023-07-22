const User = require('../models/users');
const Follow = require('../models/follow');


 module.exports.create = async function(req, res){
     try {

        let sender = req.user._id;
        let receiver = req.query.id;


        // let existingFriend = await FriendShip.findOne({
        //     $or:[
        //         { sender: req.user._id , receiver: req.query.id },
        //         { sender: req.query.id , receiver : req.user._id }
        //     ]
        // });
        // console.log(existingFriend);
        // if(existingFriend){
        //     if(existingFriend.status=="pending"){
        //         console.log('Friend request alredy sent');
        //     }
        //     else{
        //         console.log('alerdy friend');
        //     }
        //     return res.redirect('back');
        // }
        // else{
            let follow =  await Follow.create({
                user1 : sender,
                user2 : receiver
            });

            // friend.friendships.push(newFriendship._id);
            // req.user.friendships.push(newFriendship._id);
            // req.user.save();
            // friend.save();
            console.log("Followed", follow);
            return res.redirect('back');
     }
 catch (error) {
         console.log(error);
         return res.json(500, {
             message: 'Internal Server Error'
         });
     }   
 } 

 module.exports.destroy = async function(req, res){
    try {
        let follow = await Follow.findOne({

                user1: req.user._id , user2: req.query.id 
        });
        
        console.log( follow);
        follow.deleteOne();
        console.log('deleted');
        return res.redirect('back');
    } catch (error) {
        console.log("Error: ",error);
        return res.redirect('back');

    }
 }