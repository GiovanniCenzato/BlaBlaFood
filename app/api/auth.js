const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken'); 

/**
 * User login
 */
 module.exports = router.post('/login', async (req, res) => {
    try {
        // find the user in the db
        var user = await User.findOne({
            email: req.body.email
        });

        // check password TODO: implement hashing
        if (user.comparePassword(user.password, req.body.password)) {
            console.log('Login failed: wrong password');
            return res.status(401).json({
                message: 'Login failed, invalid user or password.'
            });
        }

        // if password is okay
        return res.status(200).json({
            message: 'Login successful!',
            token: jwt.sign({
                email: user.email,
                name: user.name,
                username: user.username,
                id: user._id
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn: 86400
            })
        });

    } catch (e) {
        console.log(`An error occurred. ${e}`);
    }
})
