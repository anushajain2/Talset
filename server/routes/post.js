const express = require("express");
const router = express.Router();
const multer = require("multer");
const {fileUploadMiddleware} = require("../middleware/upload");

const storage = multer.diskStorage({
    destination: './files',
    filename(req, file, cb) {
        cb(null, `new.mp4`);
    },
});

const upload = multer({ storage });

router.post("/upload/:id", upload.single('file'), fileUploadMiddleware);

module.exports = router;