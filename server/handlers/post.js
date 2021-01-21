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
                   Post.findByIdAndUpdate(req.params.postid,{$push:{likes:decoded.id}, $push: {likesTime:Date.now()/1000}}, {returnOriginal: false},function (e,docs) {
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

exports.trendingPosts = async function (req,res,next){
    try{
        //let posts = await Post.find();
        let posts = [
            {
                likesTime : [(Date.now()/1000)-36000,(Date.now()/1000)-360,(Date.now()/1000)-360],
                id : 1
            },
            {
                likesTime : [(Date.now()/1000)-36000,(Date.now()/1000)-360],
                id : 2
            },
            {
                likesTime : [(Date.now()/1000)-36000,(Date.now()/1000)-360,(Date.now()/1000)-360,(Date.now()/1000)-360],
                id : 3
            },
            {
                likesTime : [(Date.now()/1000)-36000,(Date.now()/1000)-360,(Date.now()/1000)-360,(Date.now()/1000)-360,(Date.now()/1000)-360],
                id : 4
            }
        ]
        let nums = [];
        for(let i =0;i<posts.length;i++){
            let count =0;
            for(let j=0;j<posts[i].likesTime.length; j++){
                if(posts[i].likesTime[j]>=(Date.now()/1000)-3600){
                    count++;
                }            }
            nums.push({postid: posts[i].id, count: count});
        }
        nums.sort((a,b) => {return b.count-a.count});
        nums.slice(0,11);
        return res.status(200).json(nums);

    } catch (e) {
        return next(e);
    }
}
