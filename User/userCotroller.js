const User = require('./userModel');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req,res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are require" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }

}