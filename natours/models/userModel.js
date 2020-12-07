const bcrypt = require('bcryptjs')

const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE & SAVE!!!
            validator: function (el) {
                return el === this.password
            },
            message: 'Password mismatch'
        }
    },
    photo: String

})

userSchema.pre('save', async function (next) { 
    //  Only run function if password was modified
    if (!this.isModified('password')) return next ()

    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete passwordConfirm field
    this.passwordConfirm = undefined
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User