const {Router} = require("express")
const { userMiddleware } = require("../middleware/user")
const { purchaseModel, courseModel } = require("../db")
const courseRouter = Router()



courseRouter.post("/purchase",userMiddleware,async(req,res)=>{
    const userId = req.userId
    const courseId = req.body.courseId
    
    await purchaseModel.createCollection({
        userId,
        courseId
    })

    res.json({
        message : "purchase-course"
    })
})


courseRouter.get("/preview",async(req,res)=>{

    const courses = await courseModel.find({}) //empty means give all 
    res.json({
        message : "all-courses",
        coursers : courses
    })
})



module.exports = {
    courseRouter : courseRouter
}