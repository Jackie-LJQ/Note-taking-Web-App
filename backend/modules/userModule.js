const mongoose = require("mongoose")
userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: false
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sharedPage: {
    },
    emailToken: {
        type: String,
        required: true
    },
    isVerified: {
        type: String,
        required: true
    }
}, {collection: 'users'})
module.exports = mongoose.model("User", userSchema)