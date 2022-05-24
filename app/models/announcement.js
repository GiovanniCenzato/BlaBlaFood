var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Announcement', new Schema({ 
	title: String,
    description: String,
    address: String,
    city: String,
    date: Date,                         // includes time 
    tags: [],
    maxReservations: Number,
    price: Number,
    authorId: Schema.Types.ObjectId,
    reservations: [],
    queuedReservations: []
}));