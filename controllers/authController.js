const router = require('express').Router();
// const { body } = require('express-validator');
const { register, login } = require('../services/authService');
const { COOKIE_NAME } = require('../config/config');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!username) throw { message: 'Wrong username' };
        if (!password) throw { message: 'Wrong password' };

        let token = await login(username, password);
        res.cookie(COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');

    } catch (err) {
        next(err);
    }
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res, next) => {
    const { username, password, repeatPassword } = req.body;
    try {
        if (!username) throw { message: 'Username required' };
        if (!password) throw { message: 'Password required' };
        if (password.length < 6) throw { message: 'Password should be 6 or more characters' };
        if (!repeatPassword) throw { message: 'Password required' };
        if (password != repeatPassword) throw { message: 'Password missmatch!' };

        await register(username, password);
        
        let token = await login(username, password);
        res.cookie(COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');

    } catch (err) {
        next(err);
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/');
});

module.exports = router;