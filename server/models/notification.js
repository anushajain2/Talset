const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender_username : {
        type: String
    },
    activity_type:{
        type: String //"Comment on your post" or "Followed you" or "Replied to your comment" etc
    },
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
    is_unread :{
        type: Boolean,
        default: true
    }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;