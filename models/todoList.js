const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    todoText:{
        type:String,
        required:false
    },
    isDone:{
        type:Boolean,
        default:false
    }
})

const todo = mongoose.model("Todo", todoSchema, "todo")
module.exports=todo