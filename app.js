// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

//Routes Requires
var imagesRoutes = require('./routes/images');
var uploadRoutes = require('./routes/upload');
var searchRoutes = require('./routes/search');
var doctorsRoutes = require('./routes/doctor');
var hospitalsRoutes = require('./routes/hospital');
var usersRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');

// Express Server
var app = express();

// CORS
app.use(cors());

app.listen(3000, () => {
    console.log('Server: \x1b[32m%s\x1b[0m','online');
});

// DB Conection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',
    (err, res) => {
    if(err) throw err;
    console.log('Database: \x1b[32m%s\x1b[0m','conected');
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Server Index Config 
/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads')); */

// App-Routes
app.use('/img', imagesRoutes);
app.use('/upload', uploadRoutes);
app.use('/search', searchRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/hospitals', hospitalsRoutes);
app.use('/users', usersRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);




