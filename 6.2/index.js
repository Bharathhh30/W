const express = require("express")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "harkirat124"
const app = express()
const users = []
app.use(express.json())


function logger(req,res,next){
    console.log(req.method + " method came")
    next()
}

app.post("/signup",logger,(req,res)=>{
    const username = req.body.username
    const password = req.body.password

    users.push({
        username,
        password
    })
    //we should check if a user with this username already exists
    res.json({
        message : "You are signed up"
    })
})

app.post("/signin",logger,(req,res)=>{
    const username = req.body.username
    const password = req.body.password

    const user = users.find(user => user.username === username)
    console.log(user,'from here')
    if(user){
        const token = jwt.sign({
            username
        },JWT_SECRET)
        res.json({
            token : token
        })
    }else{
        res.json({
            message : "Invalid credentials"
        })
    }
})

//auth middleware
function auth(req,res,next){
    const token = req.headers.token
    const verifiedData = jwt.verify(token,JWT_SECRET)
    if(verifiedData.username){
        req.username = verifiedData.username //passing the data to next handler
        next()
    }else{
        res.json({
            message : "you are not logged in "
        })
    }
}




//chain of middleware thisis how u do it 
app.get("/me",logger,auth,(req,res)=>{
    // const token = req.headers.token
    
    /*
        decoded by many
        verified by one 
             - JWT
    */
//    const decodedData = jwt.decode(token)
//    console.log(decodedData)
//    const verifiedData = jwt.verify(token,JWT_SECRET)

   
    const user = users.find(user => user.username === req.username)
    res.json({
        username : user.username,
        password : user.password,
        url : "/me"
    })
})

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})

app.listen(3000)