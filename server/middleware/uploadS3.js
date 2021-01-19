require('dotenv').config()
const awsSDK = require('aws-sdk');
const fs = require("fs");
const mime = require("mime-types");
const ffmpeg = require("ffmpeg");
const sharp = require('sharp');
const {isImage, isVideo} = require("./fileExtensions");


const User = require("../config/db").User;
const Post = require("../config/db").Post;

exports.fileUploadMiddlewareS3= async function (req, res, next) {
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
                                    await uploadFile(`${newName}.mp4`, file);
                                            console.log("in");

                                            await links.push("https://d2mimyecy1zro1.cloudfront.net/" + `${newName}.mp4`);
                                            fs.unlinkSync(file);
                                            fs.unlinkSync("./" + req.files[i].path);
                                            if(links.length === req.files.length){
                                                let date = new Date();
                                                console.log("date");
                                                let options = [];
                                                if(req.body.option1)
                                                    await options.push(req.body.option1);
                                                if(req.body.option2)
                                                    await options.push(req.body.option2);
                                                if(req.body.option3)
                                                    await options.push(req.body.option3);
                                                if(req.body.option4)
                                                    await options.push(req.body.option4);
                                                let post = await Post.create({
                                                    by: req.params.id,
                                                    postUrl: links,
                                                    timestamp : {
                                                        date : date.getDate(),
                                                        month : date.getMonth(),
                                                        year : date.getFullYear(),
                                                        hours : date.getHours(),
                                                        mins : date.getMinutes(),
                                                        secs : date.getSeconds()
                                                    },
                                                    skill : {
                                                        skillName : req.body.skillName,
                                                        skillLearnt : req.body.skillLearnt
                                                    },
                                                    question : {
                                                        title : req.body.questionTitle,
                                                        options: options,
                                                        correctAnswer : options[req.body.answer-1]
                                                    }
                                                });
                                                let {id} =post;
                                                await User.findByIdAndUpdate(req.params.id, {$push: {uploadedPosts: id}});
                                                return res.status(200).json({
                                                    post
                                                });
                                            }
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
                            await uploadFile(`${newName}.png`, `./newFiles/${newName}.png`);

                                    console.log("in");
                                    await links.push(process.env.CLOUDFRONT_URL + `${newName}.png`);
                                    fs.unlinkSync(`./newFiles/${req.files[i].filename}.png`);
                                    fs.unlinkSync("./" + req.files[i].path);
                                    if(links.length === req.files.length){
                                        let date = new Date();
                                        console.log("date");
                                        let options = [];
                                        if(req.body.option1)
                                            await options.push(req.body.option1);
                                        if(req.body.option2)
                                            await options.push(req.body.option2);
                                        if(req.body.option3)
                                            await options.push(req.body.option3);
                                        if(req.body.option4)
                                            await options.push(req.body.option4);
                                        let post = await Post.create({
                                            by: req.params.id,
                                            postUrl: links,
                                            timestamp : {
                                                date : date.getDate(),
                                                month : date.getMonth(),
                                                year : date.getFullYear(),
                                                hours : date.getHours(),
                                                mins : date.getMinutes(),
                                                secs : date.getSeconds()
                                            },
                                            skill : {
                                                skillName : req.body.skillName,
                                                skillLearnt : req.body.skillLearnt
                                            },
                                            question : {
                                                title : req.body.questionTitle,
                                                options: options,
                                                correctAnswer : options[req.body.answer-1]
                                            }
                                        });
                                        let {id} =post;
                                        await User.findByIdAndUpdate(req.params.id, {$push: {uploadedPosts: id}, $inc: {noOfPosts: 1}});
                                        return res.status(200).json({
                                            post
                                        });
                                    }
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

exports.fileDirectUploadMiddlewareS3= async function (req, res, next) {
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


                    await uploadFile(req.files[i].filename, req.files[i].path);
                            console.log("in");
                            await links.push(process.env.CLOUDFRONT_URL + req.files[i].filename);
                            fs.unlinkSync("./" + req.files[i].path);
                            if(links.length === req.files.length){
                                let date = new Date();
                                console.log("date");
                                let options = [];
                                if(req.body.option1)
                                    await options.push(req.body.option1);
                                if(req.body.option2)
                                    await options.push(req.body.option2);
                                if(req.body.option3)
                                    await options.push(req.body.option3);
                                if(req.body.option4)
                                    await options.push(req.body.option4);
                                let post = await Post.create({
                                    by: req.params.id,
                                    postUrl: links,
                                    timestamp : {
                                        date : date.getDate(),
                                        month : date.getMonth(),
                                        year : date.getFullYear(),
                                        hours : date.getHours(),
                                        mins : date.getMinutes(),
                                        secs : date.getSeconds()
                                    },
                                    skill : {
                                        skillName : req.body.skillName,
                                        skillLearnt : req.body.skillLearnt
                                    },
                                    question : {
                                        title : req.body.questionTitle,
                                        options: options,
                                        correctAnswer : options[req.body.answer-1]
                                    }
                                });
                                let {id} =post;
                                await User.findByIdAndUpdate(req.params.id, {$push: {uploadedPosts: id}});
                                return res.status(200).json({
                                    post
                                });
                            }



                    if (errorHappened)
                        break;
                } else if (isImage(req.files[i].path)) {

                    await uploadFile(req.files[i].filename, req.files[i].path);
                            console.log("in");
                            await links.push(process.env.CLOUDFRONT_URL + req.files[i].filename);
                            fs.unlinkSync("./" + req.files[i].path);
                            if(links.length === req.files.length){
                                let date = new Date();
                                console.log("date");
                                let options = [];
                                if(req.body.option1)
                                    await options.push(req.body.option1);
                                if(req.body.option2)
                                    await options.push(req.body.option2);
                                if(req.body.option3)
                                    await options.push(req.body.option3);
                                if(req.body.option4)
                                    await options.push(req.body.option4);
                                let post = await Post.create({
                                    by: req.params.id,
                                    postUrl: links,
                                    timestamp : {
                                        date : date.getDate(),
                                        month : date.getMonth(),
                                        year : date.getFullYear(),
                                        hours : date.getHours(),
                                        mins : date.getMinutes(),
                                        secs : date.getSeconds()
                                    },
                                    skill : {
                                        skillName : req.body.skillName,
                                        skillLearnt : req.body.skillLearnt
                                    },
                                    question : {
                                        title : req.body.questionTitle,
                                        options: options,
                                        correctAnswer : options[req.body.answer-1]
                                    }
                                });
                                let {id} =post;
                                await User.findByIdAndUpdate(req.params.id, {$push: {uploadedPosts: id}});
                                return res.status(200).json({
                                    post
                                });
                            }
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

exports.uploadS3= async function (req, res, next) {
    try{
        await uploadFile(req.file.filename, req.file.path);
        let urlResponse = process.env.CLOUDFRONT_URL + req.file.filename;
        fs.unlinkSync(req.file.path);
        return res.status(200).json(urlResponse);

    } catch (e) {
        return next(e);
    }

}

function uploadFile(filename, fileDirectoryPath) {
    awsSDK.config.update({ accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY });
    const s3 = new awsSDK.S3();

    return new Promise(function (resolve, reject) {
        fs.readFile(fileDirectoryPath.toString(), function (err, data) {
            if (err) { reject(err); }
            const conType = mime.lookup(fileDirectoryPath);
            s3.putObject({
                Bucket: '' + process.env.S3_BUCKET_NAME,
                Key: filename,
                Body: data,
                ContentType: conType,
                ACL: 'public-read'
            }, function (err, data) {
                if (err) reject(err);
                resolve("successfully uploaded");
            });
        });
    });
}