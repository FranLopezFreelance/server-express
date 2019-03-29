// Express Server
var express = require('express');

var app = express();

app.listen(3000, ()=>{
    console.log('Server Express puerto 3000: \x1b[32m%s\x1b[0m','online');
});

// DB Conection
var mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',
    (err, res) => {
    if(err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m','conectada');
});

// Middlewares
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// App-Routes
var usersRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');

app.use('/users', usersRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);




