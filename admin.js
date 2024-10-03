const jwt=require("jsonwebtoken")
const {JWT_ADMIN} = require("../config");

function adminauth(req,res,next){
    const token=req.headers.token;
    const decodedadmin=jwt.verify(token,JWT_ADMIN);
    if(decodedadmin){
        req.adminId= decodedadmin._id;
        next();
    }
    else{
        res.staus(403).json({
            msg:"something went wrong"
        })
    }
}

module.exports={
    adminauth:adminauth
}