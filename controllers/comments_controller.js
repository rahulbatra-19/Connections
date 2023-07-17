const Comments = require('../models/comments');
const Post = require('../models/posts');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comments.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
        }
        res.redirect('back');
    }
    catch{
        console.log('Error in creating comments');
    }
}

module.exports.destroy = function(req, res){

        Comments.findById(req.params.id).then(
            comment => {
                if(comment.user.toString() === req.user.id ){
                    let postId = comment.post;

                    comment.deleteOne();
                

                Post.findByIdAndUpdate(postId , {$pull: {comments: req.params.id}}).then(()=>{

                    return res.redirect('back');
                }).catch(err =>{

                    return res.redirect('back');
                })
                }}
        ).catch (error =>{
        console.log('Error in destroying comments ', error );
    });
}