const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
   text : {
       type: String,
       required : true
   },
    by : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    replies : [
        {
            text : {
                type: String,
                required: true
            },
            by : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        }
    ]
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;