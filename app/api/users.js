const express = require('express');
const router = express.Router();
const User = require('../models/user')

/**
 * Create a new user
 */
router.post('', async (req, res) => {
    // check if user with the same username 

    // set new user's data
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        home: req.body.home,
    })

    try {
        newUser = await newUser.save()
        console.log(`New user ${req.body.username} successfully saved!`);
    } catch {
        console.log(`Error trying to save ${req.body.username} to database.`);
    }

    // return response
    res.status(201).send(`New user ${req.body.username} successfully saved!`);
    
})

/**
 * Retrieve all users
 */
 router.get('', async (req, res) => {
     
    try {
        // get users from database
        let users = await User.find({})
        
        // if there are no users in the database
        if (users.length == 0) {
            console.log(`No user found in database!`);
            res.status(404).send(`No user found in database!`);
            return;
        }

        let usersList = users.map( (key, user) => {
            return {
                name: user.name,
                username: user.username,
                email: user.email,
                password: user.password,
                home: user.home,
            }
        })

        // return response
        res.status(200).json(usersList);
    } catch {
        console.log(`Error trying to retrieve users from database.`);
        res.status(404).send(`No user found in database!`);
    }
})

module.exports = router;