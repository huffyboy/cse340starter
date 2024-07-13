const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
     })
    return
    }
    try {
     if (await bcrypt.compare(account_password, accountData.account_password)) {
     delete accountData.account_password
     const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
     if(process.env.NODE_ENV === 'development') {
       res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
       } else {
         res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
       }
     return res.redirect("/account/")
     }
    } catch (error) {
     return new Error('Access Forbidden')
    }
}

/* ****************************************
*  Deliver logged in view
* *************************************** */
async function buildDefault(req, res, next, params = {}) {
    let nav = await utilities.getNav()
    res.render("account/default", {
        title: "Logged In",
        // styles: ['form'],
        nav,
        ...params,
    })
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildDefault }
