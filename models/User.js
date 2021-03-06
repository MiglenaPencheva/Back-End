const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/config');

const userScheme = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    }
});

userScheme.pre('save', async function(next) {
        let salt = await bcrypt.genSalt(SALT_ROUNDS);
        let hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
});

module.exports = mongoose.model('User', userScheme);
