const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

const updateMe = catchAsync( async (req, res, next) => {
    // 1) Create error if user POST password data
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400))
    }
    // 2) Filter out unwanted field name that is not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email')

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true, runValidators:true 
    })

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

const deleteMe = catchAsync( async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    })
})

const getUser = factory.getOne(User)

const createUser = ((req, res)=> {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined! Please use /signup instead'
    })
})

// DO NOT UPDATE PASSWORD WITH THIS!!
const updateUser = factory.updateOne(User)

const deleteUser = factory.deleteOne(User)

const getAllUsers = factory.getAll(User)

module.exports = { 
    getAllUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser,
    updateMe,
    deleteMe
}