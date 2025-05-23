const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('./userModel');
const router = express.Router();


router.get('/', async (req, res) => {
    try{
        const users = await User.find({}, 'password');
        if(!users.length) {
            return res.status(404).json({message: 'No User found'});
        }
        res.status(200).json(users); 
    }catch (error) {
        console.error("Error faching users:", error.message);
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
});

router.post('/Login', async (req, res) => {

    try{
        const{ email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const User = await User.findOne({ email }) 
    if(!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatched = await bcript.compare(password, user.password);
    if(!isMatched) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    user.isLoggedIN = true;
    user.tokens.push(token);
    await user.save();

    res.json({ message: "Login Successful", token })

    } catch (error) {
        res.status(500).json({ message: "Login Failed", error: error.message })
    }
});
module.exports = router;