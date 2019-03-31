var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

var app = express();

var User = require('../models/user');

// Google Auth
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

app.post('/google', async (req, res) => {

    let token = req.body.token;

    let googleUser = await verify(token)
        .catch( err => {
            return res.status(403).json({
                ok: false,
                message: 'Token no válido'
            });
        });

    User.findOne({ email: googleUser.email }, (err, dbUser) => {
        if (err) {
            return res.status(500).json({
                ok:  false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if (dbUser) {
            if( dbUser.google === false ) {
                return res.status(400).json({
                    ok:  false,
                    message: 'Debe usuar su atenticación normal.',
                    errors: err
                });
            } else {
                var token = jwt.sign({ user: dbUser }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok:  true,
                    user: dbUser,
                    token: token,
                    id: dbUser._id
                });
            }
        } else {
            var user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = '=)';

            user.save((err, dbUser) => {
                if (err) {
                    return res.status(500).json({
                        ok:  false,
                        message: 'Error al guardar usuario',
                        errors: err
                    });
                }

                var token = jwt.sign({ user: dbUser }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok:  true,
                    user: dbUser,
                    token: token,
                    id: dbUser._id
                });
            });
        }
    });

    /* res.status(200).json({
        ok:  true,
        message: 'Google SignIn',
        googleUser: googleUser
    }); */
});

app.post('/', ( req, res ) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok:  false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok:  false,
                message: 'Credenciales inválidas #email',
                errors: { message: 'Credenciales Inválidas' }
            });
        }

        if( !bcrypt.compareSync( body.password, user.password ) ) {
            return res.status(400).json({
                ok:  false,
                message: 'Credenciales inválidas #password',
                errors: { message: 'Credenciales Inválidas' }
            });
        }

        user.password = '=)';

        var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok:  true,
            user: user,
            token: token,
            id: user._id
        });
    })
});


module.exports = app;