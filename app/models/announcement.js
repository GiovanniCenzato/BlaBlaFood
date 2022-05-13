var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Announcement', new Schema({ 
	title: String,
    description: String,
    tags: [],
    authorId: Schema.Types.ObjectId,
    reservations: [],
    maxReservations: Number,
    queuedReservations: []
}));