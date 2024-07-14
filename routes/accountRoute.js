const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const formValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/logout", utilities.handleErrors(accountController.accountLogout));

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
  utilities.handleErrors(accountController.buildLoginHome),
)

router.get(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate),
)
router.post(
  "/update",
  utilities.checkLogin,
  formValidate.updateAccountRules(),
  formValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount),
)
router.post(
  "/update-password",
  formValidate.updateAccountPasswordRules(),
  formValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updatePassword),
)

module.exports = router;
