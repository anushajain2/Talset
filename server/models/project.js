const mongoose = require("mongoose");
const User = require("./user");

const projectSchema = new mongoose.Schema({
    question : {
        type : String
    },
    answer : {
        type : String
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project