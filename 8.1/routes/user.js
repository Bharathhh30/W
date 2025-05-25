// const express = require("express")
// const Router = express.Router

const {Router} = require("express")
const userRouter = Router()
//Router() is not an instance it is a function 
//above both ways does same thing
// {} -> destructue Router from express,express gives many but i took Router


userRouter.post("/signup",(req,res)=>{
    res.json({
        message : "signup endpoint"
    })
})

userRouter.post("/signin",(req,res)=>{
    res.json({
        message : "signin endpoint"
    })
})



module.exports = {
    userRouter : userRouter
}