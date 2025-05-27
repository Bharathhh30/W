require('dotenv').config()
// console.log(process.env.MONGO_URL)
const express = require("express");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const {  userRouter } = require("./routes/user");
const {  courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express()
app.use(express.json())   //always imp
//another way of routing (kind of better)
// createUser(app)

// createCourse(app)

// industry way
app.use("/api/v1/user",userRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/course",courseRouter)

async function main(){
    //dot env
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000);
    console.log("listeninh on port 3000")
}

// this is good , start backend only if database is connected and is not down
main()