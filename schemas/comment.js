const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
        required: true,
    },
    postId: {
        type: Number
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model("Comments", commentsSchema);