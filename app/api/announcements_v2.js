const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement.js');
const User = require('../models/user.js');
const tokenCheck = require('./tokenChecker');

/**
 * Create a new announcement
 */
router.post('', tokenCheck, async (req, res, next) => {
    // check for token 
    if (!req.loggedin) {
        return res.status(403).json({
            message: 'Error, user not logged in'
        });
    }

    let message;
    let status;
    let _user;
    let newAnn;
    
    try {
        // get user with email from request
        _user = await User.findOne({
            email: req.loggedin.email
        });
        
        // set new announcement's data
        newAnn = new Announcement({
            title: req.body.title,
            description: req.body.description,
            address: req.body.address,
            city: req.body.city,
            date: req.body.date, 
            tags: req.body.tags,
            price: req.body.price,
            authorId: _user._id,
            maxReservations: req.body.maxReservations,
            reservations: [],
            queuedReservations: []
        });

        newAnn = await newAnn.save()

        // set response
        message = `New announcement ${req.body.title} successfully saved!`;
        status = 201;

    } catch {
        // set response
        message = `Error trying to save ${req.body.title} to database.`
        status = 403;
    }
    
    // return response
    console.log(message);
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false
    });
    
});

/**
 * Retrieve all announcements
 */
 router.get('', async (req, res) => {
    let message;
    let status;
    let announcements;
    let announcementsList;

    // check for filters (if any)
    var filters = req.query;
    
    try {
        // get announcements from database
        announcements = await Announcement.find({})
        
        // if there are no announcements in the database
        if (announcements.length == 0) {
            message = `No announcement found in database!`;
            status = 404;
        
        } else {
            // map announcements 
            announcementsList = await Promise.all(
                announcements
                .filter( ann => {
                    let okay = true;
                    if (filters.filter != '') {
                        // title/description filter
                        if (!ann.title.toString().toLowerCase().includes(filters.filter.toString().toLowerCase()) &&
                        !ann.description.toString().toLowerCase().includes(filters.filter.toString().toLowerCase()) ) {
                            okay = false;
                        }
                    }
                        
                    // vegan/vegetarian/glutenfree filter
                    if (filters.vegan == 'true' && !ann.tags.includes('VEG'))                { okay = false; }
                    if (filters.vegetarian == 'true' && !ann.tags.includes('vegetarian'))    { okay = false; }
                    if (filters.glutenfree == 'true' && !ann.tags.includes('gluten-free'))   { okay = false; }
                    
                    // can return?
                    if (okay) return ann;
                })
                .map( async (ann) => {
                    try {
                        // get author info to display on announcement
                        let user = await User.findOne({
                            _id: ann.authorId
                        });
                        
                        return {
                            id: ann._id,
                            title: ann.title,
                            description: ann.description,
                            tags: ann.tags,
                            maxReservations: ann.maxReservations,
                            reservations: ann.reservations,
                            queuedReservations: ann.queuedReservations, // needed?
                            author: user
                        };
    
                    } catch (e) {
                        console.log(`Error: ${e} retrieving user`);
                        return;
                    }
                })
            );

            // set response
            message = `Found ${announcementsList.length} announcements in database!`;
            status = 201;
        }
        
    } catch {
        // set response
        message = `Error trying to retrieve announcements from database.`;
        status = 505;
    }
    
    console.log(message);
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false,
        announcementsList: announcementsList
    });
});


/**
 * Retrieve one specific announcement
 */
router.get('/:id', async (req, res) => {
    let message;
    let status;
    let ann;

    // get announcement id
    let id = req.params.id;

    try {
        // retrieve specific announcement (if any)
        ann = await Announcement.findById(id);

        // set response
        message = `Found announcement with id ${id}`;
        status = 201;

    } catch {
        message = `error retrieving announcement with id ${id}`;
        status = 403;

    }

    // return response
    console.log(message);
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false,
        announcement: ann
    });
});


/**
 * Attempt to book one specific announcement
*/
router.post('/:id/book', tokenCheck, async (req, res, next) => {
    // check for token 
    if (!req.loggedin) {
        return res.status(403).json({
            message: 'Error, user not logged in'
        });
    }

    let message;
    let status;
    let annId = req.params.id;                              // id of the announcement to be booked/confirmed
    let userId = req.loggedin.id;                           // id of the user executing the operation

    try {
        // retrieve announcement
        let ann = await Announcement.findById(annId);
        
        // check if there's room left
        if (ann.reservations.length < ann.maxReservations) {

            // push the user's object to reservation queue
            let user = await User.findById(userId);
            ann.queuedReservations.push(user);
            ann = await ann.save();

            // set response
            message = `Booking done! Waiting for user's approval`;
            status = 201;

        } else {
            // set response
            message = `Announcement is already full!`;
            status = 403;
        }

    } catch {
        // set response
        message = `error retrieving announcement with id ${annId}`;
        status = 403;
    }

    // return response
    console.log(message);
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false
    });
});

router.post('/:id/confirm', tokenCheck, async (req, res, next) => {
    // check for token 
    if (!req.loggedin) {
        return res.status(403).json({
            message: 'Error, user not logged in'
        });
    }

    let message;
    let status;

    let annId = req.params.id;                              // id of the announcement to be booked/confirmed
    let userId = req.loggedin.id;                           // id of the user executing the operation
    let userToConfirmId = req.body.userToConfirmId;         // id of the user whose booking is to be confirmed

    try {
        // retrieve announcement
        let ann = await Announcement.findById(annId);
        
        // check if there's room left
        if (ann.reservations.length < ann.maxReservations) {

            // remove user from queued reservations 
            ann.queuedReservations = ann.queuedReservations.filter( el => {if (el!=userToConfirmId) return el});     

            // push the user's id to reservations
            let user = await User.findById(userToConfirmId);
            ann.reservations.push(user);
            ann = await ann.save();

            // set response
            message = `User ${userToConfirmId} confirmed for announcement ${annId}!`;
            status = 201;

        } else {
            // set response
            message = `Announcement is already full!`;
            status = 403;
        }

    } catch {
        // set response
        message = `Error retrieving announcement with id ${annId}`;
        status = 403;
    }

    // return response
    console.log(message);
    return res.status(status).json({
        message: message,
        success: (status==201) ? true : false
    });
});

module.exports = router;
