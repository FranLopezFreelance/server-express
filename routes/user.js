var express = require('express');
var bcrypt = require('bcryptjs');

var auth = require('../middlewares/auth');

var app = express();

var User = require('../models/user');

/////////
// GET
/////////
app.get('/', (req, res, next) => {

    var from = req.query.from;
    from = Number(from);

    User.find({}, 'name email img role')
        .skip(from)
        .limit(5)
        .exec((err, users) => {   
            if (err) {
                return res.status(500).json({
                    ok:  false,
                    message: 'Error en la carga de Usuarios',
                    errors: err
                });
            }

            User.countDocuments({}, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok:  false,
                        message: 'Error en la carga de Usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok:  true,
                    users: users,
                    total: total
                });
            });

        });
});

/////////
// UPDATE
/////////
app.put('/:id', auth.tokenVerify , (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById( id, (err, user ) => {
        if (err) {
            return res.status(500).json({
                ok:  false,
                message: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok:  false,
                message: 'No existe Usuario con id: ' + id,
                errors: { message: 'No existe Usuario con ese ID' }
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save( ( err, savedUser ) => {
            if (err) {
                return res.status(400).json({
                    ok:  false,
                    message: 'Error al actualizar Usuario',
                    errors: err
                });
            }
            
            savedUser.password = '=)';

            res.status(201).json({
                ok:  true,
                user: user,
                userAuth: req.user
            });
        });
    });
});

/////////
// POST
/////////

app.post('/', auth.tokenVerify , (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save( ( err, newUser ) => {
        if (err) {
            return res.status(400).json({
                ok:  false,
                message: 'Error al crear Usuario',
                errors: err
            });
        }
        
        newUser.password = '=)';

        res.status(201).json({
            ok:  true,
            user: newUser,
            userAuth: req.user
        });
    });
    
});

/////////
// DELETE
/////////

app.delete('/:id', auth.tokenVerify , (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, ( err, deletedUser ) => {
        if (err) {
            return res.status(500).json({
                ok:  false,
                message: 'Error al borrar Usuario',
                errors: err
            });
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok:  false,
                message: 'No existe Usuario con id: ' + id,
                errors: { message: 'No existe Usuario con ese ID' }
            });
        }

        deletedUser.password = '=)';

        res.status(200).json({
            ok:  true,
            user: deletedUser,
            userAuth: req.user
        });
    });
});

module.exports = app;