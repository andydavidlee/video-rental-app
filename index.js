//Required Modules 
require('express-async-errors'); //Try catch module - adds a try catch to all routes
const error = require('./middleware/error');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const path = require('path');
const auth = require('./routes/auth');
const reviews = require('./routes/reviews');


const express = require('express');
const app = express();

// const multer = require('multer');

// const upload = multer();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// app.use(upload.array());
app.use(express.static(path.join(__dirname, './static')));

app.get('/', (req, res) => {
    res.render('pages/index');
})

if(!config.get('jwtPrivateKey')){
    //logs a fatal error is it is not set
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    //terminates the app by exiting the process. (process is a global variable)
    process.exit(1); //if we pass in 0 it means success anything else means fail
}

//Connect to MongoDB
mongoose.connect('mongodb://localhost:37017/stream', { useNewUrlParser: true })
    .then( ()=>{ console.log('connected'); } )
    .catch( err => console.error('connection failed', err) );

//Middleware
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/review', reviews);
//Error Middleware
app.use(error);

//Start Server 

app.listen(port, () => console.log(`Listening on port ${port}...`));