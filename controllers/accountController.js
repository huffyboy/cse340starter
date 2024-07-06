const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next, params = {}) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        styles: ['form'],
        nav,
        ...params,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next, params = {}) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Registration",
        styles: ['form'],
        nav,
        ...params,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(account_password, 10)

        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword,
        )

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you\'re registered ${account_firstname}. Please log in.`
            )
            res.status(201).redirect("/account/login")
        } else {
            req.flash("notice", "Sorry, the registration failed.")
            res.status(501).redirect("/account/register")
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).redirect("/account/register")
    }
}

module.exports = { buildLogin, buildRegister, registerAccount }
