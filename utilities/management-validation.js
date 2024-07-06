const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const invController = require("../controllers/invController")
const validate = {}


validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid classification name.")
      .matches(/^[\w]+$/)
      .withMessage("Classification name must not contain spaces or special characters.")
      .custom(async (classification_name) => {
        const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
        if (classificationExists) {
          throw new Error("Classification already exists, please use existing classification or provide a different name.")
        }
      }),
  ]
}


validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return invController.buildAddClassification(req, res, next, {
      errors: errors.array(),
      ...req.body,
    })
  }
  next()
}

module.exports = validate
