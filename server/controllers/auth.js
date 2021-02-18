const User = require("../config/db").User;
const jwt = require("jsonwebtoken");
const validator = require("email-validator");

exports.signin = async function (req, res, next) {
    // finding a User
    try {
        let user = await User.findOne({
            email: req.body.email,
        });
        let { id, username, email } = user;
        // let isMatch = await user.comparePassword(req.body.password);
        if (true /*isMatch*/) {
            let token = jwt.sign(
                {
                    id,
                    username,
                    email,
                },
                process.env.SECRET_KEY
            );
            return res.status(200).json({
                id,
                username,
                email,
                token,
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Email/Password.",
            });
        }
    } catch (e) {
        return next({ status: 400, message: "Invalid Email/Password." });
    }
};

exports.signup = async function (req, res, next) {
    // Checking for non-empty fields
    if (
        !req.body.email ||
        !req.body.username ||
        !req.body.name ||
        !req.body.profilePic /*||
        !req.body.password*/
    ) {
        return next({
            status: 400,
            message: "Request Fields empty",
        });
    }
    // Checking for invalid Email ID
    if (!validator.validate(req.body.email)) {
        return next({
            status: 400,
            message: "Invalid Email",
        });
    }
    // Creating new User
    try {
        let user = await User.create(req.body);
        let { id, username, email } = user;
        let token = jwt.sign(
            {
                id,
                username,
                email,
            },
            process.env.SECRET_KEY
        );
        return res.status(200).json({
            id,
            username,
            email,
            token,
        });
    } catch (err) {
        // if (err.code === 11000) {
        //     err.message = "Sorry, that username and/or email is taken";
        // }
        return next({
            status: 400,
            message: err.message,
        });
    }
};
