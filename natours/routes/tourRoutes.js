const express = require('express')

const { 
    getAllTours, 
    getTour, 
    createTour, 
    updateTour, 
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan
} = require('../controllers/tourController')

const {
    protect,
    restrictTo
} = require('../controllers/authController')

const {
    getAllReviews,
    createReview
} = require('../controllers/reviewController')

const router = express.Router()

// router.param('id', checkID)

router.route('/top-5-cheap').get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)

router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/').get(protect, getAllTours).post(createTour)

router.route('/:id').get(getTour).patch(updateTour).delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview)

module.exports = router