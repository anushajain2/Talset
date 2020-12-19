const Project = require("../config/db").Project;
const User = require("../config/db").User;

exports.getProject = async function(req, res, next){} // TODO Get Random Question

exports.saveProject = async function (req, res, next) {
    try {
        let project = await Project.create({
            question : req.body.question,
            answer : req.body.answer,
            user : req.params.id
        });
        let user = await User.findById(req.params.id);
        user.projects.push(project.id);
        await user.save();
        return res.status(200).json(
            project
        );
    } catch (e) {
        return next(e);
    }
}