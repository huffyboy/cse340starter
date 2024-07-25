const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const reviewModel = require("../models/review-model")
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
            res.status(500).redirect("/account/register")
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).redirect("/account/register")
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res, next, params = {}) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        return buildLogin(req, res, next, { account_email });
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        } else {
            req.flash("notice", "Please check your credentials and try again.")
            return buildLogin(req, res, next, { account_email });
        }
    } catch (error) {
        console.error("Login error:", error)
        req.flash("notice", "An error occurred while processing your request. Please try again later.")
        return buildLogin(req, res, next, { account_email });
    }
}


/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res, next, params = {}) {
    res.clearCookie("jwt");
    req.flash("notice", "You have successfully logged out.");
    return res.redirect("/")
}

/* ****************************************
*  Deliver logged in view
* *************************************** */
async function buildLoginHome(req, res, next, params = {}) {
    let nav = await utilities.getNav()
    res.locals.hasEmployeeAccess = utilities.checkEmployeeAccess(res.locals.accountData.account_type);
    const reviews = await reviewModel.getReviewsByAccountId(res.locals.accountData.account_id)
    res.render("account/home", {
        title: "Logged In",
        styles: ['management'],
        nav,
        reviews,
        ...params,
    })
}

/* ****************************************
*  Deliver update account view
* *************************************** */
async function buildAccountUpdate(req, res, next, params = {}) {
    let nav = await utilities.getNav()
    const account_id = res.locals.accountData.account_id;
    const data = await accountModel.getAccountById(account_id)

    res.render("account/update", {
        title: "Update Account",
        styles: ['form', 'management'],
        nav,
        ...params,
        ...data,
        account_id,
    })
}

async function updateAccount(req, res, next, params = {}) {
    const { account_firstname, account_lastname, account_email } = req.body
    const old_account_email = res.locals.accountData.account_email

    try {
        const updateResult = await accountModel.updateAccount(
            account_firstname,
            account_lastname,
            account_email,
            old_account_email,
        )

        if (updateResult) {
            req.flash("notice", `Your account has been updated`)
            res.status(200).redirect("/account/update")
        } else {
            req.flash("notice", "Sorry, the update failed.")
            res.status(500).redirect("/account/update")
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the update.')
        res.status(500).redirect("/account/update")
    }
}

async function updatePassword(req, res, next, params = {}) {
    const { account_password, account_id } = req.body

    try {
        const hashedPassword = await bcrypt.hash(account_password, 10)
        const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

        if (updateResult) {
            req.flash("notice", `Your password has been changed`)
            res.status(200).redirect("/account/update")
        } else {
            req.flash("notice", "Sorry, the password change failed.")
            res.status(500).redirect("/account/update")
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the password change.')
        res.status(500).redirect("/account/update")
    }
}


module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    buildLoginHome,
    buildAccountUpdate,
    updateAccount,
    updatePassword,
    accountLogout,
}
