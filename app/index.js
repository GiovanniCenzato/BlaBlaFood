/* IMPORTS */
const express = require('express');
const mongoose = require('mongoose')

const users = require('./api/users.js')
const announcements = require('./api/announcements.js')

const app = express();
PORT = 3000


/* DATABASE CONNECTION */
const dbConnection =  mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => {
		console.log('Database connected');
	}).catch(()=>{
		console.log('There was an error connecting to the databse.')
	})


/* MIDDLEWARE CONFIG */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static('static'));


/* ROUTING */
app.use('/api/v1/users', users)
app.use('/api/v1/announcements', announcements)

/* logica di token checking */
// TBI


app.listen(PORT, function() {
	console.log('Server running on port ', PORT);
});