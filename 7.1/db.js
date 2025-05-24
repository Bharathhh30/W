const mongoose = require("mongoose")
const ObjectId = mongoose.ObjectId
//create the schema first
const Schema = mongoose.Schema

const User = new Schema({
    email : {type:String,unique:true},
    password : String,
    name : String
})


const Todo = new Schema({
    title : String,
    done : Boolean,
    userId : ObjectId //import objectid from mongoose
})


const UserModel = mongoose.model("users",User)
const TodoModel = mongoose.model("todos",Todo)
//    model name            collection      schema
/*
    model name is to refer like UserModel.insert .... 
    mongoose.model("collection name , present in cluster",Schema name which we define)
    its we are storing schema into data base using datamodel
*/

module.exports = {
    UserModel : UserModel,
    TodoModel : TodoModel
}