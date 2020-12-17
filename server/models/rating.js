const mongoose = require("mongoose");
const User = require("./user");

const ratingSchema = new mongoose.Schema({
    Rating_1 : {
        type : Number
    },
    Rating_2 : {
        type : Number
    },
    Rating_3 : {
        type : Number
    },
    Rating_4 : {
        type : Number
    },
    Rating_5 : {
        type : Number
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating