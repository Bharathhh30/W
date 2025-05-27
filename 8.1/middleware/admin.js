const jwt = require("jsonwebtoken")
const {JWT_ADMIN_SECRET} = require("../config")

function adminMiddleware(req,res,next){
    const token = req.headers.token
    const verified = jwt.verify(token,JWT_ADMIN_SECRET)
    console.log("printing verified object may be",verified) //jsut to check the key name

    if(verified){
        req.adminId = verified.adminId
        next()
    }else{
        res.status(403).json({
            message : "you are not signed in "
        })
    }
}

module.exports = {
    adminMiddleware : adminMiddleware
}