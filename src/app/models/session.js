const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    email: String,
    token: String
});

module.exports = mongoose.model("Session", sessionSchema);
