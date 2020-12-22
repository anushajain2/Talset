const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    by : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    videoURL : {
        type: String,
        required: true
    },
    views : {
        type: Number,
        default: 0
    },
    likes : {
        type: Number,
        default: 0
    },
    comments : [
        {
            comment : {
                type: String
            },
            by : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ]

});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;