const Reviews = require('../models/reviewModel')
// const catchAsync = require('../utils/catchAsync')
// const AppError = require('../utils/appError')
const Review = require('../models/reviewModel')
const factory = require('./handlerFactory')

const setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id

    next()
}

const createReview = factory.createOne(Review)

const updateReview = factory.updateOne(Review)

const deleteReview = factory.deleteOne(Review)

const getReview = factory.getOne(Review)

const getAllReviews = factory.getAll(Review)

module.exports = {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    setTourUserIds
}
