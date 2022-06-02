var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Announcement', new Schema({ 
	title: String,
    description: String,
    location: {
        address: String,
        coordinates: []
    },
    date: Date,                         // includes time 
    tags: [],
    price: Number,
    authorId: Schema.Types.ObjectId,
    maxReservations: Number,
    reservations: [],
    queuedReservations: []
}));
