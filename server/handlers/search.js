const User = require("../config/db").User;
const Post = require("../config/db").Post;

exports.searchPosts = async function (req,res,next) {
    try {

    } catch (e) {
        return next(e);
    }
}
//posts (skill learnt) -> one route getting top 5 results, another route all the results
//users (username) -> one route getting top 5 results, another route all the results