const express = require("express");;
const jwt = require("jsonwebtoken");
const { createUser, userRouter } = require("./routes/user");
const { createCourse, courseRouter } = require("./routes/course");

const app = express()

//another way of routing (kind of better)
// createUser(app)

// createCourse(app)

// industry way
app.use("/api/v1/user",userRouter)
app.use("/api/v1 /course",courseRouter)

app.listen(3000);