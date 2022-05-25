const mongoose = require("mongoose")
const todoListSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    content:{
        type:String,
        require:true
    },
    isCompleted:{
        type:Boolean,
        required:true
    }
}, {collection:"todoLists"})

module.exports = mongoose.model("TodoItem", todoListSchema)