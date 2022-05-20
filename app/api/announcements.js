const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement.js');
const User = require('../models/user.js');
const tokenCheck = require('./tokenChecker');

/**
 * Create a new announcement
 */
router.post('', tokenCheck, async (req, res, next) => {
    // set new announcement's data
    let newAnn = new Announcement({
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        authorId: req.body.authorId,
        reservations: [],
        maxReservations: req.body.maxReservations,
        queuedReservations: []
    });

    try {
        newAnn = await newAnn.save()
        console.log(`New announcement ${req.body.title} successfully saved!`);
    } catch {
        console.log(`Error trying to save ${req.body.title} to database.`);
    }

    // return response
    res.status(201).send(`New announcement ${req.body.title} successfully saved!`);
    
});

/**
 * Retrieve all announcements
 */
 router.get('', async (req, res) => {
    // check for filters (if any)
    var filters = req.query;
    
    try {
        // get announcements from database
        let announcements = await Announcement.find({})
        
        // if there are no announcements in the database
        if (announcements.length == 0) {
            console.log(`No announcement found in database!`);
            res.status(404).send(`No announcement found in database!`);
            return;
        }


        let announcementsList = await Promise.all(
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
        }));
        
        res.status(200).json(announcementsList);

        // return response
    } catch {
        console.log(`Error trying to retrieve announcements from database.`);
        res.status(404).send(`No announcement found in database!`);
    }
});


/**
 * Retrieve one specific announcement
 */
router.get('/:id', async (req, res) => {
    // get announcement id
    let id = req.params.id;

    // retrieve specific announcement (if any)
    try {
        let ann = await Announcement.findById(id);

        console.log(`Found announcement with id ${id}`);

        // send back its data
        return res.status(201).json(ann);

    } catch (e) {
        console.log(`Error: ${e}`);

        return res.status(403).json({
            message: `error retrieving announcement with id ${id}`
        });
    }
});


/**
 * Attempt to book one specific announcement or confirm one booking
 * - in the request body there's the logged user's id
 * - if the user's id is the same as the announcement creator, 
 *     the creator is trying to confirm a booking (must also include the user id to be accepted) 
 */
router.post('/:id', tokenCheck, async (req, res, next) => {
    let annId = req.params.id;                              // id of the announcement to be booked/confirmed
    let userId = req.loggedin._id;                          // id of the user executing the operation
    let userToConfirmId = req.body.userToConfirmId;    // id of the user whose booking is to be confirmed
    // l'id DELL'0UTENTE ME LO DEVO PRENDERE DAI PARAMETRI
    
    try {
        // retrieve announcement
        let ann = await Announcement.findById(annId);
        
        // check if the userId is the same as the announcement => confirm a booking
        if (ann.authorId == userId) {
            // === creator is accepting a user ===
            console.log('user id == creator');

            // check if there's room left
            if (ann.reservations.length < ann.maxReservations) {
    
                // remove user from queued reservations 
                ann.queuedReservations = ann.queuedReservations.filter( el => {if (el!=userToConfirmId) return el});     

                // push the user's id to reservations
                ann.reservations.push(userToConfirmId);
                ann = await ann.save();
    
                // response of successful operation
                console.log(`Announcement updated!`);
                return res.status(201).json({
                    message: `Announcement updated!`
                });
    
            } else {
                console.log(`Announcement is already full!`);
                return res.status(403).json({
                    message: `Announcement is already full!`
                });
            }
        }

        else {
            // === user is booking ===
            // check if there's room left
            if (ann.reservations.length < ann.maxReservations) {
    
                // push the user's id to reservation queue
                ann.queuedReservations.push(userId);
                ann = await ann.save();
    
                // response of successful operation
                console.log(`Announcement updated!`);
                return res.status(201).json({
                    message: `Announcement updated!`
                });
    
            } else {
                console.log(`Announcement is already full!`);
                return res.status(403).json({
                    message: `Announcement is already full!`
                });
            }

        }

    } catch (e) {
        console.log(`Error: ${e}`);

        return res.status(403).json({
            message: `error retrieving announcement with id ${annId}`
        });
    }
});


module.exports = router;
