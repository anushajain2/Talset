require("dotenv").config();
const readXlsxFile = require("read-excel-file/node");
const Skill = require("./server/config/db").Skill;

Skill.find({}, (err, docs) => console.log(docs));
