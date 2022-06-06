/**
 * Use of mock-function to not have to connect hte database
 */

 const request = require('supertest');
 const app     = require('../app');
 const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens

 //istanziamento payload e options
 var payload = { id: '6290b3df39da9ee76ca18c95', name: 'Andrea', email: 'andrea.bragante@studenti.unitn.it', username: 'braggino'};
 var options = { expiresIn: 43200 }; // expires in 12 hours
 var token = jwt.sign(payload, process.env.JWT_SECRET, options);
 
// to check
//  const mockRequest = (authHeader, sessionData) => ({
//     get(name) {
//       if (name === 'authorization') return authHeader
//       return null
//     },
//     session: { data: sessionData }
//   });
  
//   const mockResponse = () => {
//     const res = {}; 
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     return res;
//   };
  
  const tokenChecker = require('./tokenChecker');
  
  describe('GET /api/v2/users/me', () => {
 
     let userSpy;
 
     beforeAll( () => {
         const User = require('../models/user');
         userSpy = jest.spyOn(User, 'findById').mockImplementation((id) => {
             return {
                _id:'6290b3df39da9ee76ca18c95',
                name:'Andrea',
                surname:'Bragante',
                username:'braggino',
                phone:'3428855753',
                birthday:'2000-10-31T00:00:00.000+00:00',
                home:'Trento',
                email:'andrea.bragante@studenti.unitn.it',
                password:'$2b$05$J20MT/8jJMNNhg0ydT6ZqONhya7SC5KHtLjxq8sbLapPxgIqCgl.a',
                announcements:'Array',
                reviews:'Array',
                __v:2,
                level:150
             }
            });
        });
        
        afterAll(async () => {
            userSpy.mockRestore();
        });
        
        //user non loggato cerca di accedere a pagina '/me'
        test('GET /api/v2/user/me with no token should return 403', async () => {
            // to check
            // const req = mockRequest('76b1e728-1c14-43f9-aa06-6de5cbc064c2');
            // const res = mockResponse();
            // await headerAuthMiddleware(req, res, () => {});
            // await tokenChecker(req, res, () => {

            // });
            // expect(req.session.data).toEqual({ username: 'hugo' });
            
            const response = await request(app).get('/api/v2/users/me');
            expect(response.statusCode).toBe(403);
        });
 
     //user con token invalido cerca di accedere a pagina '/me'
     test('GET /api/v2/users/me should return 403', async () => {
         const response = await request(app).get('/api/v2/users/me')
         .set('x-access-token', undefined);
         expect(response.statusCode).toBe(403);
     });
 
     //user con token valido cerca di accedere a pagina '/me'
     test('GET /api/v2/users/me should return 201', async () => {
         expect.assertions(1);
         const response = await request(app).get('/api/v2/users/me')
         .set('x-access-token', token);
         expect(response.statusCode).toBe(201);
     });
     
     //user con token valido cerca di accedere a pagina '/me' e leggere info
     test('GET /api/v2/users/me should return user information', async () => {
         expect.assertions(2);
         const response = await request(app).get('/api/v2/users/me')
         .set('x-access-token', token);
         const user = response.body.user;
         expect(user).toBeDefined();
         expect(user.email).toBe('andrea.bragante@studenti.unitn.it');
     });

 });

 
 describe('GET /api/v2/users/:id', () => {
 
     let userSpy;
 
     beforeAll( () => {
         const User = require('../models/user');
         userSpy = jest.spyOn(User, 'findById').mockImplementation((id) => {
             if (id=='6290b3df39da9ee76ca18c95')
                 return {
                     id: '6290b3df39da9ee76ca18c95' ,
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
         return request(app)
           .get('/api/v2/users/6290b3df39da9ee76ca18c95')
           .set('x-access-token', token)
           .expect('Content-Type', /json/)
           .expect(201, {
                message: 'Found user with id 6290b3df39da9ee76ca18c95',
                success: true,
                user: {
                    id: '6290b3df39da9ee76ca18c95' ,
                    email: 'andrea.bragante@studenti.unitn.it'
                }
             });
       });
 });
 
 
 
 
 describe('GET /api/v2/users', () => {
 
     let userSpy; 
     // Moking User.find method that retrives all users
 
     beforeAll( () => {
         const User = require('../models/user');
         userSpy = jest.spyOn(User, 'find').mockImplementation((criterias) => {
         return [{ 
             id: '6290b3df39da9ee76ca18c95', 
             email: 'andrea.bragante@studenti.unitn.it' }];
         });
     });
 
     afterAll(async () => { 
         userSpy.mockRestore(); 
     });
 
 
     test('GET /api/v2/users should respond with an array of users', async () => {
     request(app).get('/api/v2/users').expect('Content-Type', /json/).then( (res) => {
     if(res.body && res.body[0])
         expect(res.body[0]).toEqual({id: '6290b3df39da9ee76ca18c95' , email: 'andrea.bragante@studenti.unitn.it'})
     });
     });
 });