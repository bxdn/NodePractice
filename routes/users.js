const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {validateUser, User} = require('../models/user.js');
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
    if ( await User.findOne({email: req.body.email}) )
        return res.status(400).send("A user with that email already exists!");
    const salt = await bcrypt.genSalt(10);
    const params = {
        name: req.body.name,
        email: req.body.email,
        passwordHash: await bcrypt.hash(req.body.password,salt)
    };
    const user = new User(params);
    try{
        await user.save();
    }
    catch(ex){
        for(field in ex.errors){
            console.log(ex.errors[field]);
        }
    }
    const token = user.genAuthToken();
    res.header('x-auth-token', token).send(_.pick(user,['name','email']));
});

module.exports = router;
