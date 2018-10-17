const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255
    }
});
const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(1).required()
    };
    return Joi.validate(genre, schema);
}

async function newGenre(genreParams){
    const genre = new Genre(genreParams);
    try{
        const result = await genre.save();
        console.log(result);
    }
    catch(ex){
        for(field in ex.errors){
            console.log(ex.errors[field]);
        }
    }
}

async function updateGenreByName(name,newName){
    return await Genre.update({name: name},{
        $set: {
            name: newName
        }
    }, {new: true});
}

async function removeGenreByName(name){
    return await Genre.remove({name: name});
}

async function getGenres(){
    return await Genre.find();
}

async function getGenreByName(name){
    return await Genre.findOne({name: name});
}

exports.getGenreByName = getGenreByName;
exports.getGenres = getGenres;
exports.removeGenreByName = removeGenreByName;
exports.updateGenreByName = updateGenreByName;
exports.newGenre = newGenre;
exports.validateGenre = validateGenre;

exports.genreSchema = genreSchema;
