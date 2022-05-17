const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken'); 

/**
 * User login
 */
router.post('/login', async (req, res) => {
    try {
        // find the user in the db
        var user = await User.findOne({
            email: req.body.email
        });

        // check password TODO: implement hashing
        if (user.password != req.body.password) {
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

/**
 * Checks if the JWT token in the request is valid
 * 
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function in stack
 */
const tokenChecker = (req, res, next) => {
    // get token from either body, query or headers
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    // empty token
    if (!token) {
        return res.status(401).json({
            message: 'No token provided',
            success: false
        })
    }
    
    // validation
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        // token is not valid
        if (error) {
            return res.status(403).json({
                message: 'Token validation failed',
                success: false
            });
        }

        // token is valid, set in request and move on
        req.loggedin = decodedToken;
        next();
    })
}

module.exports = {
    router,
    tokenChecker
};
