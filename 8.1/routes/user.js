// const express = require("express")
// const Router = express.Router

const { Router } = require("express");
const { userModel, purchaseModel } = require("../db");
const userRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET} = require("../config")
//Router() is not an instance it is a function
//above both ways does same thing
// {} -> destructue Router from express,express gives many but i took Router

const { z } = require("zod");
const { userMiddleware } = require("../middleware/user");

userRouter.post("/signup", async (req, res) => {
  // zod validation
  const requiredBody = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "min len is 8")
      .regex(/[A-Z]/, "it should include upper case letter")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    firstName: z.string().min(3, "min len is 3").max(30, "max len is 30"),
    lastName: z.string().min(3, "min len is 3").max(30, "max len is 30"),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    return res.status(403).json({
      message: "Incorect format",
      error: parsedDataWithSuccess.error,
    });

  }

  const { email, password, firstName, lastName } = req.body;

  let errorThrown;
  // hash the password
  try {
    const hashedpassword = await bcrypt.hash(password, 5);
    console.log("hashed password", hashedpassword);
    await userModel.create({
      email,
      password: hashedpassword,
      firstName,
      lastName,
    });
  } catch (e) {
    console.log("error while putting thinfs into db");
    res.status(500).json({
      message: "eror while putting into db or user already exists",
    });
    errorThrown = true;
  }
  if (!errorThrown) {
    res.status(201).json({
      message: "you are signed up",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "min len is 8")
      .regex(/[A-Z]/, "it should include upper case letter")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
  });
  //find returns array , if user is not found it returns and empty array which is still valid so if u give wrong password also
  // token will be given , to avaid this we use findOne which just returns what we asked for, returns user or undefined

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.status(403).json({
      message: "Incorect format",
      error: parsedDataWithSuccess.error,
    });
    return;
  }

  const { email, password } = parsedDataWithSuccess.data;

  try {
    const user = await userModel.findOne({
      //very imp to use findone
      email,
    });

    if (!user) {
      return res.status(403).json({
        message: "User does not exist in our db",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch, "jjust to check");
    if (passwordMatch) {
      const token = jwt.sign(
        {
          userId: user._id,  //userId should be remembered as we will use it in auth
        },
        JWT_USER_SECRET
      );

      res.json({
        message: "sign in success",
        token: token,
      });
    } else {
      return res.status(403).json({
        message: "Incorrect Credentials",
      });
    }
  } catch (e) {
    console.log("error is : ", e);
    res.status(403).json({
      message: "error occured while signing in",
    });
  }
});

userRouter.get("/purchases",userMiddleware,async(req,res)=>{
    const userId = req.userId
    const purchases = await purchaseModel.find({
      userId
    })
    res.json({
        message : "hi",
        purchases
    })
})
module.exports = {
  userRouter: userRouter,
};


/*
  userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})
*/