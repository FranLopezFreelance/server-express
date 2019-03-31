var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

/////////////////
// BY COLLECTION
/////////////////
app.get('/collection/:table/:search', (req, res) => {

    var search = req.params.search;
    var table = req.params.table;
    var regExp = new RegExp( search, 'i' );
    var promise;

    switch (table) {
        case 'hospitals':
            promise = hospitalsSearch( search, regExp);
            break;
        case 'doctors':
            promise = doctorsSearch( search, regExp);
            break;
        case 'users':
            promise = usersSearch( search, regExp);
            break;
    
        default:
            return res.status(400).json({
                ok:  false,
                message: 'Los tipos de búsqueda son sobre: Usuarios, Médicos y Hospitales',
                error: { message: 'Tipo de Colección no válido'}
            });
    }

    promise.then( data => {
        res.status(200).json({
            ok:  true,
            [table]: data
        });
    })
});

//////////////////
// ALL COLLECTIONS
//////////////////
app.get('/all/:search', (req, res, next) => {

    var search = req.params.search;
    var regExp = new RegExp( search, 'i' );

    Promise.all([
        hospitalsSearch( search, regExp),
        doctorsSearch( search, regExp),
        usersSearch( search, regExp)
    ])
    .then( responses => {
        res.status(200).json({
            ok:  true,
            hospitals: responses[0],
            doctors: responses[1],
            users: responses[2]
        });
    })
});

function hospitalsSearch( search, regExp ){
    return new Promise( (resolve, reject) => {
        Hospital.find({ name: regExp })
                .populate('user', 'name email')
                .exec( (err, hospitals) => {
            if(err) {
                reject('Error al cargar Hospitales', err);
            } else {
                resolve(hospitals);
            }
        });
    }); 
}

function doctorsSearch( search, regExp ){
    return new Promise( (resolve, reject) => {
        Doctor.find({ name: regExp })
            .populate('user', 'name email')
            .populate('hospital')
            .exec((err, doctors) => {
            if(err) {
                reject('Error al cargar Médicos', err);
            } else {
                resolve(doctors);
            }
        });
    }); 
}

function usersSearch( search, regExp ){
    return new Promise( (resolve, reject) => {
        User.find({}, 'name email role')
            .or([ { 'name': regExp }, { 'email': regExp } ])
            .exec( (err, users) => {
                if(err) {
                    reject('Error al cargar Usuarios', err);
                } else {
                    resolve(users);
                }
            });
    }); 
}

module.exports = app;