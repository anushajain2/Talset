const User = require("../config/db").User;

exports.getUser = async function(req, res, next){
    try{
        let user = await User.findOne({
            _id:req.params.id
        });
        return res.status(200).json({
            user
        });
    } catch (e) {
        return next({message : "Invalid User Id"});
    }
}
exports.editUser = async function(req,res,next){
    // TODO
}