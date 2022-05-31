var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Announcement', new Schema({ 
	title: String,
    description: String,
    address: String,
    city: String,
    date: Date,                         // date and time together 
    tags: [],
    maxReservations: Number,
    price: Number,
    authorId: Schema.Types.ObjectId,
    reservations: [],			// queue of users that are accepted for the announce
    queuedReservations: []		// queue of users that want to reserve the announce
}));
