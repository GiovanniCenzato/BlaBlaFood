const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken'); 


/**
 * User login
 */
 module.exports = router.post('/login', async (req, res) => {
    let message;
    let status;
    let token;
    let username;

    try {
        // find the user in the db
        var user = await User.findOne({
            email: req.body.email
        });

        // check password hashes
        if (!user.comparePasswords(req.body.password, user.password)) {
            // set response
            message = 'Login failed: wrong password';
            status = 403;
        } else {
            // if password is okay, set response
            message = 'Login successful!';
            status = 201;
            token = jwt.sign({
                email: user.email,
                name: user.name,
                username: user.username,
                id: user._id
            }, 
            process.env.JWT_SECRET, {
                expiresIn: 86400
            });
            username = user.username;
        }


    } catch (e){
        // set response
        message = `An error occurred: ${e}`;
        status = 403;
    }

    console.log(token);
    // return response
    console.log(message);
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false,
        token: token,
        username: username
    });
})
