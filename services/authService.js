const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');

async function register(username, password) {
    const user = new User({ username, password });
    return user.save();
}

async function login(username, password) {
    let user = await User.findOne({ username });
    if (!user) throw { message: 'User not found', status: 404 };

    let areEqual = await bcrypt.compare(password, user.password);
    if (!areEqual) throw { message: 'Wrong password', status: 404 };

    let token = jwt.sign({ _id: user._id, username: user.username }, SECRET);

    return token;
}

module.exports = {
    register,
    login
};