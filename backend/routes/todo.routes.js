const express = require("express");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const { Todomodel } = require("../models/todo.model")
const { Signupmodel } = require("../models/signup.model")
const todoRouter = express.Router()
const signRouter = express.Router();

signRouter.get("/", async (req, res) => {
    try {
        const x = await Signupmodel.find();
        res.send(x)
    }
    catch (err) {
        res.send(err)
        console.log(err)
    }
})


signRouter.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    const userpresent = await Signupmodel.findOne({ email })
    if (userpresent?.email) {
        res.send({"msg":"user already exist"})
    } else {
        try {
            bcrypt.hash(password, 5, async function (err, hash) {
                const user = new Signupmodel({ email, password: hash })
                await user.save()
                res.send({"msg":"user added"});
            });

        }
        catch (err) {
            res.send({"msg":"invalid request"})
            console.log(err)
        }
    }
})

signRouter.delete("/delete/:userID", async (req, res) => {
    const userid = req.params.userID
        try {
            await Signupmodel.findByIdAndDelete({ _id: userid })
            res.send("user deleted")
        }
        catch (err) {
            console.log(err);
            res.send("invalid request")
        }
})

signRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Signupmodel.find({ email })
        if (user.length > 0) {
            const hashed = user[0].password
            bcrypt.compare(password, hashed, function (err, result) {
                if (result) {
                    const token = jwt.sign({ "userID": user[0]._id }, 'code', { expiresIn: '1h' });
                    res.send({ "msg": "login successful", "token": token })
                } else {
                    res.send({"msg":"login failed"})
                }
            });
        }
        else {
            res.send({"msg":"wrong credentials"})
        }
    }
    catch (err) {
        console.log(err)
    }
})


todoRouter.get("/", async (req, res) => {
    try {
        const all = await Todomodel.find()
        res.send(all)
    }
    catch (err) {
        console.log(err);
        res.send({ "msg": "invalid request" })
    }
})

todoRouter.post("/create", async (req, res) => {
    const data = req.body;
    try {
        await Todomodel.insertMany([data])
        res.send({ "msg": "Todo created" })
    }
    catch (err) {
        console.log(err);
        res.send({ "msg": "invalid request" })
    }
})

todoRouter.patch("/edit/:todoID", async (req, res) => {
    const id = req.params.todoID
    const payload = req.body
    const userID = req.body.userID
    const particulartodo = await Todomodel.findOne({ _id: id })
    if (userID !== particulartodo.userID) {
        res.send({ "msg": "not authorized" })
    } else {
        try {
            await Todomodel.findByIdAndUpdate({ _id: id }, payload)
            res.send({ "msg": "Todo updated" })
        }
        catch (err) {
            console.log(err);
            res.send({ "msg": "invalid request" })
        }
    }
})

todoRouter.delete("/delete/:todoID", async (req, res) => {
    const todoid = req.params.todoID
    const userID = req.body.userID
    const particulartodo = await Todomodel.findOne({ _id: todoid })
    if (userID !== particulartodo.userID) {
        res.send({ "msg": "not authorized" })
    } else {
        try {
            await Todomodel.findByIdAndDelete({ _id: todoid })
            res.send({ "msg": "todo deleted" })
        }
        catch (err) {
            console.log(err);
            res.send({ "msg": "invalid request" })
        }
    }
})

module.exports = { todoRouter, signRouter }