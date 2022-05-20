const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

// set up a mongoose model
var schema = new Schema({ 
	name: String,
    username: String,
    email: String,
    password: String,
    home: String
});


module.exports = mongoose.model('User', schema);