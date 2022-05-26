var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Review', new Schema({ 
	title: String,
    description: String,
    announcementId: Schema.Types.ObjectId,
    authorId: Schema.Types.ObjectId,
    stars: Number
}));