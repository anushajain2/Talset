const User = require("../config/db").User;
const Post = require("../config/db").Post;

exports.searchTopPosts = async function (req,res,next) {
    try {
        Post.find({"skill.skillLearnt" : {$regex: req.body.searchText, $options: "i"}})
            .sort({"likes": -1})
            .select("id by skill")
            .limit(5)
            .exec(function(err, posts){
            if(err)
                throw err;
            return res.status(200).json(posts);
        })
    } catch (e) {
        return next(e);
    }
}

exports.searchAllPosts = async function (req,res,next) {
    try {
        Post.find({"skill.skillLearnt" : {$regex: req.body.searchText, $options: "i"}})
            .sort({"likes": -1})
            .select("id by skill")
            .exec(function(err, posts){
                if(err)
                    throw err;
                return res.status(200).json(posts);
            })
    } catch (e) {
        return next(e);
    }
}

exports.searchTopUsers = async function (req,res,next) {
    try {
        User.find({username : {$regex: req.body.searchText, $options: "i"}})
            .select("id name username profilePic")
            .limit(5)
            .exec(function(err, posts){
                if(err)
                    throw err;
                return res.status(200).json(posts);
            })
    } catch (e) {
        return next(e);
    }
}

exports.searchAllUsers = async function (req,res,next) {
    try {
        User.find({username : {$regex: req.body.searchText, $options: "i"}})
            .select("id name username profilePic")
            .exec(function(err, posts){
                if(err)
                    throw err;
                return res.status(200).json(posts);
            })
    } catch (e) {
        return next(e);
    }
}
//posts (skill learnt) -> one route getting top 5 results, another route all the results
//users (username) -> one route getting top 5 results, another route all the results