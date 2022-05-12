var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Announcement', new Schema({ 
	title: String,
    description: String,
    tags: Array,
    authorId: ObjectId,
    reservations: Array,
    maxReservations: Int,
    queuedReservations: Array
}));