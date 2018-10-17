const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema, getGenreByName} = require('./genre.js');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true
    }
}));

function validateMovie(movie){
    const schema = {
        title: Joi.string(),
        genre: Joi.string(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    };
    return Joi.validate(movie, schema);
}

async function newMovie(movieParams){
    const movie = new Movie(movieParams);
    try{
        const result = await movie.save();
        console.log(result);
    }
    catch(ex){
        for(field in ex.errors){
            console.log(ex.errors[field]);
        }
    }
}

async function updateMovieById(id,movieParams){
    return await Movie.findByIdAndUpdate(id, movieParams, {new: true});
}

async function removeMovieById(id){
    return await Movie.findByIdAndRemove(id);
}

async function getMovies(){
    return await Movie.find();
}

async function getMovieById(id){
    return await Movie.findById(id);
}

exports.getMovieById = getMovieById;
exports.getMovies = getMovies;
exports.removeMovieById = removeMovieById;
exports.updateMovieById = updateMovieById;
exports.newMovie = newMovie;
exports.validateMovie = validateMovie;
