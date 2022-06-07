const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

beforeAll(async () => {
    jest.setTimeout(50000);
    app.locals.db = await mongoose.connect(process.env.MONGODB_URL);
});
afterAll( async () => { 
    await mongoose.connection.close(true);
});

// /api/v2/announcements
describe('Test /api/v2/announcements', () => {
    test('POST /api/v2/announcements should return status 302 if token not provided', async () => {
        // token
        var token = {}; 

        // test
        return request(app).post('/api/v2/announcements')
            .set('x-access-token', token)
            .expect(302)
    });
    
    test('POST /api/v2/announcements should return status 403 if attributes are undefined', async () => {
        // token
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400};
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
        // test
        return request(app).post('/api/v2/announcements')
            .set('x-access-token', token)
            .expect(403)
    });
    
});


// /api/v2/announcements
describe('Test /api/v2/announcements', () => {
    // test('GET /api/v2/announcements should return 404 if no announcement is in the database', async () => {
    //     // token
    //     var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
    //     var options = {expiresIn: 86400};
    //     var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
    //     // test
    //     return request(app).get('/api/v2/announcements')
    //         .set('x-access-token', token)
    //         .expect(403)
    // });
    
    test('GET /api/v2/announcements should return 201 if there are announcements in the db', async () => {
        // token
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400};
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
        // test
        return request(app).get('/api/v2/announcements')
            .set('x-access-token', token)
            .expect(201)
    });
});

// /api/v2/announcements/:id
describe('Test /api/v2/announcements/:id', () => {
    test('GET /api/v2/announcements/:id should return 403 if id in parameters is malformed', async () => {
        // id
        var id = '6297ca580adab18f5f35ac3m';

        // test
        return request(app).get('/api/v2/announcements/'+id)
            .expect(403)
    });
    
    test('POST /api/v2/announcements/:id should return 404 if id in parameters does not match any announcement in the db', async () => {
        // id
        var id = '6297c927e8be3fff38b9ed50'; // not in db

        // test
        return request(app).post('/api/v2/announcements/'+id)
            .expect(404)
    });

    test('GET /api/v2/announcements/:id should return 201 if id is correct', async () => {
        // id
        var id = '6297c927e8be3fff38b9ed49'; // in db

        // test
        return request(app).get('/api/v2/announcements/'+id)
            .expect(201)
    });
    
});

// /api/v2/announcements/:id/book
describe('Test /api/v2/announcements/:id/book', () => {
    test('POST /api/v2/announcements/:id/book should return 403 if id in parameters is malformed', async () => {
        // token
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400};
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
        // id
        var id = '32432423423';

        // test
        return request(app).post('/api/v2/announcements/'+id+'/book')
            .set('x-access-token', token)
            .expect(403)
    });
    
    test('POST /api/v2/announcements/:id/book should return 403 if there is no room left in the announcement', async () => {
        // token
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400};
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
        // id
        var id = '6297ca580adab18f5f35ac3f'; // in db, full

        // test
        return request(app).post('/api/v2/announcements/'+id+'/book', {

        })
            .set('x-access-token', token)
            .expect(403)
    });

    test('GET /api/v2/announcements/:id/book should return 201 if everything is fine', async () => {
        // token
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400};
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
        // id
        var id = '629fa1ed035b8c4a27d066cf'; // in db, not full

        // test
        return request(app).post('/api/v2/announcements/'+id+'/book')
            .set('x-access-token', token)
            .expect(201)
    });
});

// /api/v2/announcements/:id/confirm
describe('Test /api/v2/announcements/:id/confirm', () => {
    test('POST /api/v2/announcements/:id/confirm should return 403 if id in parameters is malformed', async () => {
        // token
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400};
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
        // id
        var id = '6297ca580adab18f5f35ac3m';

        // test
        return request(app).post('/api/v2/announcements/'+id+'/confirm')
            .set('x-access-token', token)
            .expect(403)
    });

    test('POST /api/v2/announcements/:id/confirm should return 403 if userToConfirmId in parameters is malformed', async () => {
        // token
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400};
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
        // id
        var id = '6297ca580adab18f5f35ac3m';
        var userToConfirmId = 'sadfgh';

        // test
        return request(app).post('/api/v2/announcements/'+id+'/confirm', {
            body: {
                userToConfirmId: userToConfirmId
            }
        })
            .set('x-access-token', token)
            .expect(403)
    });

    test('POST /api/v2/announcements/:id/confirm should return 403 if there is no room left in the announcement', async () => {
        // token
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400};
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
        // id
        var id = '6297ca580adab18f5f35ac3f'; // in db, full _C
        var userToConfirmId = 'sadfgh';

        // test
        return request(app).post('/api/v2/announcements/'+id+'/confirm', {
            body: {
                userToConfirmId: userToConfirmId
            }
        })
            .set('x-access-token', token)
            .expect(403)
    });

    test('POST /api/v2/announcements/:id/confirm should return 201 if everything is fine', async () => {
        // token
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400};
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
        // id
        var id = '629fa1ed035b8c4a27d066cf'; // in db, not full
        var userToConfirmId = '6290aaf2cd59ed8a36ebeede';

        // test
        return request(app).post('/api/v2/announcements/'+id+'/confirm', {
            body: {
                userToConfirmId: userToConfirmId
            }
        })
        .set('x-access-token', token)
        .expect(201)
    });
});