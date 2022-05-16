var express = require('express');
var app = express();
const users = require('./api/users');

/**
 * Static HTML pages
 */
app.use('', express.static('public'));

/**
 * Express configuration
 */
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/**
 * Routes
 */
app.use('/api/v1/users', users);

module.exports = app;