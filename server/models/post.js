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
    views : {
        type: Number,
        default: 0
    },
    likes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: "true"
        }
    ],
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        // replies
        // liking comment
        // day and time
        // starting from where video stopped
        // bookmarks
        // watch later
        // Comments linking
        // pics upload
        // multiple posts
        // skill and subtopic - new model
        // skill learnt - post and user
    ],
    timestamp : {
        date : {
            type : Number
        },
        month : {
            type : Number
        },
        year : {
            type : Number
        },
        hours : {
            type : Number
        },
        mins : {
            type : Number
        },
        secs : {
            type : Number
        }
    },
    skill : {
        skillName : {
            type: String
        },
        skillLearnt : {
            type: String
        }
    },

    postUrl: [
        {
            type: String
        }
    ]
});
// video thumbnails
// search

const Post = mongoose.model("Post", postSchema);

module.exports = Post;