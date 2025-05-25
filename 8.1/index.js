const express = require("express");;
const jwt = require("jsonwebtoken");
const {  userRouter } = require("./routes/user");
const {  courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express()

//another way of routing (kind of better)
// createUser(app)

// createCourse(app)

// industry way
app.use("/api/v1/user",userRouter)
app.use("api/v1/admin",adminRouter)
app.use("/api/v1/course",courseRouter)

app.listen(3000);