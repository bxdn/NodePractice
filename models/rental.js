const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                maxlength: 255
            },
            phone: {
                type: String,
                required: true,
                maxlength: 255
            },
            isGold: {
                type: Boolean,
                default: false
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

function validateRental(rental){
    const schema = {
        customerId: Joi.objectId(),
        movieId: Joi.objectId()
    };
    return Joi.validate(rental, schema);
}

async function newRental(rentalParams){
    const rental = new Rental(rentalParams);
    try{
        const result = await rental.save();
        console.log(result);
    }
    catch(ex){
        for(field in ex.errors){
            console.log(ex.errors[field]);
        }
    }
}

async function getRentals(){
    return await Rental.find();
}

exports.getRentals = getRentals;
exports.newRental = newRental;
exports.validateRental = validateRental;
exports.Rental = Rental;
