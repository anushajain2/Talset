const User = require("../config/db").User;

exports.getUser = async function(req, res, next){
    try{
        let user = await User.findById(req.params.id).select("-password");
        return res.status(200).json({
            user
        });
    } catch (e) {
        return next({message : "Invalid User Id"});
    }
}
exports.editUser = async function(req,res,next){
    try{
        await User.findByIdAndUpdate(req.params.id, req.body);
        let user = await User.findById(req.params.id).select("-password");
        return res.status(200).json({
            user
        })
    } catch (e) {
        return next(e);
    }
}

exports.getAllUsers = async function(req, res, next){
    try{
        let users = await User.find().select("-password");  // TODO : Need to select what all to send
        return res.status(200).json({
            users
        });
    } catch (e) {
        return next({message : "Couldn't find the users"});
    }
}

exports.bookmark = async function (req,res,next) {
    try {
        User.findByIdAndUpdate(req.params.id, {$push:{bookmarks : req.params.postid}}, {returnOriginal: false}, function (err, doc) {
            return res.status(200).json(doc);
        });
    } catch (e) {
        return next(e);
    }
}

exports.watchLater = async function (req,res,next) {
    try {
        User.findByIdAndUpdate(req.params.id, {$push:{watchLater : req.params.postid}}, {returnOriginal: false}, function (err, doc) {
            return res.status(200).json(doc);
        });
    } catch (e) {
        return next(e);
    }
}

exports.follow = async function (req,res,next) {
    try {
        User.findByIdAndUpdate(req.params.id, {$push:{following : req.params.followid}}, {returnOriginal: false}, function (err,doc) {
            User.findByIdAndUpdate(req.params.followid, {$push:{followers : req.params.id}}, {returnOriginal: false}, function (err2,doc2) {
                return res.status(200).json(doc);
            });
        });
    } catch (e) {
        return next(e);
    }
}

exports.putPostProgress = async function (req,res,next) {
    try {
        const user = await User.findById(req.params.id);
        function checkIfAlreadyThere(postId){
            return String(postId.post.valueOf())===req.params.postid;
        }
        let ifFound = user.inProgressPosts.find(checkIfAlreadyThere);
        if(ifFound === undefined){
            user.inProgressPosts.push({
                post: req.params.postid,
                position: req.body.position
            });
            await user.save();
        }
        else {
            let index = user.inProgressPosts.findIndex(checkIfAlreadyThere);
            user.inProgressPosts[index].position = req.body.position;
            await user.save();
        }
        return res.status(200).json({position : req.body.position});
    } catch (e) {
        return next(e);
    }
}

exports.getPostProgress = async function (req,res,next) {
    try {
        const user = await User.findById(req.params.id);
        function checkIfAlreadyThere(postId){
            return String(postId.post.valueOf())===req.params.postid;
        }
        let ifFound = user.inProgressPosts.find(checkIfAlreadyThere);
        if(ifFound === undefined){
            return next({message : "No post progress found"});
        }
        else {
            let index = user.inProgressPosts.findIndex(checkIfAlreadyThere);
            return res.status(200).json(user.inProgressPosts[index].position);

        }
    } catch (e) {
        return next(e);
    }
}