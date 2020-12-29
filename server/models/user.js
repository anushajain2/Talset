const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    username : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    profilePic : {
        type: String
    },
    uploadedPosts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    watchedPosts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    bookmarks : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    watchLater : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    followers : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    inProgressPosts : [
        {
            post : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            },
            position : {
                type: Number
            }
        }

    ]
    // bookmarks
    // followers
    // following
});

userSchema.pre("save", async function(next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10);
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword, next) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        return next(err);
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;