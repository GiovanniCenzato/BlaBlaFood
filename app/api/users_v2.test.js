/**
 * Use of mock-function to not have to connect hte database
 */

const request = require('supertest');
const app     = require('../app');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens

describe('GET /api/v2/users/me', () => {

    let userSpy;

    beforeAll( () => {
        const User = require('../models/user');
        userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
            return [{
                //id: 0000 ,
                email: 'andrea.pizzo@gmail.com'
            }]
        });
    });

    afterAll(async () => {
        userSpy.mockRestore();
    });

    //user non loggato cerca di accedere a pagina '/me'
    test('GET /api/v2/user/me with no token should return 302', async () => {
        const response = await request(app).get('/api/v2/users/me');
        expect(response.statusCode).toBe(302);
    });

    //user con token invalido cerca di accedere a pagina '/me'
    test('GET /api/v2/users/me?token=<invalid> should return 302', async () => {
        const response = await request(app).get('/api/v2/users/me?token=123456');
        expect(response.statusCode).toBe(302);
    });

    //istanziamento payload e options
    var payload = { email: 'andrea.pizzo@gmail.com', username: 'andrepizzo'};
    var options = { expiresIn: 43200 }; // expires in 12 hours

    //token creation
    /**     DAI UN OCCHIATA A QUESTA LOGICA [don't know if it ]
     * 
     *      var token;
     * 
            app.get('/api/v2/auth',function(req,res){
                token=jwt.sign(payload, process.env.SUPER_SECRET, options);
                res.send(token);
            });
     */

         
    //user con token valido cerca di accedere a pagina '/me'
    test('GET /api/v2/users/me?token=<valid> should return 200', async () => {
        expect.assertions(1);
        const response = await request(app).get('/api/v2/users/me?token='+token);
        expect(response.statusCode).toBe(200);
    });
    
    //user con token invalido cerca di accedere a pagina '/me' e leggere info
    test('GET /api/v2/users/me?token=<valid> should return user information', async () => {
        expect.assertions(2);
        const response = await request(app).get('/api/v2/users/me?token='+token);
        const user = response.body;
        expect(user).toBeDefined();
        expect(user.email).toBe('andrea.pizzo@gmail.com');
    });

});




describe('GET /api/v2/users/:id', () => {

    let userSpy;

    beforeAll( () => {
        const User = require('../models/user');
        userSpy = jest.spyOn(User, 'findById').mockImplementation((id) => {
            if (id==1111)
                return {
                    id: 1111 ,
                    email: 'andrea.pizzo@gmail.com'
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
          .get('/api/v2/users/1111')
          .expect('Content-Type', /json/)
          .expect(201, {
              id: 1111 ,
              email: 'andrea.pizzo@gmail.com'
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
            id: 2222 , 
            email: 'andrea.pizzo@gmail.com' }];
        });
    });

    afterAll(async () => { 
        userSpy.mockRestore(); 
    });


    test('GET /api/v2/users should respond with an array of users', async () => {
    request(app).get('/api/v2/users').expect('Content-Type', /json/).then( (res) => {
    if(res.body && res.body[0])
        expect(res.body[0]).toEqual({id: 2222 , email: 'andrea.pizzo@gmail.com'})
    });
    });
});