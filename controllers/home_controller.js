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

// const { Post, upload } = require('../models/posts');

// module.exports.home = async function (req, res) {
//   try {
//     // Use the upload middleware in the route handler
//     upload(req, res, function (err) {
//       if (err) {
//         console.log(err);
//         // Handle the error
//         // Return an appropriate response
//       }

//       let posts = Post.find({})
//         .sort('-createdAt')
//         .populate('user')
//         .catch(err=>{
//             console.log(err);
//         });
//         console.log(posts);

//       return res.render('home', {
//         title: 'Home Page',
//         items: posts
//       });
//     });
//   } catch (err) {
//     console.log('Error in finding user', err);
//     // Handle the error
//     // Return an appropriate response
//   }
// };
