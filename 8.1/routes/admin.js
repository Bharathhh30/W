const {Router} = require("express")
const adminRouter = Router()
const {adminModel} = require("../db")

adminRouter.post("/signup",(req,res)=>{
    res.json({
        message : "signup endpoint"
    })
})

adminRouter.post("/signin",(req,res)=>{
    res.json({
        message : "signin endpoint"
    })
})


adminRouter.post("/",(req,res)=>{
    res.json({
        message : "course end pint"
    })
})

adminRouter.put("/",(req,res)=>{
    res.json({
        message : "course end pint"
    })
})

adminRouter.get("/",(req,res)=>{
    res.json({
        message : "course end pint"
    })
})
module.exports = {
    adminRouter : adminRouter
}