const express = require("express")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "iloveyashna"
const {UserModel,TodoModel} = require("./db")
const { default: mongoose } = require("mongoose")
const bcrypt = require("bcrypt")
const {z} = require("zod")
// const dotenv = require("dotenv")

// console.log(process.env.M)
mongoose.connect("mongodb+srv://bharath:8yra9dchqr%40MDB@cluster-learning.ipbdfmq.mongodb.net/todo-app-database") 
// dont forget to add data base after the connection url
// if db exists it uses or it creates wiht the name specified
const app = express()

//parsing json via middleware
app.use(express.json())

app.post("/signup",async(req,res)=>{

    //define schemea
    const requiredBody = z.object({
        email : z.string().min(3).max(15).email(),
        name : z.string().min(3).max(100),
        password : z
            .string()
            .min(3,"it should be min 3 len")
            .max(30,"it should be max 30 len")
            .includes("@","include @")
            .regex(/[A-Z]/,"it shoukd inlcude upper case ")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        //1 uc, 1lc ,1 spl c
    })
    /*
        const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(20, "Password must be at most 20 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
    */
    //parse the body
    // const parsedData = requiredBody.parse(req.body) - this will throw an error and crash happens we need to use try catch for this 
    const parsedDataWithSuccess = requiredBody.safeParse(req.body)
    
    //1.how to show the exact error
    
    if(!parsedDataWithSuccess.success){
        res.json({
            message : "Incorrect format",
            error : parsedDataWithSuccess.error
        })
        return
    }
    /*
        req.body
        {
            email : string,
            password : string,
            name : string,
        }
    */




    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    let errorThrown = false
    try{
        const hashedPassword = await bcrypt.hash(password,5)
        console.log(hashedPassword,"hashed pass")

    //create is a async call so returns promise
//u get back promise that whether it is fullfiled or not if , no promise
//then we dont know if somehting happend bad or not

// always wait for db to return
        const responsse = await UserModel.create({
            email : email,
            password : hashedPassword,
            name : name
        })
        console.log(responsse,"hi")
    }catch(e){
        console.log("error while putting things in db")
        res.json({
            message : "User already exists"
        })
        errorThrown = true
    }
    if(!errorThrown){
        res.json({
            message : "you are signed up"
        })
    }
})


app.post("/signin",async(req,res)=>{
    const email = req.body.email
    const password = req.body.password

    const user = await UserModel.findOne({
        email : email,
    })
    
    console.log(user)

    if(!user){
        res.status(403).json({
            message : "User does not exist in our db"
        })
    }

    const passwordMatch =await bcrypt.compare(password,user.password)

    // https://chatgpt.com/share/6831a740-50a0-800f-8232-6150cff003ae
    /*
     here password is the users input , user.passowrd is hashed one from the db
     bcrpyt will hash the user input and compare
     $2b -> bcrpt algo version
     $05 -> no of rounds / cost factors
     next -> salt+hash
    */
    if(passwordMatch){
        const token = jwt.sign({
            id : user._id.toString() //_id is class so -> toString
        },JWT_SECRET); //return token so they send in future uk na token 
        res.json({
            token : token
        })
    }else{
        res.status(403).json({
            message : "Incorrect Credentials"
        })
    }
})

//below both routes are authenticated allowance
//use middleware


app.post("/todo",auth,(req,res)=>{
    const userId  = req.userId
    const title = req.body.title
    TodoModel.create({
        title,
        userId
    })
    res.json({
        message : "todo added"
    })
})


app.get("/todos",auth,async(req,res)=>{
    const userId  = req.userId
    const todos = await TodoModel.find({
        userId : userId
    })
    res.json({
        todos
    })
})

function auth(req,res,next){
    const token = req.headers.token

    const decodedData = jwt.verify(token,JWT_SECRET)
    console.log(decodedData)
    /*
        id ostadi , adhi req lo pedtham and ah id
        use chesi db lo find chestam simple

        we get id and we insert id in req object 
        and we use that id to find the user in db
        (u get token only if u authenticate rightly)
    */

    if(decodedData){
        req.userId = decodedData.id
        next()
    }else{
        res.status(403).json({
            message : "incorrect credentials"
        })
    }
}

app.listen(3000)