// Needed Resources
const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Build route to force error
router.get("/", utilities.handleErrors(errorController.forceError));

module.exports = router;