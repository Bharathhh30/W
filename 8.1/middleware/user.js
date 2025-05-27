const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET} = require('../config')

function userMiddleware(req,res,next){
    const token = req.headers.token
    const verified  = jwt.verify(token,JWT_USER_SECRET)
    console.log("printing verified object may be",verified)
    if(verified){
        req.userId = verified.userId
        next()
    }else{
        res.status(403).json({
            message : "you are not signed in"
        })
    }
}

module.exports = {
    userMiddleware : userMiddleware
}