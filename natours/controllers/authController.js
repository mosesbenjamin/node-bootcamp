const { promisify } = require('util')
const jwt = require('jsonwebtoken')

const AppError = require('../utils/appError')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const signup = catchAsync(async(req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    })

    const token = signToken(user._id )

    res.status(201).json({
        status: 'success',
        token,
        data: {user}
    })
})

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // 1) Check if email and password exist
    if(!email || !password){
        return next(new AppError('Please provide email and password', 400))
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password')

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }

    // 3) If everything is ok, send token to client
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})

const protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it exists
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new AppError(`You're not logged in`, 401))
    }

    // 2) Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // console.log(decoded)

    // 3) check if user still exists
    const currentUser = await User.findById(decoded.id)
    if(!currentUser){
        return next(new AppError(`The user belonging to the token no longer exists`, 401))
    }

    // 4) Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError(`User recently changed password! Please login again`, 401))
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser
    next()
})

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'delete-guide']
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }
        next()
    }
}

const forgotPassword = catchAsync (async (req, res, next) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email })
    if(!user){
        return next(new AppError('There is no user with that email address', 404))
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})

    // 3) Send it to user's email
})

const resetPassword = (req, res, next) => {

}

module.exports = {
    signup,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword
}