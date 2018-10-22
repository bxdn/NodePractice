const express = require('express');
const router = express.Router();
const {
    getCustomerById,
    getCustomers,
    removeCustomerById,
    updateCustomerById,
    newCustomer,
    validateCustomer
} = require('../models/customer.js');
const auth = require('../middleware/auth.js');
router.get('/',async (req,res)=>{
    res.send(await getCustomers());
});
router.get('/:id',async (req,res)=>{
    const customer = await getCustomerById(req.params.id);
    console.log(customer);
    if (!customer){
        return res.status(404).send("Customer does not exist!");
    }
    res.send(customer);
});

router.post('/',auth,async (req,res)=>{
    const { error } = validateCustomer(req.body);
    if( error ){
        return res.status(400).send(error.details[0].message);
    }
    await newCustomer(req.body);
    res.send(await getCustomers());
});

router.put('/:id',auth,async (req,res)=>{
    const { error } = validateCustomer(req.body);
    if( error ){
        return res.status(400).send(error.details[0].message);
    }
    customer = await updateCustomerById(req.params.id,req.body);
    if (!customer){
        return res.status(404).send("Customer does not exist!");
    }
    res.send(customer);
});

router.delete('/:id',auth,async (req,res)=>{
    const customer = await removeCustomerById(req.params.id);
    if (!customer){
        return res.status(404).send("Customer does not exist!");
    }
    res.send(customer);
});

module.exports = router;
