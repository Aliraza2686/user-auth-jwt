const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email : {
        type :String,
        trim : true,
        required : [true, 'Email is required'],
        unique : true,
        lowercase : true,
        validate : [isEmail, 'Please enter a valid email']
    },
    password : {
        type : String,
        required : [true, 'password is required'],
        minLength : [6, 'Minimum password length is 6 characters'] 
    }
})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 8)

    next()
})

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email})
    if(user) {
       const isMatch = await bcrypt.compare(password, user.password)
       if(isMatch) {
          return user
       }
       throw new Error('invalid password')
    } 
    throw new Error('invalid email')
}

const User = mongoose.model('User', userSchema)

module.exports = User