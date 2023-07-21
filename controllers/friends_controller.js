const User = require('../models/users');
const FriendShip = require('../models/friendship');


 module.exports.create = async function(req, res){
     try {

        let sender = req.user._id;
        let receiver = req.query.id;
        let status = "pending";


        let existingFriend = await FriendShip.findOne({
            $or:[
                { sender: req.user._id , receiver: req.query.id },
                { sender: req.query.id , receiver : req.user._id }
            ]
        });
        console.log(existingFriend);
        if(existingFriend){
            if(existingFriend.status=="pending"){
                console.log('Friend request alredy sent');
            }
            else{
                console.log('alerdy friend');
            }
            return res.redirect('back');
        }
        else{
            let friendship=  await FriendShip.create({
                sender : sender,
                receiver : receiver,
                status : status
            });

            // friend.friendships.push(newFriendship._id);
            // req.user.friendships.push(newFriendship._id);
            // req.user.save();
            // friend.save();
            console.log("Friend Request Sent", friendship);
            return res.redirect('back');
        }
        

       
    
         // console.log(friend.friendships);

        //  return res.json(200, {
        //      message :'Request successfull',
        //      data : {
        //          isFriend : isFriend,
        //          friends : req.user.friendships
        //      }
        //  })

     } catch (error) {
         console.log(error);
         return res.json(500, {
             message: 'Internal Server Error'
         });
     }   
 } 

 module.exports.accept = async function(req, res){
    try{
    let receiver = req.user._id;
    let sender = req.query.id;
    let status = "pending";



    let updatedrequest = await FriendShip.findOneAndUpdate(
        { sender: sender , receiver : receiver ,status : status }, // The query condition to find the document to update
        { status: 'accepted' }, // The new values to update
        { new: true } // Options: { new: true } to return the updated document, { new: false } to return the original document (default)
      );

    //   let friend2 = await User.findById(sender);
    //   req.user.friends.push(req.query._id);
    //   friend2.friends.push(req.user._id);
    //   sender.save();
    //   receiver.save();



      console.log('updated ', updatedrequest);
      return res.redirect('back');
    }
    catch(err){
        console.log('Error : ', err);

    }

 }

 module.exports.destroy = async function(req, res){
    try {
        let friendship = await FriendShip.findOne({
            $or:[
                { sender: req.user._id , receiver: req.query.id },
                { sender: req.query.id , receiver : req.user._id }
            ]
        });
        
        console.log( friendship);
        friendship.deleteOne();
        console.log('deleted');
        return res.redirect('back');
    } catch (error) {
        console.log("Error: ",error);
        return res.redirect('back');

    }
 }