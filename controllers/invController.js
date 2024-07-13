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
    const make = data.inv_make
    const model = data.inv_model
    res.render("./inventory/vehicle", {
        title: `${make} ${model}`,
        styles: ['vehicle'],
        nav,
        page,
    })
}

invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("./inventory/management", {
        title: `Management`,
        styles: ['management'],
        nav,
        classificationSelect,
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
    let nav = await utilities.getNav();
    const { classification_id, inv_image, inv_thumbnail } = req.body;

    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const imageSelect = await utilities.buildImageList(false, inv_image);
    const thumbnailSelect = await utilities.buildImageList(true, inv_thumbnail);

    res.render("./inventory/add-inventory", {
        title: `Add New Inventory`,
        styles: ['form', 'management'],
        nav,
        classificationSelect,
        imageSelect,
        thumbnailSelect,
        ...params,
    });
};

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
        req.flash("notice", 'Sorry, there was an error adding the classification.')
        res.status(500).redirect("/inv/add-classification")
    }
}

invCont.addInventory = async function (req, res) {
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        inv_miles,
        inv_color,
        inv_description,
        inv_image,
        inv_thumbnail,
    } = req.body

    try {
        const addResult = await invModel.addInventory(
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_miles,
            inv_color,
            inv_description,
            inv_image,
            inv_thumbnail,
        )

        if (addResult) {
            req.flash("notice", "Vehicle has been added.")
            res.status(201).redirect("/inv/add-inventory")
        } else {
            req.flash("notice", "Sorry, the vehicle failed to be added.")
            res.status(500).redirect("/inv/add-inventory")
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error adding the vehicle.')
        res.status(500).redirect("/inv/add-inventory")
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
}

/* ***************************
 *  edit inventory view
 * ************************** */
invCont.buildEditInventory = async (req, res, next, params = {}) => {
    let nav = await utilities.getNav();
    const inventory_id = parseInt(req.params.inventory_id)
    const data = await invModel.getInventoryById(inventory_id)

    const classification_id = params.classification_id || data.classification_id;
    const inv_image = params.inv_image || data.inv_image;
    const inv_thumbnail = params.inv_thumbnail || data.inv_thumbnail;

    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const imageSelect = await utilities.buildImageList(false, inv_image);
    const thumbnailSelect = await utilities.buildImageList(true, inv_thumbnail);

    res.render("./inventory/edit-inventory", {
        title: `Edit ${inv_make} ${inv_model}`,
        styles: ['form', 'management'],
        nav,
        classificationSelect,
        imageSelect,
        thumbnailSelect,
        ...data,
        ...params, // Override data with params if available
    });
}

invCont.updateInventory  = async function (req, res) {
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    } = req.body

    try {
        const updateResult = await invModel.updateInventory(
            inv_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id
        )

        if (updateResult) {
            const itemName = updateResult.inv_make + " " + updateResult.inv_model
            req.flash("notice", `The ${itemName} was successfully updated.`)
            res.redirect(`/inv/`)
        } else {
            req.flash("notice", "Sorry, the vehicle failed to be updated.")
            res.status(500).redirect(`/inv/edit/${inv_id}`)
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error updating the vehicle.')
        res.status(500).redirect(`/inv/edit/${inv_id}`)
    }
}

/* ***************************
 *  Building Delete Confimration View
 * ************************** */
invCont.buildDeleteConfirm = async function (req, res, next, params = {}) {
    let nav = await utilities.getNav();
    const inventory_id = parseInt(req.params.inventory_id)
    const data = await invModel.getInventoryById(inventory_id)
    res.render("./inventory/delete-confirm", {
        title: `Delete Vehicle`,
        styles: ['form', 'management'],
        nav,
        ...data,
    });
};

invCont.deleteInventory  = async function (req, res) {
    let {inv_id, inv_make, inv_model} = req.body
    inv_id = parseInt(inv_id)

    try {
        const deleteResult = await invModel.deleteInventory(inv_id)

        if (deleteResult) {
            req.flash("notice", `The ${inv_make} ${inv_model} was successfully deleted.`)
            res.redirect(`/inv/`)
        } else {
            req.flash("notice", "Sorry, the vehicle failed to be deleted.")
            res.status(500).redirect(`/inv/delete/${inv_id}`)
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error deleting the vehicle.')
        res.status(500).redirect(`/inv/delete/${inv_id}`)
    }
}

module.exports = invCont
