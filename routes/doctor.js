var express = require('express');

var auth = require('../middlewares/auth');

var app = express();

var Doctor = require('../models/doctor');

/////////
// GET
/////////
app.get('/', (req, res, next) => {

    var from = req.query.from;
    from = Number(from);

    Doctor.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital', 'name')
        .exec((err, doctors) => {   
            if (err) {
                return res.status(500).json({
                    ok:  false,
                    message: 'Error en la carga de Médicos',
                    errors: err
                });
            }

            Doctor.count({}, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok:  false,
                        message: 'Error en la carga de Médicos',
                        errors: err
                    });
                }
                
                res.status(200).json({
                    ok:  true,
                    doctors: doctors,
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

    Doctor.findById( id, (err, doctor ) => {
        if (err) {
            return res.status(500).json({
                ok:  false,
                message: 'Error al buscar el Médico',
                errors: err
            });
        }

        if (!doctor) {
            return res.status(400).json({
                ok:  false,
                message: 'No existe Médico con id: ' + id,
                errors: { message: 'No existe Médico con ese ID' }
            });
        }

        doctor.name = body.name;
        doctor.user = req.user._id;
        doctor.hospital = body.hospital;

        doctor.save( ( err, savedDoctor ) => {
            if (err) {
                return res.status(400).json({
                    ok:  false,
                    message: 'Error al actualizar el Médico',
                    errors: err
                });
            }

            res.status(201).json({
                ok:  true,
                doctor: savedDoctor
            });
        });
    });
});

/////////
// POST
/////////

app.post('/', auth.tokenVerify , (req, res) => {

    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save( ( err, newDoctor ) => {
        if (err) {
            return res.status(400).json({
                ok:  false,
                message: 'Error al crear Médico',
                errors: err
            });
        }

        res.status(201).json({
            ok:  true,
            doctor: newDoctor
        });
    });
});

/////////
// DELETE
/////////

app.delete('/:id', auth.tokenVerify , (req, res) => {

    var id = req.params.id;

    Doctor.findByIdAndRemove(id, ( err, deletedDoctor ) => {
        if (err) {
            return res.status(500).json({
                ok:  false,
                message: 'Error al borrar Médico',
                errors: err
            });
        }

        if (!deletedDoctor) {
            return res.status(400).json({
                ok:  false,
                message: 'No existe Médico con id: ' + id,
                errors: { message: 'No existe Médico con ese ID' }
            });
        }

        res.status(200).json({
            ok:  true,
            doctor: deletedDoctor
        });
    });
});

module.exports = app;