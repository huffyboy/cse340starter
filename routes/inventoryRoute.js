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

// management home view and helper endpoints
router.get(
    "/",
    utilities.handleErrors(invController.buildManagement)
);
router.get(
    "/getInventory/:classification_id",
    utilities.checkEmployeeAccessMiddleware,
    utilities.handleErrors(invController.getInventoryJSON)
)

// add classification form and post
router.get(
    "/add-classification",
    utilities.checkEmployeeAccessMiddleware,
    utilities.handleErrors(invController.buildAddClassification)
);
router.post(
    "/add-classification",
    utilities.checkEmployeeAccessMiddleware,
    formValidate.classificationRules(),
    formValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification),
)

// add inventory form and post
router.get(
    "/add-inventory",
    utilities.checkEmployeeAccessMiddleware,
    utilities.handleErrors(invController.buildAddInventory)
);
router.post(
    "/add-inventory",
    formValidate.inventoryRules(),
    formValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory),
)

// edit inventory form and post
router.get(
    "/edit/:inventory_id",
    utilities.checkEmployeeAccessMiddleware,
    utilities.handleErrors(invController.buildEditInventory)
)
router.post(
    "/update/",
    utilities.checkEmployeeAccessMiddleware,
    formValidate.inventoryRules(),
    formValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory),
)

// delete inventory form and post
router.get(
    "/delete/:inventory_id",
    utilities.checkEmployeeAccessMiddleware,
    utilities.handleErrors(invController.buildDeleteConfirm)
)
router.post(
    "/delete/",
    utilities.checkEmployeeAccessMiddleware,
    utilities.handleErrors(invController.deleteInventory),
)

module.exports = router;
