var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m','conectada');
});

app.listen(3000, ()=>{
    console.log('Server Express puerto 3000: \x1b[32m%s\x1b[0m','online');
});

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok:  true,
        message: 'Petición realizada corectamente'
    });
});