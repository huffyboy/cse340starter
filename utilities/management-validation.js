const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const invController = require("../controllers/invController")
const utilities = require("./")
const path = require('path');
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


validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please select a classification from the dropdown menu.")
      .custom(async (classification_id) => {
        const classificationExists = await inventoryModel.checkExistingClassificationById(classification_id)
        if (!classificationExists) {
          throw new Error("No classification found for classification provided.")
        }
      }),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide the make of the vehicle."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide the model of the vehicle."),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide the year of the vehicle.")
      .isLength({ min: 4, max: 4 })
      .withMessage("The year must be exactly four digits long."),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .matches(/^\d{1,9}$/)
      .withMessage("Price must be a whole number with up to nine digits."),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .matches(/^\d+$/)
      .withMessage("Miles must be a valid whole number."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color must consist of letters and spaces only."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description cannot be empty."),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid image.")
      .custom(async (inv_image) => {
        const decodedImagePath = utilities.decodeHTMLEntities(inv_image);
        const regexPattern = /^\/images\/vehicles\/[\w\-\.]+\.(jpg|jpeg|png|gif|bmp)$/i;
        if (!regexPattern.test(decodedImagePath)) {
          throw new Error("Please provide a valid image.");
        }

        const imageFiles = await utilities.getVehicleImages();
        const filename = path.basename(decodedImagePath);
        if (!imageFiles.includes(filename)) {
          throw new Error("Image not found, please make sure the file is available.");
        }
    }),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid thumbnail.")
      .custom(async (inv_thumbnail) => {
        const decodedThumbnailPath = utilities.decodeHTMLEntities(inv_thumbnail);
        const regexPattern = /^\/images\/vehicles\/[\w\-\.]+-tn\.(jpg|jpeg|png|gif|bmp)$/i;
        if (!regexPattern.test(decodedThumbnailPath)) {
          throw new Error("Please provide a valid thumbnail.");
        }

        const imageFiles = await utilities.getVehicleThumbnailImages();
        const filename = path.basename(decodedThumbnailPath);
        if (!imageFiles.includes(filename)) {
          throw new Error("Thumbnail not found, please make sure the file is available.");
        }
      }),
  ]
}


validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return invController.buildAddInventory(req, res, next, {
      errors: errors.array(),
      ...req.body,
    })
  }
  next()
}


module.exports = validate
