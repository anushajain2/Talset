const Post = require("../config/db").Post;
const Comment = require("../config/db").Comment;
const jwt = require("jsonwebtoken");

exports.createComment = async function (req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded) {
            const comment = new Comment({
                text : req.body.text,
                by : decoded.id,
                post : req.params.id
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