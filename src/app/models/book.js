const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 50,
        required: true
    },
    author: {
        type: String,
        maxlength: 50
    },
    yearPub: {
        type: Number,
        min: 1,
        max: new Date().getFullYear()
    },
    edition: {
        type: Number,
        min: 1,
        max: 200
    },
    bookImage: String,
    stock: {
        type: Number,
        min: 0,
        max: 99999
    }
});

module.exports = mongoose.model("Book", bookSchema);
