const express = require("express");
const AdminRouter = express.Router();

const {AdminModel, CourseModel} = require("../db");

const bcrypt=require("bcrypt");
const {z}= require("zod");
const jwt=require("jsonwebtoken");
const {JWT_ADMIN} = require("../config");

const {adminauth} = require("../middleware/admin");

AdminRouter.post('/signup', async function(req,res){
    const RequireBody=z.object({
        email:z.string().min(3).max(100).email(),
        password:z.string().min(3).max(50),
        firstname:z.string().min(3).max(50),
        lastname:z.string().min(3).max(50)
    })

    const ParsedData=RequireBody.safeParse(req.body);

    if(!ParsedData.success){
        res.json({
            msg:"invalid input format"
        })
    }

    const {email,password,firstname,lastname}=req.body;

    let errorThrow=false;
    try{
        const hashedPassword=await bcrypt.hash(password,5);

       const admin= await AdminModel.create({
            email:email,
            password:hashedPassword,
            firstname:firstname,
            lastname:lastname
        })
    } catch(e){
        errorThrow=true;
        res.json({
            msg:"useer already exist"
        })
        return;
    }
     if(!errorThrow){
        res.json({
            msg:"u have signed up"
        })
     }
})

AdminRouter.post('/signin',async function(req,res){

    const {email, password}=req.body;
    const admin=  await AdminModel.findOne({
        email:email
    })

    if(!admin){
        res.status(403).json({
            msg:"user not find"
        })
        return;
    }

    const ComparedPassword= await bcrypt.compare(password,admin.password);

    if(ComparedPassword){
         const token  = jwt.sign({
            id : admin._id
        },JWT_ADMIN);

        res.json({
            token : token
        })
    }

    else{
        res.status(403).json({
            msg: "incorrect password"
        })
    }

})
AdminRouter.post('/courses',adminauth,async function(req,res){
    const adminId=req.adminId;

    const {title,description,imageurl,price}=req.body;
     
    const course=await CourseModel.create({
        title:title,
        description:description,
        imageurl:imageurl,
        price:price,
        CreatorId:adminId
    })
    res.json({
        msg:"course created successfully mere bhai",
        courseId:course._id
    })



})

AdminRouter.put('/courseofadmin',adminauth,async function(req,res){
  const adminId=req.adminId;

  const {title,description,imageurl,price,courseId} = req.body;

  const course = await CourseModel.updateOne({
      _id:courseId,
      CreatorId : adminId
  },{
      title : title,
      description : description,
      imageurl : imageurl,
      price: price
  })

  res.json({
      message : "Course Updated",
      courseId : course._id
  })
})

AdminRouter.get('/all/courses',adminauth,async function(req,res){
    const adminId = req.adminId;

 const courses = await CourseModel.find({
    CreatorId : adminId
 });

 res.json({
    msg : "Your Courses are :",
    courses : courses
 })
})

module.exports = {
    AdminRouter : AdminRouter
}


