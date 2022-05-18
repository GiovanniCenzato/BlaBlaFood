var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Announcement', new Schema({ 
	title: String,
    description: String,
    location: String,
    date: Date,
    tags: [],
    authorId: Schema.Types.ObjectId,
    reservations: [],
    maxReservations: Number,
    queuedReservations: []
}));