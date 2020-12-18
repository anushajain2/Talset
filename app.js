require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./server/handlers/error");
const authRoutes = require("./server/routes/auth");
const userRoutes = require("./server/routes/user");
const db = require("./server/config/db");

const app = express();

app.use(bodyParser.json());

app.get("/", function (req,res){
    res.send("hello");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


app.use(function (req,res,next){
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(errorHandler);

app.listen(3000, function (){
    console.log("Server is running on port 3000");
});