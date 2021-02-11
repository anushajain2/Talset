const User = require("../config/db").User;
const Post = require("../config/db").Post;

exports.getUser = async function (req, res, next) {
    try {
        let user = await User.findById(req.params.id).select(
            "-password -watchedPosts -bookmarks -watchLater -inProgressPosts"
        );
        let postsCount = user.uploadedPosts.length;
        let followersCount = user.followers.length;
        return res.status(200).json({
            user,
            postsCount,
            followersCount,
        });
    } catch (e) {
        return next({ message: "Invalid User Id" });
    }
};
exports.editUser = async function (req, res, next) {
    try {
        if (
            req.body.name !== undefined &&
            req.body.currentWork !== undefined &&
            req.body.bio !== undefined
        ) {
            let newUser = await User.findById(req.params.id);
            //, {name:req.body.name, currentWork:req.body.currentWork, bio: req.body.bio}
            if (req.body.name !== "") newUser.name = req.body.name;
            if (req.body.currentWork !== "")
                newUser.currentWork = req.body.currentWork;
            if (req.body.bio !== "") newUser.bio = req.body.bio;
            if (req.body.url !== "") newUser.profilePic = req.body.url;
            await newUser.save();
            let user = await User.findById(req.params.id).select(
                "-password -watchedPosts -bookmarks -watchLater -inProgressPosts"
            );
            let postsCount = user.uploadedPosts.length;
            let followersCount = user.followers.length;
            return res.status(200).json({
                user,
                postsCount,
                followersCount,
            });
        } else return next({ message: "Fields not correct" });
    } catch (e) {
        return next(e);
    }
};

exports.getAllUsers = async function (req, res, next) {
    try {
        let users = await User.find().select("-password"); // TODO : Need to select what all to send
        return res.status(200).json({
            users,
        });
    } catch (e) {
        return next({ message: "Couldn't find the users" });
    }
};

exports.bookmark = async function (req, res, next) {
    try {
        User.findByIdAndUpdate(
            req.params.id,
            { $push: { bookmarks: req.params.postid } },
            { returnOriginal: false },
            function (err, doc) {
                return res.status(200).json(doc);
            }
        );
    } catch (e) {
        return next(e);
    }
};

exports.watchLater = async function (req, res, next) {
    try {
        User.findByIdAndUpdate(
            req.params.id,
            { $push: { watchLater: req.params.postid } },
            { returnOriginal: false },
            function (err, doc) {
                return res.status(200).json(doc);
            }
        );
    } catch (e) {
        return next(e);
    }
};

exports.follow = async function (req, res, next) {
    try {
        User.findByIdAndUpdate(
            req.params.id,
            { $push: { following: req.params.followid } },
            { returnOriginal: false },
            function (err, doc) {
                User.findByIdAndUpdate(
                    req.params.followid,
                    {
                        $push: { followers: req.params.id },
                        $inc: { noOfFollowers: 1 },
                    },
                    { returnOriginal: false },
                    function (err2, doc2) {
                        return res.status(200).json(doc);
                    }
                );
            }
        );
    } catch (e) {
        return next(e);
    }
};

exports.putPostProgress = async function (req, res, next) {
    try {
        const user = await User.findById(req.params.id);
        function checkIfAlreadyThere(postId) {
            return String(postId.post.valueOf()) === req.params.postid;
        }
        let ifFound = await user.inProgressPosts.find(checkIfAlreadyThere);
        if (ifFound === undefined) {
            console.log(req.body.position);
            await user.inProgressPosts.push({
                post: req.params.postid,
                position: req.body.position,
            });
            await user.save();
        } else {
            let index = await user.inProgressPosts.findIndex(
                checkIfAlreadyThere
            );
            user.inProgressPosts[index].position = req.body.position;
            await user.save();
        }
        // TODO Update Learning mins for skill name
        return res.status(200).json({ message: "Successful" });
    } catch (e) {
        return next(e);
    }
};

exports.getPostProgress = async function (req, res, next) {
    try {
        const user = await User.findById(req.params.id);
        function checkIfAlreadyThere(postId) {
            return String(postId.post.valueOf()) === req.params.postid;
        }
        let ifFound = await user.inProgressPosts.find(checkIfAlreadyThere);
        if (ifFound === undefined) {
            return next({ message: "No post progress found" });
        } else {
            let index = await user.inProgressPosts.findIndex(
                checkIfAlreadyThere
            );
            return res.status(200).json(user.inProgressPosts[index].position);
        }
    } catch (e) {
        return next(e);
    }
};

exports.postCompleted = async function (req, res, next) {
    try {
        const user = await User.findById(req.params.id);
        const post = await Post.findById(req.params.postid);
        function checkIfAlreadyThere(skill) {
            return skill.skillName === post.skill.skillName;
        }
        let ifFound = await user.skill.find(checkIfAlreadyThere);
        if (ifFound === undefined) {
            await user.skill.push({
                skillName: post.skill.skillName,
                skillLearnt: [post.skill.skillLearnt],
            });
            user.save();
            return res.status(200).json(user);
        } else {
            let index = await user.skill.findIndex(checkIfAlreadyThere);
            user.save();
            await user.skill[index].skillLearnt.push(post.skill.skillLearnt);
            user.save();
            return res.status(200).json(user);
        }
    } catch (e) {
        return next(e);
    }
};
