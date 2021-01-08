const mongoose = require("mongoose");

mongoose.set("debug", true);
mongoose.Promise = Promise;

const uri = "mongodb+srv://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@cluster0.frcnf.mongodb.net/"+process.env.DB_DBNAME+"?retryWrites=true&w=majority";
mongoose.connect(uri, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(r => console.log("MongoDB database connection established successfully"));

module.exports.User = require("../models/user");
module.exports.Post = require("../models/post");
module.exports.Comment = require("../models/comment");
module.exports.Skill = require("../models/skill");