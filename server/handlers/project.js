const Project = require("../config/db").Project;
const User = require("../config/db").User;

exports.getNewProject = async function(req, res, next){} // TODO Get Random Question

exports.saveNewProject = async function (req, res, next) {
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

exports.getAllProjects = async function (req, res, next){
    try {
        Project.find({user: req.params.id}, function (err, projects){
            return res.status(200).json(
                projects
            );
        });
    } catch (e) {
        return next(e);
    }
}