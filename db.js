const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const UserSchema= new Schema({
    email:{type:String, unique :true},
    password: String,
    firstname:String,
    lastname:String  
})


const AdminSchema=new Schema({
    email:{type:String,unique:true},
    password:String,
    firstname:String,
    lastname:String,
})

 
const CourseSchema= new Schema({
    title:String,
    description:String,
    price:Number,
    imageurl:String,
    CreatorId: String
})

const PurchaseSchema= new Schema({
    courseId:ObjectId,
    userId:ObjectId
})

const UserModel=mongoose.model("user",UserSchema);
const AdminModel= mongoose.model("admin",AdminSchema);
const CourseModel= mongoose.model("courses",CourseSchema);
const PurchaseModel= mongoose.model("purchases",PurchaseSchema);

module.exports={
    UserModel,
    AdminModel,
    CourseModel,
    PurchaseModel
}
