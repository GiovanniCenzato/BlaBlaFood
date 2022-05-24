const mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    announcements: []
});

schema.methods.comparePasswords = (psw1, psw2) => {
    return psw1==psw2;
}

module.exports = mongoose.model('User', schema);