const app = require('./app/app');
const mongoose = require('mongoose');
// require('dotenv').config();

// port
const PORT = process.env.PORT || 8080;

if (process.env.NODE != 'test'){
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

}

