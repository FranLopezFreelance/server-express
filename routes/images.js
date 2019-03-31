var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:model/:img', (req, res, next) => {

    var model = req.params.model;
    var img = req.params.img;

    var pathImg = path.resolve( __dirname, `../uploads/${ model }/${ img }`);

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }
});

module.exports = app;