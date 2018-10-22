const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const {User} = require('../models/user.js');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

router.get('/',async (req,res)=>{
    res.send(await User.find());
});
router.get('/:id',async (req,res)=>{
    const user = await User.findById(req.params.id);
    if (!user){
        return res.status(404).send("Customer does not exist!");
    }
    res.send(user);
});

router.post('/',async (req,res)=>{
    const { error } = validateUser(req.body);
    if( error ) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email: req.body.email})
    if ( !user ) return res.status(400).send("Invalid Email/Password!");
    const validPass = await bcrypt.compare(req.body.password,user.passwordHash)
    if ( !validPass ) return res.status(400).send("Invalid Email/Password!");

    const token = user.genAuthToken();
    res.header('x-auth-token', token).send(_.pick(user,['name','email']));
});

function validateUser(req){
    const schema = {
        email: Joi.string(),
        password: Joi.string()
    };
    return Joi.validate(req, schema);
}

module.exports = router;
