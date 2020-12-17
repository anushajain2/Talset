const User = require("../config/db").User;
const jwt = require("jsonwebtoken");

exports.signin = async function(req, res, next) {};

exports.signup = async function(req, res, next) {
    try {
        let user = await User.create(req.body);
        let { id, username, email } = user;
        let token = jwt.sign(
            {
                id,
                username,
                email
            },
            process.env.SECRET_KEY
        );
        return res.status(200).json({
            id,
            username,
            email,
            token
        });
    } catch (err) {
        if (err.code === 11000) {
            err.message = "Sorry, that username and/or email is taken";
        }
        return next({
            status: 400,
            message: err.message
        });
    }
};
