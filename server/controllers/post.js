const User = require("../config/db").User;
const Post = require("../config/db").Post;
const jwt = require("jsonwebtoken");
const fs = require("fs");
const awsSDK = require("aws-sdk");
const mime = require("mime-types");

exports.video = async function (req, res, next) {
    const post = await Post.findById(req.params.id);
    const splits = post.postUrl[0].split("/");
    const file = splits[splits.length - 1];
    awsSDK.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
    const s3 = new awsSDK.S3();
    s3.listObjectsV2(
        {
            Bucket: "" + process.env.S3_BUCKET_NAME,
            MaxKeys: 1,
            Prefix: file,
        },
        function (err, data) {
             if (err) {
                 return res.sendStatus(404);
             }
            //console.log(data);
            var mimetype = mime.lookup(file);
            console.log(req.headers.range);

             if (req != null && req.headers.range != null) {
                 var range = req.headers.range;
                 var bytes = range.replace(/bytes=/, "").split("-");
                 var start = parseInt(bytes[0], 10);

                 var total = data.Contents[0].Size;
                 var end = bytes[1] ? parseInt(bytes[1], 10) : total - 1;
                 var chunksize = end - start + 1;
                 

                 res.writeHead(206, {
                     "Content-Range":
                         "bytes " + start + "-" + end + "/" + total,
                     "Accept-Ranges": "bytes",
                     "Content-Length": chunksize,
                     "Last-Modified": data.Contents[0].LastModified,
                     "Content-Type": mimetype,
                 });

                 s3.getObject({
                     Bucket: "" + process.env.S3_BUCKET_NAME,
                     Key: file,
                     Range: range,
                 })
                     .createReadStream()
                     .pipe(res);
             } else {
                 res.writeHead(200, {
                    //  "Cache-Control": "max-age=" + cache + ", private",
                     "Content-Length": data.Contents[0].Size,
                     "Last-Modified": data.Contents[0].LastModified,
                     "Content-Type": mimetype,
                 });
                 s3.getObject({
                     Bucket: "" + process.env.S3_BUCKET_NAME,
                     Key: file,
                 })
                     .createReadStream()
                     .pipe(res);
             }
        }
    );
    //console.log(filename);
    // const path = new URL("/",post.postUrl[0]);
    // const stat = fs.statSync(path);
    // const fileSize = stat.size;
    // const range = req.headers.range;
    // if (range) {
    //     const parts = range.replace(/bytes=/, "").split("-");
    //     const start = parseInt(parts[0], 10);
    //     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    //     const chunksize = end - start + 1;
    //     const file = fs.createReadStream(path, { start, end });
    //     const head = {
    //         "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    //         "Accept-Ranges": "bytes",
    //         "Content-Length": chunksize,
    //         "Content-Type": "video/mp4",
    //     };
    //     res.writeHead(206, head);
    //     file.pipe(res);
    // } else {
    //     const head = {
    //         "Content-Length": fileSize,
    //         "Content-Type": "video/mp4",
    //     };
    //     res.writeHead(200, head);
    //     fs.createReadStream(path).pipe(res);
    // }
}

exports.getAllPosts = async function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) {
                return next(err);
            }
            Post.find({ _id: { $ne: "603682af4e7abdd0376b2161" } })
                .populate({ path: "by", select: ["username", "name"] })
                .lean()
                .exec(async function (err, docs) {
                    const user = await User.findById(decoded.id);
                    function checkView(doc) {
                        function checkIfAlreadyViewed(postId) {
                            return (
                                String(postId.valueOf()) ===
                                String(doc._id.valueOf())
                            );
                        }
                        let ifFound = user.watchedPosts.find(
                            checkIfAlreadyViewed
                        );
                        //console.log(doc._id, ifFound);
                        if (ifFound === undefined) return true;
                        else return false;
                    }

                    await docs.forEach(async (doc, index, arr) => {
                        doc.isLiked = false;
                        doc.isFollowing = false;
                        await doc.likes.forEach((like) => {
                            //console.log("2");
                            if (like === decoded.id) {
                                doc.isLiked = true;
                            }
                        });
                        //console.log(user);
                        await user.following.forEach((follow) => {
                            if (
                                String(follow.valueOf()) ===
                                String(doc.by._id.valueOf())
                            ) {
                                doc.isFollowing = true;
                            }
                        });
                    });
                    let docsNotViewed = await docs.filter(checkView);
                    if (docsNotViewed.length === 0) {
                        return res.status(200).json(docs);
                    }
                    let postView = await Post.findById(
                        "603682af4e7abdd0376b2161"
                    );
                    shuffle(docsNotViewed);
                    docsNotViewed.push(postView);
                    docsNotViewed.push(...docs);
                    return res.status(200).json(docsNotViewed);
                });
        });
    } catch (e) {
        return next(e);
    }
};

exports.getPostsById = async function (req, res, next) {
    try {
        Post.findById(req.params.postid, (err, doc) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json(doc);
        });
    } catch (e) {
        return next(e);
    }
};

exports.getUserPosts = async function (req, res, next) {
    try {
        await Post.find({ by: req.params.id }, function (err, docs) {
            return res.status(200).json(docs);
        });
    } catch (e) {
        return next(e);
    }
};

exports.getUserPostsSpecific = async function (req, res, next) {
    try {
        const specificDoc = await Post.findById(req.params.postid).populate({ path: "by", select: ["username", "name"] });
        const docs = await Post.find({
            _id: { $ne: req.params.postid },
            by: req.params.id,
        }).populate({ path: "by", select: ["username", "name"] });
        return res.status(200).json([specificDoc, ...docs]);
    } catch (e) {
        return next(e);
    }
};

exports.likePosts = async function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) {
                return next(err);
            }
            Post.findById(req.params.postid, function (err1, posts) {
                if (err1) {
                    return next(err);
                }
                function checkIfAlreadyLiked(userId) {
                    return String(userId.valueOf()) === decoded.id;
                }
                let ifFound = posts.likes.find(checkIfAlreadyLiked);
                if (ifFound === undefined) {
                    Post.findByIdAndUpdate(
                        req.params.postid,
                        {
                            $push: {
                                likes: decoded.id,
                                likesTime: Date.now() / 1000,
                            },
                        },
                        { returnOriginal: false },
                        function (e, docs) {
                            if (e) {
                                return next(e);
                            }
                            return res.status(200).json({
                                likes: docs.likes,
                                number: docs.likes.length,
                            });
                            // return count too
                        }
                    );
                } else {
                    Post.findByIdAndUpdate(
                        req.params.postid,
                        {
                            $pull: { likes: decoded.id },
                        },
                        { returnOriginal: false },
                        function (e, docs) {
                            if (e) {
                                return next(e);
                            }
                            return res.status(200).json({
                                likes: docs.likes,
                                number: docs.likes.length,
                            });
                            // return count too
                        }
                    );
                }
            });
        });
    } catch (e) {
        return next(e);
    }
};

exports.trendingPosts = async function (req, res, next) {
    try {
        //let posts = await Post.find();
        let posts = [
            {
                likesTime: [
                    Date.now() / 1000 - 36000,
                    Date.now() / 1000 - 360,
                    Date.now() / 1000 - 360,
                ],
                id: 1,
            },
            {
                likesTime: [Date.now() / 1000 - 36000, Date.now() / 1000 - 360],
                id: 2,
            },
            {
                likesTime: [
                    Date.now() / 1000 - 36000,
                    Date.now() / 1000 - 360,
                    Date.now() / 1000 - 360,
                    Date.now() / 1000 - 360,
                ],
                id: 3,
            },
            {
                likesTime: [
                    Date.now() / 1000 - 36000,
                    Date.now() / 1000 - 360,
                    Date.now() / 1000 - 360,
                    Date.now() / 1000 - 360,
                    Date.now() / 1000 - 360,
                ],
                id: 4,
            },
        ];
        let nums = [];
        for (let i = 0; i < posts.length; i++) {
            let count = 0;
            for (let j = 0; j < posts[i].likesTime.length; j++) {
                if (posts[i].likesTime[j] >= Date.now() / 1000 - 3600) {
                    count++;
                }
            }
            nums.push({ postid: posts[i].id, count: count });
        }
        nums.sort((a, b) => {
            return b.count - a.count;
        });
        nums.slice(0, 11);
        return res.status(200).json(nums);
    } catch (e) {
        return next(e);
    }
};

exports.viewPost = async function (req, res, next) {
    try {
        Post.findByIdAndUpdate(
            req.params.postid,
            { $inc: { views: 1 } },
            { returnOriginal: false },
            (err, doc) => {
                if (err) return next(err);
                User.findByIdAndUpdate(
                    req.params.id,
                    {
                        $push: { watchedPosts: req.params.postid },
                    },
                    (errr, docs) => {
                        if (errr) return next(errr);
                        return res.status(200).json(doc);
                    }
                );
                // Todo
            }
        );
    } catch (e) {
        return next(e);
    }
};

exports.incShare = function (req, res, next) {
    try {
        Post.findByIdAndUpdate(
            req.params.postid,
            { $inc: { shares: 1 }  },
            { returnOriginal: false },
            (err, doc) => {
                return res.status(200).json(doc);
            }
        );
    } catch (e) {
        return next(e);
    }
};

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
