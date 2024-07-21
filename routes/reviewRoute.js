// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const formValidate = require('../utilities/review-validation')

// add review post
router.post(
    "/add-review",
    utilities.checkLogin,
    formValidate.reviewRules(),
    formValidate.checkReviewData,
    utilities.handleErrors(reviewController.addReview),
)

// edit review form and post
router.get(
    "/edit/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.buildEditReview)
)
router.post(
    "/update/",
    utilities.checkLogin,
    formValidate.reviewRules(),
    formValidate.checkUpdateData,
    utilities.handleErrors(reviewController.updateReview),
)

// delete review form and post
router.get(
    "/delete/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.buildDeleteConfirm)
)
router.post(
    "/delete/",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.deleteReview),
)

module.exports = router;