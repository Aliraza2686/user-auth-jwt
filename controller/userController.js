const User = require('../models/user')
const jwt = require('jsonwebtoken')
//error handler

const errorhandler = (err) => {
    console.log(err.message, err.code)

    let errors = {email : '', password : ''}

    if(err.message === 'invalid email') {
        errors.email = 'That email is already registered'
    }

    if(err.message === 'invalid password') {
        errors.password = 'That password is incorrect'
    }


    if(err.code === 11000) {
        errors.email= 'That email is already registered'
        return errors
    }

    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
           errors[properties.path] = properties.message
        })
    }
    return errors
}

//creating jsonwebtoken

const createToken = (id) => {
    return jwt.sign({id}, 'secret token')
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body
    try {
       const user = await User.create({email, password})
       const token = createToken(user._id)
       res.cookie('jwt', token, { httpOnly : true})
       res.status(201).json({user : user._id})

    } catch(err) {
       const errors = errorhandler(err)
       res.status(400).json({errors})
    }
}

module.exports.login_post = async (req, res) => {
  
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly : true})
        res.status(201).json({user : user._id})
    } catch(err) {
        const errors = errorhandler(err)
        res.status(400).json({errors})
    }
    
}

module.exports.logout_get = async(req, res) => {
    res.cookie('jwt', '', {maxAge : 1})
    res.redirect('/')
}
