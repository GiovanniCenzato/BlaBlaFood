/**
 * Use of mock-function to not have to connect hte database
 */
 const request = require('supertest');
 const app = require('../app');
 const mongoose = require('mongoose');
 const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
 
beforeAll( async () => { 
    jest.setTimeout(50000);
    app.locals.db = await mongoose.connect(process.env.MONGODB_URL);
});

afterAll( async () => { 
    await mongoose.connection.close(true);
});


 // /api/v2/users/me
 describe('GET /api/v2/users/me', () => {
 
     let userSpy;
 
     beforeAll(() => {
         const User = require('../models/user');
         userSpy = jest.spyOn(User, 'findById').mockImplementation((id) => {
             return {
                 _id: '6290b3df39da9ee76ca18c95',
                 name: 'Andrea',
                 surname: 'Bragante',
                 username: 'braggino',
                 phone: '3428855753',
                 birthday: '2000-10-31T00:00:00.000+00:00',
                 home: 'Trento',
                 email: 'andrea.bragante@studenti.unitn.it',
                 password: '$2b$05$J20MT/8jJMNNhg0ydT6ZqONhya7SC5KHtLjxq8sbLapPxgIqCgl.a',
                 announcements: 'Array',
                 reviews: 'Array',
                 __v: 2,
                 level: 150
             }
         });
     });
 
     afterAll(async () => {
         userSpy.mockRestore();
     });
 
     test('GET /api/v2/user/me with no token should return 302', async () => {
         const response = await request(app).get('/api/v2/users/me');
         expect(response.statusCode).toBe(302);
     });
 
     test('GET /api/v2/users/me should return 302', async () => {
         //token
         var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
         var options = { expiresIn: 86400 }; // expires in 24 hours
         var token = jwt.sign(payload, process.env.JWT_SECRET, options);
         
        //test
         const response = await request(app).get('/api/v2/users/me')
             .set('x-access-token', {});
         expect(response.statusCode).toBe(302);
     });
 
     test('GET /api/v2/users/me should return 201', async () => {
        //token
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400}; // expires in 24 hours
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
 
        //test
        const response = await request(app).get('/api/v2/users/me')
            .set('x-access-token', token);
        expect(response.statusCode).toBe(201);
     });
 
    test('GET /api/v2/users/me should return user information', async () => {
        //token 
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400}; // expires in 24 hours
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
        
        //test
         var response = await request(app).get('/api/v2/users/me').set('x-access-token', token);
         var user = await response.body.user;
         expect(user.email).toBe('andrea.bragante@studenti.unitn.it');
     });
 
 });
 
 // /api/v2/users/:id
 describe('GET /api/v2/users/:id', () => {
 
     let userSpy;
 
     beforeAll(() => {
         const User = require('../models/user');
         userSpy = jest.spyOn(User, 'findById').mockImplementation((id) => {
             if (id == '6290b3df39da9ee76ca18c95')
                 return {
                     id: '6290b3df39da9ee76ca18c95',
                     email: 'andrea.bragante@studenti.unitn.it'
                 }
             else
                 return {};
         });
     });
 
     afterAll(async () => {
         userSpy.mockRestore();
     });
 
     test('GET /api/v2/users/:id should respond with json', async () => {
        //token 
        var payload = {id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
        var options = {expiresIn: 86400}; // expires in 24 hours
        var token = jwt.sign(payload, process.env.JWT_SECRET, options);
 
        //test
        return request(app)
             .get('/api/v2/users/6290b3df39da9ee76ca18c95')
             .set('x-access-token', token)
             .expect('Content-Type', /json/)
             .expect(201, {
                 message: 'Found user with id 6290b3df39da9ee76ca18c95',
                 success: true,
                 user: {
                     id: '6290b3df39da9ee76ca18c95',
                     email: 'andrea.bragante@studenti.unitn.it'
                 }
             });
     });
 });
 
 
 
 // /api/v2/users
 describe('GET /api/v2/users', () => {
 
     let userSpy;

     beforeAll(() => {
         const User = require('../models/user');
         userSpy = jest.spyOn(User, 'find').mockImplementation((criterias) => {
             return [{
                 id: '6290b3df39da9ee76ca18c95',
                 email: 'andrea.bragante@studenti.unitn.it'
             }];
         });
     });
 
     afterAll(async () => {
         userSpy.mockRestore();
     });
 
 
     test('GET /api/v2/users should respond with an array of users', async () => {
         request(app).get('/api/v2/users').expect('Content-Type', /json/).then((res) => {
             if (res.body && res.body[0])
                 expect(res.body[0]).toEqual({
                     id: '6290b3df39da9ee76ca18c95',
                     email: 'andrea.bragante@studenti.unitn.it'
                 })
         });
     });
 });