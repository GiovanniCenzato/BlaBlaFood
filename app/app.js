const express = require('express');
const app = express();
const cors = require('cors');
const users = require('./api/users');
const announcements = require('./api/announcements.js');
const users_v2 = require('./api/users_v2');
const auth_v2 = require('./api/auth_v2');
const announcements_v2 = require('./api/announcements_v2');
const auth = require('./api/auth');

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
app.use('/api/v1/auth', auth);
app.use('/api/v1/announcements', announcements);
app.use('/api/v1/users', users);

app.use('/api/v2/announcements', announcements_v2);
app.use('/api/v2/users', users_v2);
app.use('/api/v2/auth', auth_v2);

module.exports = app;
