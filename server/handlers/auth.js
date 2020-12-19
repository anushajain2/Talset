const User = require("../config/db").User;
const jwt = require("jsonwebtoken");
const validator = require("email-validator");

exports.signin = async function(req, res, next) {
    // finding a User
    try {
        let user = await User.findOne({
            email: req.body.email
        });
        let { id, name, email } = user;
        let isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {
            let token = jwt.sign(
                {
                    id,
                    name,
                    email
                },
                process.env.SECRET_KEY
            );
            return res.status(200).json({
                id,
                name,
                email,
                token
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Email/Password."
            });
        }
    } catch (e) {
        return next({ status: 400, message: "Invalid Email/Password." });
    }
};

exports.signup = async function(req, res, next) {
    // Checking for invalid Email ID
    if(!validator.validate(req.body.email)){
        return next({
            status: 400,
            message: "Invalid Email"
        });
    }
    // Creating new User
    try {
        let user = await User.create(req.body);
        let { id, name, email } = user;
        let token = jwt.sign(
            {
                id,
                name,
                email
            },
            process.env.SECRET_KEY
        );
        return res.status(200).json({
            id,
            name,
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
