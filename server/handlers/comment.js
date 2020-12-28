const Post = require("../config/db").Post;
const Comment = require("../config/db").Comment;
const jwt = require("jsonwebtoken");

exports.createComment = async function (req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
            let date = new Date();
            const comment = new Comment({
                text : req.body.text,
                by : decoded.id,
                post : req.params.id,
                timestamp : {
                    date : date.getDate(),
                    month : date.getMonth(),
                    year : date.getFullYear(),
                    hours : date.getHours(),
                    mins : date.getMinutes(),
                    secs : date.getSeconds()
                }
            });
            await comment.save();
            Post.findByIdAndUpdate(req.params.id, {$push : {comments : comment.id}}, {returnOriginal: false}, function (err, docs) {
                return res.status(200).json({
                    docs,
                    comment
                });
            });

        });
    } catch (e) {
        return next(e);
    }
}

exports.getAllComments = async function (req,res,next) {
    try {
        Comment.find({post:req.params.id}, function (err,docs) {
            return res.status(200).json(docs);
        });
    } catch (e) {
        return next(e);
    }
}

exports.newReply = async function (req,res,next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
            Comment.findByIdAndUpdate(req.params.id, {$push :{replies : {text : req.body.text, by : decoded.id}}}, {returnOriginal: false},  function (err, docs) {
                return res.status(200).json({docs});
            });
        });

    } catch (e) {
        return next(e);
    }
}

exports.getReplyAndComment = async function (req,res,next) {
    try {
        Comment.findById(req.params.id, function (err, docs) {
            return res.status(200).json({docs});
        });
    } catch (e) {
        return next(e);
    }
}

exports.likeComment = async function (req,res,next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
            Comment.findById(req.params.id, function (err, comments){
                function checkIfAlreadyLiked(userId){
                    return String(userId.valueOf())===decoded.id;
                }
                let ifFound = comments.likes.find(checkIfAlreadyLiked);
                if(ifFound === undefined){
                    Comment.findByIdAndUpdate(req.params.id,{$push:{likes:decoded.id}}, {returnOriginal: false},function (e,docs) {
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

// exports.likeReply = async function (req,res,next) {
//     try {
//
//     } catch (e) {
//         return next(e);
//     }
// }