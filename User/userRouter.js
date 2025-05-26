const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./userModel');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, 'email password'); // optional: return email to verify
        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials: user not found" });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(400).json({ message: "Invalid credentials: password mismatch" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("Missing JWT_SECRET in environment");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        user.isLoggedIN = true;
        user.tokens = user.tokens || [];
        user.tokens.push(token);
        await user.save();

        res.status(200).json({ message: "Login Successful", token });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Login Failed", error: error.message });
    }
});

module.exports = router;
