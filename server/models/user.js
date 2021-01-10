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
        type: String,
        default: "https://www.dpair.com/wp-content/uploads/2017/03/Facebook-Blank-Photo.jpg"
    },
    currentWork : {
        type: String,
        default: "Mention your Work Place Here"
    },
    bio :{
        type: String,
        default: "Tell More About Yourself Here"
    },
    learningMins : {
        type: Number,
        default : 0
    },
    streak : {
        type: Number,
        default : 0
    },
    uploadedPosts : {
        type : [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Post"
                    }
                    ],
        default : []
    },
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
    followers : {
        type : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
            ],
        default : []
    },
    following : {
        type : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
            ],
        default : []
    },
    inProgressPosts : [
        {
            post : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            },
            position : {
                type: Number,
                required: true
            }
        }

    ],
    skill : {
        type : [
            {
                skillName : {
                    type: String
                },
                skillLearnt : [
                    {
                        type: String
                    }
                ],
                learningMins : {
                    type: Number
                }
            }
            ],
        default : []
    }
    // bookmarks
    // followers
    // following
    // skill learnt
    // skill array progress
    // subtopic

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