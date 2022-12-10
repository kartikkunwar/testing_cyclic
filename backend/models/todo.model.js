const mongoose=require("mongoose");

mongoose.set('strictQuery', true);

const todoSchema=mongoose.Schema({
    title:String,
    status:Boolean,
    userID:String
})

const Todomodel=mongoose.model("trytodo",todoSchema)

module.exports={Todomodel}