const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    admin: Boolean
});

userSchema.methods.generateHash = function (pass) {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function (pass) {
    return bcrypt.compareSync(pass, this.password);
};

module.exports = mongoose.model("User", userSchema);
