const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, 'secret token', (err, decodedToken) => {
            if(err) {
                res.redirect('/login')
                console.log(err.message)
            }
            else {
                console.log(decodedToken)
                next()
            }
        })
    } 
    else {
        res.redirect('/login')
    }
 
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if(token) {

        jwt.verify(token, 'secret token', async (err, decodedToken) => {
            if(err) {
                console.log(err.message)
                res.locals.user = null
                next()
            }
            else {
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })

    }else {
        res.locals.user = null
        next()
    }
}

module.exports = {authMiddleware, checkUser}