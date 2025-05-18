const express = require("express")
const app = express()

const jwt = require("jsonwebtoken")
const JWT_SECRET = "randomharkiratilovekiara"

app.use(express.json()) //lenses to read json data 

/* 
    [{
        username : "" , password : "" , token : ""
    }]
*/
const users = []


//should return random long string
function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        // use a simple function here
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}

app.post("/signup",(req,res)=>{

    //input validations using zod (saved for later)
    const username = req.body.username
    const password  = req.body.password

    

    users.push({
        username : username,
        password : password
    })

    res.json({
        message : "You are signed up"
    })

    console.log(users)
})

app.post("/signin",(req,res)=>{
    const username = req.body.username
    const password  = req.body.password

    // const user = users.find(function(u){
    //     if(u.username === username && u.password === password){
    //         const token = generateToken()
    //         u.token = token
    //         console.log(u)
    //         res.json({
    //             message : token
    //         })
    //     }else{
    //         res.status(403).json({
    //             message : "Invalde credienti"
    //         })
    //     }
    // })

    /* 
        above part gave error because in find we making a 
        callback for every index of users , so if the required
        user is at 3 index , 0,1,2 indexes are also checked for
        match and returns 403 and at 3 it returns 200 and again
        at 4,5 .... it checks until users.length 

        this way it sends multiple responses which is not good
        practice for the auths
    */

    const user = users.find(user => user.username === username && user.password === password)

    if(user){
        // const token = generateToken()

        //using jwt arg1 - wht u want to encode 
        //arg2 - what secret u want to use
        const token = jwt.sign({
            username : user.username
        },JWT_SECRET)
        // user.token = token;
        res.send({
            token
        })
        console.log(users)
    }else{
         res.status(403).send({
            message: "Invalid username or password"
        })
    }

})

/* 
    app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        const token = generateToken();
        user.token = token;
        res.send({
            token
        })
        console.log(users);
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
});

better way to write
*/


//jwt is not encryption it is close to encryption 
// kind of encoding

//jwt.sign -> username to jwt
//jwt.verify -> jwt to username

app.get("/me",(req,res)=>{
    const token = req.headers.token //now we get jwt
    const decodedInformation = jwt.verify(token,JWT_SECRET)
    //JWT_SECRET is kind of password

    const username = decodedInformation.username
    
    const user = users.find(user => user.username === username)

    if(user){
        res.json({
            username : user.username,
            password : user.password
        })
    }else{
        res.status(403).json({
            message  : "Token invalid"
        })
    }
})

app.listen(3000)