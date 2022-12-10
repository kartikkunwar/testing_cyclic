const express= require("express");
const cors = require('cors')

const app=express();

const {todoRouter,signRouter}=require("./routes/todo.routes")
const {connection}=require("./config/db");
const { authMiddleware } = require("./middlewares/authmiddleware");
app.use(express.json());
app.use(cors({
    origin:"*"})
    )


app.use("/user",signRouter)
app.use(authMiddleware)
app.use("/todo", todoRouter)



app.listen(7000,async()=>{
    try{
        await connection;
        console.log("connected to db")
    }
    catch(err){
        console.log("error in connection ")
        console.log(err)
    }
    console.log("listening");
})