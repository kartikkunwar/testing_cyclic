const mongoose=require("mongoose");

mongoose.set('strictQuery', true);

const signupSchema=mongoose.Schema({
    email:String,
    password:String
})

const Signupmodel=mongoose.model("jwt",signupSchema);

module.exports={Signupmodel}