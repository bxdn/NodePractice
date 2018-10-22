const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        maxlength: 255,
        unique: true
    },
    passwordHash: {
        type: String,
        maxlength: 1024,
        required: true
    }
});

userSchema.methods.genAuthToken = function(){
    return jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = {
        name: Joi.string(),
        email: Joi.string(),
        password: Joi.string()
    };
    return Joi.validate(user, schema);
}

exports.validateUser = validateUser;
exports.User = User;
