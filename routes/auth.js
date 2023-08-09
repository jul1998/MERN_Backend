const express = require('express');
const jwt = require("jsonwebtoken");

const router = express.Router()
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

const User = require('../models/User');
dotenv.config();
// Register

router.post('/register', async (req, res) => {

    
    console.log(req.body);
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // save user and respond
        const user = await newUser.save();
        res.status(200).json(user._id);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Login

router.post('/login', async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = await req.body;

        // find user
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json("User not found");
        }

        // validate password
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(400).json("Wrong password");
        }

        // create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // send response
        res.status(200).json({ token, user });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Logout

router.post('/logout', async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 1 });
        res.status(200).json("Logged out");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;