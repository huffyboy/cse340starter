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
    (req, res) => {
      res.status(200).send('login process')
    },
)

// Process the registration data
router.post(
    "/register",
    formValidate.registationRules(),
    formValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount),
)

module.exports = router;
