const express = require('express');
const router = express.Router();
const {
    getMovieById,
    getMovies,
    removeMovieById,
    updateMovieById,
    newMovie,
    validateMovie
} = require('../models/movie.js');
const {getGenreByName} = require('../models/genre.js');

router.get('/',async (req,res)=>{
    res.send(await getMovies());
});
router.get('/:id',async (req,res)=>{
    const movie = await getMovieById(req.params.id);
    console.log(movie);
    if (!movie){
        return res.status(404).send("Movie does not exist!");
    }
    res.send(movie);
});

router.post('/',async (req,res)=>{
    const { error } = validateMovie(req.body);
    if( error ) return res.status(400).send(error.details[0].message);
    const genre = await getGenreByName(req.body.genre);
    const params = {
        title: req.body.title,
        genre: {_id: genre._id, name: genre.name},
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    };
    //console.log(params);
    await newMovie(params);
    res.send(await getMovies());
});

router.put('/:id',async (req,res)=>{
    const { error } = validateMovie(req.body);
    if( error ){
        return res.status(400).send(error.details[0].message);
    }
    movie = await updateMovieById(req.params.id,req.body);
    if (!movie){
        return res.status(404).send("Movie does not exist!");
    }
    res.send(movie);
});

router.delete('/:id',async (req,res)=>{
    const movie = await removeMovieById(req.params.id);
    if (!movie){
        return res.status(404).send("Movie does not exist!");
    }
    res.send(movie);
});

module.exports = router;
