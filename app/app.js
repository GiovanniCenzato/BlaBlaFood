const express = require('express');
const app = express();
const cors = require('cors');
const users = require('./api/users');
const announcements = require('./api/announcements,js');


/**
 * Static HTML pages
 */
app.use('', express.static('public'));

/**
 * Express configuration
 */
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/**
 * Routes
 */
app.use('/api/v1/users', users);
app.use('/api/v1/announcements', announcements);

module.exports = app;