const express = require("express");
const CourseRouter = express.Router();

const {PurchaseModel} = require("../db")
const {CourseModel}=require("../db")
const {userauth} = require("../middleware/user")

CourseRouter.post("/purchase",userauth,async function(req,res){
    const userId = req.userId;
    const courseId = req.body.courseId;

    await PurchaseModel.create({
        userId,
        courseId
    })

  res.json({ 
    msg : "You have purchased the course successfully"
  })

})


CourseRouter.get("/preview",async function(req,res){
   const courses = await CourseModel.find({});
    res.json({
        message : " Here is your courese",
        course : courses
    })
})

module.exports = {
    CourseRouter : CourseRouter
}