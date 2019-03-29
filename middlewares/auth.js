var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.tokenVerify = function( req, res, next ) {
    var token = req.query.token;
    jwt.verify( token, SEED, ( err, decoded ) => {
        if ( err ) {
            return res.status(401).json({
                ok:  false,
                message: 'Token Incorrecto',
                errors: { message: 'Token Incorrecto' }
            });
        }

        req.user = decoded.user;

        next();
    });
}