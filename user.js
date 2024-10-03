
const express = require("express");
const UserRouter = express.Router();
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_USER} = require("../config");

const {UserModel, PurchaseModel,CourseModel} = require("../db");
const {userauth}=require("../middleware/user")

UserRouter.post('/signup',async function(req,res){
    // zod se input validation
    const  RequireBody=z.object({
        email:z.string().min(3).max(50).email(),
        password: z.string().min(3).max(100),
        firstname: z.string().min(3).max(100),
        lastname: z.string().min(3).max(100)
        
    })

    const ParsedData  = RequireBody.safeParse(req.body);
  
     if(!ParsedData.success)
{
    res.json({
        msg: "invalid input  format",
        error: ParsedData.error
    })
    return ;
}

    const {email,password,firstname,lastname}=req.body;
     let errorThrow= false;
     try{
        const hashedPassword= await bcrypt.hash(password,5);
        await UserModel.create({
            email: email,
            password: hashedPassword,
            firstname:firstname,
            lastname:lastname
        })
        // throw error
     } catch(e){
        errorThrow=true;
        res.json({
            msg:"user already exists"
        })
        return ;
     }

     if(!errorThrow){
        res.json({
            msg:"u have signed up"
        })
     }

     


})

UserRouter.post('/signin', async function(req,res){

    const { email ,password}= req.body;

    const user= await UserModel.findOne({
        email: email
    })

    if(!user){
        res.status(403).json({
            msg:"user not find"
        })
    }

    const ComparedPassword= await bcrypt.compare(password,user.password);

    if(ComparedPassword){
         const token  = jwt.sign({
            id : user._id
        },JWT_USER);

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

UserRouter.get('/purchases',userauth, async function(req,res){
    const userId = req.userId;
     
    const purchases  = await PurchaseModel.find({
        userId : userId
    })
    const courseData = await CourseModel.find({
        _id : { $in: purchases.map(x => x.courseId) }    
    })

    res.json({
        purchases,
        courseData 
    })
}) 

module.exports = {
    UserRouter : UserRouter
}