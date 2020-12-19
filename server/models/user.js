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
    currentTitle : {
        type: String
    },
    experience : {
        type: Object
    },
    profilePic : {
        type: String
    },
    projects : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ],
    ratings : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    }
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