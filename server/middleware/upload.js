const cloudinary = require('cloudinary').v2;
const ffmpeg = require("ffmpeg");
const fs = require("fs");
//const isImage = require('is-image');
const sharp = require('sharp');
const {isImage, isVideo} = require("./fileExtensions");


const User = require("../config/db").User;
const Post = require("../config/db").Post;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

exports.fileUploadMiddleware= async function (req, res, next) {
    if (req.files){
        let isValid = true;
        await req.files.forEach(function (file){
           if(!isVideo(file.path) && !isImage(file.path)){
               isValid = false;
           }
        });
        if(!isValid){
            await req.files.forEach(function (file){
                fs.unlinkSync(file.path);
            });
            return next({message:"One of the files is not a valid video/image file"});
        }
        let errorHappened = false;
        let errorMessage = "";
        let links=[];
        try{
            for(let i=0;i<req.files.length;i++) {
                if (isVideo(req.files[i].path)) {
                    console.log(req.files[i].path);
                    let process = new ffmpeg("./" + req.files[i].path);
                    await process.then(async function (video) {
                        console.log("in");
                        let newName = req.files[i].filename;

                        await video
                            .setVideoSize('720x1280', true, true, '#000000')
                            .save(`./newFiles/${newName}.mp4`, async function (error, file) {
                                //console.log(error);
                                if (!error) {
                                    console.log('Video file: ' + file);
                                    await cloudinary.uploader.upload(file, {
                                        resource_type: "video"
                                    }, async function (err, result) {
                                        if (err) {
                                            errorHappened = true;
                                            errorMessage = err;
                                            throw err;
                                        } else {
                                            console.log("in");
                                            await links.push(result.secure_url);
                                            fs.unlinkSync(file);
                                            fs.unlinkSync("./" + req.files[i].path);
                                            if(links.length === req.files.length){
                                                let date = new Date();
                                                console.log("date");
                                                let post = await Post.create({
                                                    title: req.body.title,
                                                    by: req.params.id,
                                                    postUrl: links,
                                                    timestamp : {
                                                        date : date.getDate(),
                                                        month : date.getMonth(),
                                                        year : date.getFullYear(),
                                                        hours : date.getHours(),
                                                        mins : date.getMinutes(),
                                                        secs : date.getSeconds()
                                                    }
                                                });
                                                let {id} =post;
                                                await User.findByIdAndUpdate(req.params.id, {$push: {uploadedPosts: id}});
                                                return res.status(200).json({
                                                    post
                                                });
                                            }

                                        }
                                    });
                                } else {
                                    errorHappened = true;
                                    errorMessage = error;
                                    throw error;
                                }
                            });

                    }, function (err) {
                        errorHappened = true;
                        errorMessage = err;
                        throw err;
                    });
                    if (errorHappened)
                        break;
                } else if (isImage(req.files[i].path)) {
                    let newName = req.files[i].filename;
                    await sharp("./" + req.files[i].path)
                        .resize(640, 480, {
                            kernel: sharp.kernel.nearest,
                            fit: 'contain',
                            background: {r: 255, g: 255, b: 255, alpha: 0.5}
                        })
                        .toFile(`./newFiles/${newName}.png`)
                        .then(async () => {
                            await cloudinary.uploader.upload(`./newFiles/${newName}.png`, async function (err, result) {
                                if (err) {
                                    errorHappened = true;
                                    errorMessage = err;
                                    throw err;
                                } else {
                                    console.log("in");
                                    await links.push(result.secure_url);
                                    fs.unlinkSync(`./newFiles/${req.files[i].filename}.png`);
                                    fs.unlinkSync("./" + req.files[i].path);
                                    if(links.length === req.files.length){
                                        let date = new Date();
                                        console.log("date");
                                        let post = await Post.create({
                                            title: req.body.title,
                                            by: req.params.id,
                                            postUrl: links,
                                            timestamp : {
                                                date : date.getDate(),
                                                month : date.getMonth(),
                                                year : date.getFullYear(),
                                                hours : date.getHours(),
                                                mins : date.getMinutes(),
                                                secs : date.getSeconds()
                                            }
                                        });
                                        let {id} =post;
                                        await User.findByIdAndUpdate(req.params.id, {$push: {uploadedPosts: id}});
                                        return res.status(200).json({
                                            post
                                        });
                                    }
                                }
                            });
                        });
                    if (errorHappened)
                        break;

                }
            }
        } catch (e) {
            return next(e);
        }


    } else {
        let err = {
            message: "Upload Failed / No file given"
        }
        return next(err);
    }

};