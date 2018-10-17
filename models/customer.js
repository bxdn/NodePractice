const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
    },
    isGold: {
        type: Boolean,
        default: false
    }
}));

function validateCustomer(customer){
    const schema = {
        name: Joi.string(),
        phone: Joi.string(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}

async function newCustomer(customerParams){
    const customer = new Customer(customerParams);
    try{
        const result = await customer.save();
        console.log(result);
    }
    catch(ex){
        for(field in ex.errors){
            console.log(ex.errors[field]);
        }
    }
}

async function updateCustomerById(id,customerParams){
    return await Customer.findByIdAndUpdate(id, customerParams, {new: true});
}

async function removeCustomerById(id){
    return await Customer.findByIdAndRemove(id);
}

async function getCustomers(){
    return await Customer.find();
}

async function getCustomerById(id){
    return await Customer.findById(id);
}

exports.getCustomerById = getCustomerById;
exports.getCustomers = getCustomers;
exports.removeCustomerById = removeCustomerById;
exports.updateCustomerById = updateCustomerById;
exports.newCustomer = newCustomer;
exports.validateCustomer = validateCustomer;
