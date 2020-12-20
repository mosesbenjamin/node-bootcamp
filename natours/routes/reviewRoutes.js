const express = require('express')

const {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    setTourUserIds
} = require('../controllers/reviewController')

const {
    protect,
    restrictTo
} = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

router.route('/').get(getAllReviews).post(protect, restrictTo('user'), setTourUserIds, createReview)

router.route('/:id').get(getReview).delete(deleteReview).patch(updateReview)

module.exports = router