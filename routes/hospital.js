var express = require('express');

var auth = require('../middlewares/auth');

var app = express();

var Hospital = require('../models/hospital');

/////////
// GET
/////////
app.get('/', (req, res, next) => {

    var from = req.query.from;
    from = Number(from);

    Hospital.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .exec((err, hospitals) => {   
            if (err) {
                return res.status(500).json({
                    ok:  false,
                    message: 'Error en la carga de Hospitales',
                    errors: err
                });
            }

            Hospital.countDocuments({}, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok:  false,
                        message: 'Error en la carga de Hospitales',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok:  true,
                    hospitals: hospitals,
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

    Hospital.findById( id, (err, hospital ) => {
        if (err) {
            return res.status(500).json({
                ok:  false,
                message: 'Error al buscar el Hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok:  false,
                message: 'No existe Hospital con id: ' + id,
                errors: { message: 'No existe Hospital con ese ID' }
            });
        }

        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save( ( err, savedHospital ) => {
            if (err) {
                return res.status(400).json({
                    ok:  false,
                    message: 'Error al actualizar el Hospital',
                    errors: err
                });
            }

            res.status(201).json({
                ok:  true,
                hospital: savedHospital
            });
        });
    });
});

/////////
// POST
/////////

app.post('/', auth.tokenVerify , (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        user: req.user._id
    });

    hospital.save( ( err, newHospital ) => {
        if (err) {
            return res.status(400).json({
                ok:  false,
                message: 'Error al crear Hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok:  true,
            hospital: newHospital
        });
    });
    
});

/////////
// DELETE
/////////

app.delete('/:id', auth.tokenVerify , (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, ( err, deletedHospital ) => {
        if (err) {
            return res.status(500).json({
                ok:  false,
                message: 'Error al borrar Hospital',
                errors: err
            });
        }

        if (!deletedHospital) {
            return res.status(400).json({
                ok:  false,
                message: 'No existe Hospital con id: ' + id,
                errors: { message: 'No existe Hospital con ese ID' }
            });
        }

        res.status(200).json({
            ok:  true,
            hospital: deletedHospital
        });
    });
});

module.exports = app;