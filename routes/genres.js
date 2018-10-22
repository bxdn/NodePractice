const express = require('express');
const router = express.Router();
const {
    getGenreByName,
    getGenres,
    removeGenreByName,
    updateGenreByName,
    newGenre,
    validateGenre
} = require('../models/genre.js');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/',async (req,res)=>{
    res.send(await getGenres());
});
router.get('/:name',async (req,res)=>{
    const genre = await getGenreByName(req.params.name);
    console.log(genre);
    if (!genre){
        return res.status(404).send("Genre does not exist!");
    }
    res.send(genre);
});

router.post('/', auth, async (req,res)=>{
    const { error } = validateGenre(req.body);
    if( error ){
        return res.status(400).send(error.details[0].message);
    }
    const genre = {
        name: req.body.name
    }
    await newGenre(genre);
    res.send(await getGenres());
});

router.put('/:name',[auth,admin],async (req,res)=>{
    const { error } = validateGenre(req.body);
    if( error ){
        return res.status(400).send(error.details[0].message);
    }
    genre = await updateGenreByName(req.params.name,req.body.name);
    if (!genre){
        return res.status(404).send("Genre does not exist!");
    }
    res.send(genre);
});

router.delete('/:name',[auth,admin],async (req,res)=>{
    const genre = await removeGenreByName(req.params.name);
    if (!genre){
        return res.status(404).send("Genre does not exist!");
    }
    res.send(genre);
});

module.exports = router;
