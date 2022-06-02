const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// set up a mongoose model
var schema = new Schema({ 
	name: String,
    surname: String,
    username: String,
    phone: String,
    birthday: Date,
    home: String,
    email: String,
    password: String,
    userpic: String,
    announcements: [],			// array of announcements that the user had published
    reviews: []				// array of reviews recived from other users
});

schema.methods.comparePasswords = (bodypsw, userpsw) => {
    return bcrypt.compareSync(bodypsw, userpsw);
}

module.exports = mongoose.model('User', schema);
