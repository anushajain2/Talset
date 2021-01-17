const Post = require("../config/db").Post;
const jwt = require("jsonwebtoken");

exports.getAllPosts = async function (req,res,next){
    try{
        await Post.find(function (err,docs) {
           return res.status(200).json(docs);
        });
    } catch (e) {
        return next(e);
    }
}

exports.getUserPosts = async function (req, res, next) {
    try {
        await Post.find({by: req.params.id}, function (err, docs) {
            return res.status(200).json(docs);
        });
    } catch (e) {
        return next(e);
    }
};

exports.likePosts = async function (req,res,next){
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
            Post.findById(req.params.postid, function (err, posts){
               function checkIfAlreadyLiked(userId){
                   return String(userId.valueOf())===decoded.id;
               }
               let ifFound = posts.likes.find(checkIfAlreadyLiked);
               if(ifFound === undefined){
                   Post.findByIdAndUpdate(req.params.postid,{$push:{likes:decoded.id}}, {returnOriginal: false},function (e,docs) {
                       if(e){
                           return next(e);
                       }
                       return res.status(200).json({
                           likes: docs.likes,
                           number: docs.likes.length
                       });
                       // return count too
                   });
               }
               else {
                   return next({
                       message: "Already Liked"
                   });
               }
            });

        });
    } catch (e) {
        return next(e);
    }
}
