const mongoose = require('mongoose');
const User = require('../model/userSchema'); 
const bcrypt = require('bcrypt'); 
const {AccessTokenProvider} = require('../Controller/token');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());


const signupController = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  try {   
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword 
    });

    await newUser.save();

    const accessToken = await AccessTokenProvider(newUser);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none', // Use 'Strict' or 'Lax' based on your needs
      secure: true, // Set to true in production 
    });
    res.status(201).json({ 
      message: 'User created successfully',  
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  } 
};

const loginController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const accessToken = await AccessTokenProvider(user);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure:true,
      sameSite: 'none', 
    });
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  } 
};

module.exports = {signupController, loginController};


