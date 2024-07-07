// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const formValidate = require('../utilities/management-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.post(
    "/add-classification",
    formValidate.classificationRules(),
    formValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification),
)

router.post(
    "/add-inventory",
    formValidate.inventoryRules(),
    formValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory),
)

module.exports = router;
