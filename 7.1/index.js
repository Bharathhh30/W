const express = require("express")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "iloveyashna"
const {UserModel,TodoModel} = require("./db")
const { default: mongoose } = require("mongoose")

mongoose.connect("mongodb+srv://bharath:8yra9dchqr%40MDB@cluster-learning.ipbdfmq.mongodb.net/todo-app-database") 
// dont forget to add data base after the connection url
// if db exists it uses or it creates wiht the name specified
const app = express()

//parsing json via middleware
app.use(express.json())

app.post("/signup",async(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    //create is a async call so returns promise
//u get back promise that whether it is fullfiled or not if , no promise
//then we dont know if somehting happend bad or not

// always wait for db to return
    const responsse = await UserModel.create({
        email : email,
        password : password,
        name : name
    })
    console.log(responsse,"hi")
    res.json({
        message : "you are signed up"
    })
})


app.post("/signin",async(req,res)=>{
    const email = req.body.email
    const password = req.body.password

    const user = await UserModel.findOne({
        email : email,
        password : password
    })
    
    console.log(user)

    if(user){
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