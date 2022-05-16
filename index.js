const app = require('./app/app');
const mongoose = require('mongoose');

// port
const PORT = process.env.PORT || 3000;

// connect to database
app.locals.db = mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    console.log("Connected to db");
    
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
})
.catch( (e) => {
    console.log(`Could not connect to database.\n err: ${e}`);
})
