const User = require('../models/users');
const Post = require('../models/posts');
module.exports.home = async function(req, res)
 {

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate : {
                path:'user'
            },
            options:{
                sort: '-createdAt'
            }
        })
        return res.render('home', {
            title: "Home Page",
            items : posts
        });

    }
    catch(err){
        console.log("Error in finding user ",err)
    }

   
 } 

