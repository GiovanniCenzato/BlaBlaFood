const express = require('express');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');
const Announcement = require('../models/announcement')
const tokenCheck = require('./tokenChecker');

/**
 * Create a new user
 */
 router.post('', async (req, res) => {
     let status;
     let message;

    let psw = bcrypt.hashSync(req.body.password, 5);

    // set new user's data
    let newUser = new User({
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        username: req.body.username,
        birthday: req.body.birthday,
        userpic: req.body.userpic!='' ? req.body.userpic : 'https://cdn-icons-png.flaticon.com/512/64/64572.png',
        home: req.body.home,
        email: req.body.email,
        score: 0,
        password: psw,
        announcements: []
    });

    // tries to push user
    try {
        newUser = await newUser.save()
        status = 201;
        message = `New user ${req.body.username} successfully saved!`;
        console.log(message);
    } catch {
        status = 403;
        message = `Error trying to save ${req.body.username} to database.`;
        console.log(message);
    }

    // return response
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false
    });
})

/**
 * Retrieves information about the user performing the operation ie. using the webapp
 */
router.get('/me', tokenCheck, async (req, res, next) => {
    // check for token 
    if (!req.token) {
        return res.status(403).json({
            message: 'Error, user not logged in'
        });
    }

    let status;
    let message;
    let _user;
    
    try {
        // get user with email from request
        _user = await User.findOne({
            email: req.token.email
        });
    
        // get user announcements
        let announcementsList = await Announcement.find({
            authorId: _user._id
        });
    
        // set annonucemntes list in user obj and remove psw from obj
        _user.announcements = announcementsList;
        _user.password = '';
        
        // set response
        message = `user ${_user.username} retrieved correctly!`;
        status = 201;
        console.log(message);

    } catch (e) {
        // set response
        message = `Could not retrieve user ${_user.username}: ${e}`;
        status = 403;
        console.log(message);
    }

    // return response
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false,
        user: _user
    });
})


/**
 * Retrieve all users
 */
 router.get('', async (req, res) => {
    let message;
    let status;
    let users;
    let usersList;

    try {
        // get users from database
        users = await User.find({})
        
        // if there are no users in the database
        if (users.length == 0) {
            // set response
            message = `No user found in database!`;
            status = 404;
            console.log(mesasge);

        } else {
            usersList = users.map( (user) => {
                return {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    home: user.home,
                }
            })

            // set response
            message = `Found ${usersList.length} users in database!`;
            status = 201;
            console.log(mesasge);
        }

    } catch (e) {
        // set response
        message = `Error trying to retrieve users from database: ${e}`;
        status = 403;
        console.log(message);
    }

    // return response
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false,
        usersList: usersList
    });
})


/**
 * Retrieve one specific user
 */
 router.get('/:id', async (req, res) => {
    let message;
    let status;
    let user;

    // get user id
    let id = req.params.id;

    try {
        // retrieve specific announcement (if any)
        user = await User.findById(id);

        // set response
        message = `Found user with id ${id}`;
        status = 201;
        console.log(message);

    } catch (e) {
        // set response
        message = `Error retrieving user with id ${id}: ${e}`;
        status = 403;
        console.log(message);
    }

    // return response
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false,
        user: user
    });
});


/**
 * Post a new review to user
 */
 router.post('/:id/reviews', tokenCheck, async (req, res, next) => {
    // check for token 
    if (!req.token) {
        return res.status(403).json({
            message: 'Error, user not logged in'
        });
    }

    let message;
    let status;
    let _user;

    // id of the user to be reviews
    let userid = req.params.id;
    
    // get user with email from request
    _user = await User.findOne({
        _id: userid
    });

    // fill out review object
    let review = {};
    review.title = req.body.title;
    review.description = req.body.description;
    review.announcementId = req.body.announcementId;
    review.poster = req.body.poster;
    review.stars = req.body.stars;

    try {
        // push new review 
        _user.reviews.push(review);

        // save update
        _user = await _user.save();
    
        // set response
        message = `User review added!`;
        status = 201;
        console.log(message);

    } catch (e) {
        // set response
        message = `Error adding user review: ${e}`;
        status = 403;
        console.log(message);
    }

    // return response
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false
    });
});

module.exports = router;
