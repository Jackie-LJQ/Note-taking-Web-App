const mongoose = require("mongoose")
noteSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String
    },
    author: {
        type: String,
        required: true
    },
    group: {
    },
    timeStamp: {
        type: Date,
        required: true
    },
}, {collection: 'notes'})
module.exports = mongoose.model("Note", noteSchema)