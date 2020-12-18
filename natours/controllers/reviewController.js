const Reviews = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Review = require('../models/reviewModel')

const getAllReviews = catchAsync ( async (req, res, next) => {
    const reviews = await Reviews.find()

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews }
    })
})

const getReview = catchAsync ( async(req, res, next) => {
    const review = await Reviews.findById(req.params.id)

    if(!review) {
        return next(new AppError('No review found', 404))
    }

    res.status(200).json({
        status: 'success',
        data: { review }
    })
})

const createReview = catchAsync ( async (req, res, next) => {
    const newReview = await Review.create(req.body)

    res.status(201).json({
        status: 'success',
        data: { newReview }
    })
})

module.exports = {
    getAllReviews,
    getReview,
    createReview
}
