var express = require('express');
var app = express();

// Handling GET requests
app.get('/', function(req, res){
	res.send('Hello World!');
});

app.listen(port, function() {
	console.log('Server running on port ', 3000);
});
