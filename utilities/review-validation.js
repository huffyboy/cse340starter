const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const reviewController = require("../controllers/reviewController")
const invController = require("../controllers/invController")
const utilities = require("./")
const path = require('path');
const validate = {}


validate.reviewRules = () => {
    return [
        body("review_text")
            .trim()
            // .escape()
            .notEmpty()
            .withMessage("Text cannot be empty.")
            .isLength({ min: 10 })
            .withMessage("Provide a review of at least 10 characters."),
    ]
}


validate.checkReviewData = async (req, res, next, params = {}) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return inventoryModel.buildByInventoryId(req, res, next, {
            errors: errors.array(),
            ...req.body,
        })
    }
    next()
}


validate.checkUpdateData = async (req, res, next, params = {}) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return reviewController.buildEditReview(req, res, next, {
      errors: errors.array(),
      ...req.body,
    })
  }
  next()
}


module.exports = validate