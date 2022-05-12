var express = require('express');
var app = express();
app.use('/static', express.static('public'));
PORT = 3000

// Handling GET requests
app.get('/', function(req, res){
	res.send('Hello World!');
});

app.listen(PORT, function() {
	console.log('Server running on port ', PORT);
});