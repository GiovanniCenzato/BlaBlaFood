/**
 * Use of mock-function to not have to connect hte database
 */

const { describe } = require("yargs");
const request = require('supertest');
const app     = require('./app');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens

describe('GET /api/users_v2', () => {
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


    test('GET /api/users_v2/me with no token should return 401', async () => {
        const response = await request(app).get('/api/users_v2/me');
        expect(response.statusCode).toBe(401);
    });

      
    test('GET /api/users_v2/me?token=<invalid> should return 403', async () => {
        const response = await request(app).get('/api/users_v2/me?token=123456');
        expect(response.statusCode).toBe(403);
    });

});