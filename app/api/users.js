const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Announcement = require('../models/announcement')
const tokenCheck = require('./tokenChecker');

/**
 * Create a new user
 */
 router.post('', async (req, res) => {
    // check if user with the same username 
    // tbi 

    // set new user's data
    let newUser = new User({
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        username: req.body.username,
        birthday: req.body.birthday,
        userpic: req.body.userpic,
        home: req.body.home,
        email: req.body.email,
        password: req.body.password,
        announcements: []
    });

    try {
        newUser = await newUser.save()
        console.log(`New user ${req.body.username} successfully saved!`);
    } catch {
        console.log(`Error trying to save ${req.body.username} to database.`);
    }

    // return response
    res.status(201).json({
        message: `New user ${req.body.username} successfully saved!`
    });
})

router.get('/me', tokenCheck, async (req, res, next) => {
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

    let announcementsList = await Announcement.find({
        authorId: _user._id
    });


    // send back infos as json
    res.status(200).json({
        message: 'User retrieved correctly',
        user: _user,
        announcements: announcementsList,
    });
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

        let usersList = users.map( (user) => {
            return {
                id: user._id,
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

router.put('/me', tokenCheck, async (req, res, next) => {
    // check for token 
    if (!req.loggedin) {
        return res.status(403).json({
            message: 'Error, user not logged in'
        });
    }
    
    try {
        
        // find user with email from request and update it
        await User.findOneAndUpdate({
            email: req.loggedin.email
        }, {
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            home: req.body.home,
            birthday: req.body.birthday,
            description: req.body.description
        });

        // send response
        console.log(`Successfully updated user ${req.body.username}!`);
        res.status(201).json({
            message: `Successfully updated user ${req.body.username}!`
        });

    } catch (e) {
        console.log(`Error updating user ${req.body.username}!`);
        res.status(403).json({
            message: `Error updating user ${req.body.username}!`
        });
    }

});

module.exports = router;
