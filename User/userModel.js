const { types } = require('@babel/core');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, requaire: true, unique: true },
    emailId: { type: String, require: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] },
    password: { type: String, require: true }
});
const User = mongoose.model("User", userSchema);
module.exports = User;
