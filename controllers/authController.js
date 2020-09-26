const jwt = require('jsonwebtoken')
const { signup, login } = require('../services/authService')

const maxAge = 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET, {
        expiresIn: maxAge
    })
}

module.exports.signup_get = async (req, res) => {
    res.render('signup')
}

module.exports.signup_post = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await signup({username, password})
        const token = createToken(user._id);
        res.cookie('jwt', token, {maxAge: maxAge * 1000})
        res.status(201).json(user)
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }
}

module.exports.login_get = async (req, res) => {
    res.render('login')
}

module.exports.login_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await login({username, password})        
        const token = createToken(user._id);
        res.cookie('jwt', token, {maxAge: maxAge * 1000})
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }
}

module.exports.logout_get = async (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/login')
}