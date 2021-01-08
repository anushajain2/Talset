const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true
    },
    subtopic : [
        {
            name: {
                type: String
            }
        }
    ]
});

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;