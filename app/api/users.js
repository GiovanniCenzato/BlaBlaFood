const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/me', async (req, res) => {
    // check for token 
    if (!req.loggedin) {
        return res.status(403).json({
            message: 'Error, user not logged in'
        });
    }
    
    // get user with email from request
    let _user = await User.findOne({
        email: req.loggedin.email
    });

    // send back infos as json
    res.status(200).json({
        message: 'User retrieved correctly',
        user: _user
    });
})

module.exports = router;
