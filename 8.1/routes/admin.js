const {Router} = require("express")
const adminRouter = Router()
const {adminModel} = require("../db")
const {JWT_ADMIN_SECRET} = require("../config")

/*
    have different secret for user and admin , because if stars didnot align and the user_id and admin_id are 1
    and JWT secret is same for admin and user then the token generated will be same for both

    and user can hit the admin endpoints and middleware might think non suspicious

    If you use the same JWT secret for both users and admins, and the payloads have overlapping IDs (like userId = 1 and adminId = 1), then:

    The generated JWT tokens might look similar or be valid with the same secret.

    If your middleware doesn’t explicitly check the token’s role or claims, a user token could potentially be accepted as an admin token.

    This can cause security issues, allowing normal users to access admin-only endpoints.

    Why having different secrets helps:
    Different secrets ensure that tokens for users and admins are signed differently, so a user token cannot be used as a valid admin token.

    Even if IDs overlap, tokens won’t verify under the “other” secret.

    This forces strict separation of privilege.
*/



const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { adminMiddleware } = require("../middleware/admin");

console.log("entered admin router")

adminRouter.post("/signup",async(req,res)=>{

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
    await adminModel.create({
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
})

adminRouter.post("/signin",async(req,res)=>{
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
    const admin = await adminModel.findOne({
      //very imp to use findone
      email,
    });

    if (!admin) {
      return res.status(403).json({
        message: "User does not exist in our db",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    console.log(passwordMatch, "jjust to check");
    if (passwordMatch) {
      const token = jwt.sign(
        {
          adminId: admin._id,  //userId should be remembered as we will use it in auth
        },
        JWT_ADMIN_SECRET
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
})


adminRouter.post("/course",adminMiddleware,(req,res)=>{
    const a = req.adminId
    console.log(a,"e")
    res.json({
        message : "course end pint",
        a : a
    })
})

adminRouter.put("/course",(req,res)=>{
    res.json({
        message : "course end pint"
    })
})

adminRouter.get("/course/bulk",(req,res)=>{
    res.json({
        message : "course end pint"
    })
})
module.exports = {
    adminRouter : adminRouter
}