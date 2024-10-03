require("dotenv").config()
const express= require("express");
const mongoose= require("mongoose");
const {UserRouter} = require("./Router/user");
const {CourseRouter} = require("./Router/course")
const {AdminRouter} = require("./Router/admin")

const jwt = require("jsonwebtoken");

const app= express();
app.use(express.json());

app.use('/user', UserRouter);
app.use('/admin', AdminRouter);
app.use('/course', CourseRouter);

async function  main(){
  await  mongoose.connect(process.env.MONGO_URL);
  app.listen(3000);
  console.log("listening at port 3000 in your service sir");
}
 main();