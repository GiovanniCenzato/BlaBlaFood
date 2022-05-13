/* IMPORTS */
const express = require('express');
const mongoose = require('mongoose')

var app = express();
PORT = 3000

/* DATABASE CONNECTION */
const dbConnection =  mongoose.connect(
	'mongodb+srv://'+process.env.MONGODB_ADMIN+':'+MONGODB_PSW+'@cluster.i2lzz.mongodb.net/'+process.env.MONGODB_DB+'?retryWrites=true&w=majority',
	{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
		console.log('Database connected');
})


app.listen(PORT, function() {
	console.log('Server running on port ', PORT);
});