require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./server/controllers/error");
const authRoutes = require("./server/routes/auth");
const userRoutes = require("./server/routes/user");
const postRoutes = require("./server/routes/post");
const commentRoutes = require("./server/routes/comment");
const skillRoutes = require("./server/routes/skill");
const searchRoutes = require("./server/routes/search");

const app = express();


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.send("hello");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/search", searchRoutes);

app.use(function (req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(errorHandler);

app.listen(5000, function () {
    console.log("Server is running on port 5000");
});

app.on("uncaughtException", function () {
    console.log("Crashed");
    app.close();
});

app.on("SIGTERM", function () {
    console.log("Kill");
    app.close();
});
