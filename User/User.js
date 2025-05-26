const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./userModel');

async function createUser() {
  await mongoose.connect('mongodb://localhost:27017/webpac'); // replace with actual DB URI

  const existing = await User.findOne({ email: 'abc123@gmail.com' });
  if (existing) {
    console.log('User already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('abc@123', 10);

  const user = new User({
    email: 'abc123@gmail.com',
    password: hashedPassword,
    isLoggedIN: true,
    tokens: []
  });

  await user.save();
  console.log('Test user created');
  mongoose.disconnect();
}

createUser();
