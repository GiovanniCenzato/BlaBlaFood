/**
 * Use of mock-function to not have to connect hte database
 */

const { describe } = require("yargs");
const request = require('supertest');
const app     = require('./app');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens

describe('GET /api/v2/users', () => {

    let userSpy;

    beforeAll( () => {
        const User = require('./models/user');
        userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
            return {
                email: 'andrea.pizzo@gmail.com'
            }
        });
    });

    afterAll(async () => {
        userSpy.mockRestore();
    });


    test('GET /api/v2/user/me with no token should return 401', async () => {
        const response = await request(app).get('/api/v2/users/me');
        expect(response.statusCode).toBe(401);
    });

      
    test('GET /api/v2/users/me?token=<invalid> should return 403', async () => {
        const response = await request(app).get('/api/v2/users/me?token=123456');
        expect(response.statusCode).toBe(403);
    });

    var payload = { email: 'andrea.pizzo@gmail.com' };
    var options = { expiresIn: 43200 }; // expires in 12 hours

    //token creation
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
          
    test('GET /api/v2/users/me?token=<valid> should return 200', async () => {
        expect.assertions(1);
        const response = await request(app).get('/api/v2/users/me?token='+token);
        expect(response.statusCode).toBe(200);
    });
    

    test('GET /api/v2/users/me?token=<valid> should return user information', async () => {
        expect.assertions(2);
        const response = await request(app).get('/api/v2/users/me?token='+token);
        const user = response.body;
        expect(user).toBeDefined();
        expect(user.email).toBe('andrea.pizzo@gmail.com');
    });

});