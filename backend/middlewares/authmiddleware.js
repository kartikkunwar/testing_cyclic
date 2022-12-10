const jwt=require("jsonwebtoken")

const authMiddleware=(req,res,next)=>{
       const token=req.headers?.authorization?.split(" ")[1];
       if(token){
        const decoded=jwt.verify(token,'code');
        if(decoded){
            const userID=decoded.userID
            req.body.userID=userID
            next();
        }else{
            res.send({"msg":"please login"})
        }
       }else{
         res.send({"msg":"please take token"})
       }
}

module.exports={authMiddleware}