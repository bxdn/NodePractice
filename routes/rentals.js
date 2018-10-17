const express = require('express');
const router = express.Router();
const {getMovieById} = require('../models/movie');
const {getCustomerById} = require('../models/customer');
const {
    getRentals,
    newRental,
    validateRental
} = require('../models/rental.js');

router.get('/',async (req,res)=>{
    res.send(await getRentals());
});

router.post('/',async (req,res)=>{
    const { error } = validateRental(req.body);
    if( error ){
        return res.status(400).send(error.details[0].message);
    }
    const customer = await getCustomerById(req.body.customerId);
    if ( !customer ) return res.status(400).send('Invalid customer!');
    const movie = await getMovieById(req.body.movieId);
    if ( !movie ) return res.status(400).send('Invalid movie!');
    const params = {
        customer: {
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    }
    await newRental(params);
    res.send(await getRentals());
});

module.exports = router;
