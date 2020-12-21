const express = require('express')

const { 
    getAllTours, 
    getTour, 
    createTour, 
    updateTour, 
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
    getToursWithin
} = require('../controllers/tourController')

const {
    protect,
    restrictTo
} = require('../controllers/authController')

const reviewRouter = require('../routes/reviewRoutes')

const router = express.Router()

// router.param('id', checkID)

router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)

router.route('/tour-stats')
    .get(getTourStats)

router.route('/monthly-plan/:year')
    .get(protect, restrictTo('admin', 'lead-guide', 'guide'),getMonthlyPlan)

// /tours-within?distance=300&latlng=-40,30&unit=mi       Using query strings
router.route('/tours-within/:distance/latlng/:latlng/unit/:unit').get(getToursWithin)

router.route('/')
    .get(getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour)

router.route('/:id')
    .get(getTour)
    .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

module.exports = router