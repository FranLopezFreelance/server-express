var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var User = require('../models/user');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');

app.use(fileUpload());

app.put('/:model/:id', (req, res, next) => {

    var model = req.params.model;
    var id = req.params.id;
    var validCollections = ['hospitals', 'doctors', 'users'];
    var validExt = ['png', 'jpg', 'jpeg', 'gif'];

    if(!req.files) {
        return res.status(400).json({
            ok:  false,
            message: 'No se seleccionó ningún archivo',
            errors: { message: 'Debe seleccionar una imágen' }
        });
    }

    var file = req.files.img;
    var splitFile = file.name.split('.');
    var ext = splitFile[ splitFile.length - 1 ];

    if( validCollections.indexOf(model) < 0) {
        return res.status(400).json({
            ok:  false,
            message: 'Colección no válida',
            errors: { message: 'Colecciones permitidas: ' + valvalidCollections.join(', ') }
        });
    }

    if ( validExt.indexOf(ext) < 0) {
        return res.status(400).json({
            ok:  false,
            message: 'Extensión no válida',
            errors: { message: 'Extensiones permitidas: ' + validExt.join(', ') }
        });
    }

    var fileName = `${ id }-${ new Date().getMilliseconds() }.${ ext }`;

    var path = `./uploads/${ model }/${ fileName }`;

    file.mv( path, err => {
        if( err ) {
            return res.status(500).json({
                ok:  false,
                message: 'Error al subir archivo',
                errors: err
            });
        }

        uploadByCollection( model, id, fileName, res);
        
    });
});

function uploadByCollection( model, id, fileName, res) {
    if(model === 'users') {
        User.findById( id, (err, user) => {

            if( !user ) {
                return res.status(400).json({
                    ok:  false,
                    message: 'El usuario no existe',
                    errors: {message: 'El usuario no existe'}
                });
            }

            var oldPath = './uploads/users/' + user.img;

            if(fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            user.img = fileName;

            user.save( (err, updatedUser) => {
                if( err ) {
                    return res.status(500).json({
                        ok:  false,
                        message: 'Error al subir archivo',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok:  true,
                    message: 'Imágen de Usuario actualizada',
                    user: updatedUser
                });
            });
        });
    } 
    
    if(model === 'hospitals') {
        Hospital.findById( id, (err, hospital) => {

            if( !hospital ) {
                return res.status(400).json({
                    ok:  false,
                    message: 'El hospital no existe',
                    errors: {message: 'El hospital no existe'}
                });
            }

            var oldPath = './uploads/hospitals/' + hospital.img;

            if(fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            hospital.img = fileName;

            hospital.save( (err, updatedHospital) => {
                if( err ) {
                    return res.status(500).json({
                        ok:  false,
                        message: 'Error al subir archivo',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok:  true,
                    message: 'Imágen de Hospital actualizada',
                    hospital: updatedHospital
                });
            });
        });
    }

    if(model === 'doctors') {
        Doctor.findById( id, (err, doctor) => {

            if( !doctor ) {
                return res.status(400).json({
                    ok:  false,
                    message: 'El médico no existe',
                    errors: {message: 'El médico no existe'}
                });
            }
            
            var oldPath = './uploads/doctors/' + doctor.img;

            if(fs.existsSync(oldPath)) {
                fs.unlink(oldPath);
            }

            doctor.img = fileName;

            doctor.save( (err, updatedDoctor) => {
                if( err ) {
                    return res.status(500).json({
                        ok:  false,
                        message: 'Error al subir archivo',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok:  true,
                    message: 'Imágen del Médico actualizada',
                    doctor: updatedDoctor
                });
            });
        });
    }
}

module.exports = app;