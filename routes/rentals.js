const Fawn = require('fawn');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {getMovieById, updateMovieById} = require('../models/movie');
const {getCustomerById} = require('../models/customer');
const {
    getRentals,
    newRental,
    validateRental,
    Rental
} = require('../models/rental.js');
const auth = require('../middleware/auth.js');

Fawn.init(mongoose);

router.get('/',async (req,res)=>{
    res.send(await getRentals());
});

router.post('/',auth,async (req,res)=>{
    const { error } = validateRental(req.body);
    if( error ){
        return res.status(400).send(error.details[0].message);
    }
    const customer = await getCustomerById(req.body.customerId);
    if ( !customer ) return res.status(400).send('Invalid customer!');
    const movie = await getMovieById(req.body.movieId);
    if ( !movie ) return res.status(400).send('Invalid movie!');
    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock!');
    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    try{
        new Fawn.Task()
            .save('rentals',rental)
            .update('movies',{_id: movie._id},{$inc:{numberInStock: -1}})
            .run();
    }
    catch(ex){
        res.status(500).send('Something failed!')
    }

    res.send(await getRentals());
});

module.exports = router;
