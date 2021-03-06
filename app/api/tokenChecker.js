const jwt = require('jsonwebtoken');
/**
 * Checks if the JWT token in the request is valid
 * 
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {Function} next Next function in stack
 */
 const tokenChecker = (req, res, next) => {
    // get token from either body, query or headers
    let token = req.headers['x-access-token'] || req.body.token || req.query.token;
    
    // empty token
    if (!token) {
        return res.status(403).redirect('/');
    }

    // validation
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        // token is not valid
        if (error) {
            return res.status(403).redirect('/');
        }

        // token is valid, set in request and move on
        req.token = decodedToken;
        req.username = req.body.username;       // useless?
        console.log('token okay, moving on');
        next();
    })
}

module.exports = tokenChecker;
