// const express = require("express")
// const Router = express.Router

const {Router} = require("express")
const { userModel } = require("../db")
const userRouter = Router()
const bcrypt = require("bcrypt")
//Router() is not an instance it is a function 
//above both ways does same thing
// {} -> destructue Router from express,express gives many but i took Router

const {z} = require("zod")

userRouter.post("/signup",async(req,res)=>{
    // zod validation
    const requiredBody = z.object({
        email : z.string().email().includes("@","include @"),
        password : z.string().min(8,"min len is 8")
            .regex(/[A-Z]/,"it should include upper case letter")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        firstName : z.string().min(3,"min len is 3").max(30,"max len is 30"),
        lastName : z.string().min(3,"min len is 3").max(30,"max len is 30"),
    })

    const parsedDataWithSuccess = requiredBody.safeParse(req.body)

    if(!parsedDataWithSuccess.success){
        res.json({
            message : "Incorect format",
            error : parsedDataWithSuccess.error
        })
        return
    }

    const { email,password,firstName,lastName } = req.body
    
    let errorThrown;
    // hash the password
    try{
        const hashedpassword = await bcrypt.hash(password,5)
        console.log("hashed password",hashedpassword)
        await userModel.create({
            email,
            password : hashedpassword,
            firstName,
            lastName
        })
    }catch(e){
        console.log("error while putting thinfs into db")
        res.status(500).json({
            message : "eror while putting into db or user already exists"
        })
        errorThrown = true
    }
    if (!errorThrown){
        res.status(201).json({
            message : "you are signed up"
        })
    }
})

userRouter.post("/signin",(req,res)=>{
    res.json({
        message : "signin endpoint"
    })
})



module.exports = {
    userRouter : userRouter
}