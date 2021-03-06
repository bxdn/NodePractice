const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const config = require('config');

const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')

const app = express();
if(!config.get('jwtPrivateKey')){
        console.error('jwtPrivateKey is not defined!');
        process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded());
app.use(helmet());

app.use('/api/genres',genres);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);

app.set('view engine', 'pug');

mongoose.connect('mongodb://localhost/vidly')
    .then(()=>console.log('Connected to MondoDB...'))
    .catch(err=>console.error('Could not connect to MondoDB',err));

const port = process.env.PORT || 3000;
app.listen(port,()=>{console.log(`Listening on port ${port}...`);});
