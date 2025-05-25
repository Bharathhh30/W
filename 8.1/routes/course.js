const {Router} = require("express")
const courseRouter = Router()



courseRouter.post("/purchase-course",(req,res)=>{
    res.json({
        message : "purchase-course"
    })
})

courseRouter.get("/purchased-courses",(req,res)=>{
    res.json({
        message : "purchased-course"
    })
})

courseRouter.get("/all-courses",(req,res)=>{
    res.json({
        message : "all-courses"
    })
})



module.exports = {
    courseRouter : courseRouter
}