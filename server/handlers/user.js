const User = require("../config/db").User;

exports.getUser = async function(req, res, next){
    try{
        let user = await User.findById(req.params.id).select("-password");
        return res.status(200).json({
            user
        });
    } catch (e) {
        return next({message : "Invalid User Id"});
    }
}
exports.editUser = async function(req,res,next){
    try{
        await User.findByIdAndUpdate(req.params.id, req.body);
        let user = await User.findById(req.params.id).select("-password");
        return res.status(200).json({
            user
        })
    } catch (e) {
        return next(e);
    }
}

exports.getAllUsers = async function(req, res, next){
    try{
        let users = await User.find().select("-password");  // TODO : Need to select what all to send
        return res.status(200).json({
            users
        });
    } catch (e) {
        return next({message : "Couldn't find the users"});
    }
}