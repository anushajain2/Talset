const Skill = require("../config/db").Skill;

exports.getAllSkills = async function (req,res,next) {
    try{
        Skill.find(function (err,skills) {
           if(err)
               throw err;
           return res.status(200).json(skills);
        });
    } catch (e) {
        return next(e);
    }
}

exports.getOneSkill = async function (req,res,next) {
    try{
        Skill.findById(req.params.id,function (err,skills) {
            if(err)
                throw err;
            return res.status(200).json(skills);
        });
    } catch (e) {
        return next(e);
    }
}