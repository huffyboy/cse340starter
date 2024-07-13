const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const formValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the login attempt
router.post(
  "/login",
  formValidate.loginRules(),
  formValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
)

// Process the registration data
router.post(
  "/register",
  formValidate.registationRules(),
  formValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
)

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildDefault),
)

module.exports = router;
