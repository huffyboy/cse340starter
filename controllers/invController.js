const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()

    let className = ''
    if (data.length > 0) {
        className = data[0].classification_name
    } else {
        const classification = await invModel.getClassificationNameById(classification_id);
        className = classification[0].classification_name
    }

    res.render("./inventory/classification", {
        title: className + " vehicles",
        styles: ['inventory'],
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryById(inventory_id)
    const page = await utilities.buildVehiclePage(data)
    let nav = await utilities.getNav()
    const make = data[0].inv_make
    const model = data[0].inv_model
    res.render("./inventory/vehicle", {
        title: `${make} ${model}`,
        styles: ['vehicle'],
        nav,
        page,
    })
}

invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: `Management`,
        styles: ['management'],
        nav,
    })
}

invCont.buildAddClassification = async function (req, res, next, params = {}) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: `Add New Classification`,
        styles: ['form', 'management'],
        nav,
        ...params,
    })
}

invCont.buildAddInventory = async function (req, res, next, params = {}) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
        title: `Add New Inventory`,
        styles: ['form', 'management'],
        nav,
        ...params,
    })
}

invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body

    try {
        const addResult = await invModel.addClassification(classification_name)

        if (addResult) {
            req.flash("notice", `${classification_name} has been added.`)
            res.status(201).redirect("/inv/add-classification")
        } else {
            req.flash("notice", "Sorry, the classification failed to be added.")
            res.status(501).redirect("/inv/add-classification")
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).redirect("/inv/register")
    }
}

module.exports = invCont
