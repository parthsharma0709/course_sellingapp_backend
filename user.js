const jwt=require("jsonwebtoken")
const {JWT_USER} = require("../config");

function userauth(req,res,next){
    const token=req.headers.token;
    const decodeduser=jwt.verify(token,JWT_USER);
    if(decodeduser){
        req.userId= decodeduser._id;
        next();
    }
    else{
        res.staus(403).json({
            msg:"something went wrong"
        })
    }
}

module.exports={
    userauth:userauth
}