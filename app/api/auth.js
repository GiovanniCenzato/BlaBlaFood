const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken'); 

/**
 * User login
 */
router.post('', async (req, res) => {
    // 
    
    // find the user in the db
    let user = User.findOne({

    })
    // check if password corresponds


})


module.exports = router;