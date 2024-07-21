const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}


reviewCont.addReview = async (req, res, next, params = {}) => {
    const { review_text, inv_id, account_id } = req.body

    try {
        const addResult = await reviewModel.addReview(review_text, inv_id, account_id)

        if (addResult) {
            req.flash("notice", `Review has been added.`)
            res.status(201).redirect(`/inv/detail/${inv_id}`)
        } else {
            req.flash("notice", "Sorry, the review failed to be added.")
            res.status(500).redirect(`/inv/detail/${inv_id}`)
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error adding the review.')
        res.status(500).redirect(`/inv/detail/${inv_id}`)
    }
}


/* ***************************
 *  edit review view
 * ************************** */
reviewCont.buildEditReview = async (req, res, next, params = {}) => {
    let nav = await utilities.getNav();
    const review_id = parseInt(req.params.review_id || params.review_id);
    const data = await reviewModel.getReviewById(review_id);
    const review_text = params.review_text || data.review_text;
    const review_date = data.review_date;
    const invData = await invModel.getInventoryById(data.inv_id);

    res.render("./review/edit-review", {
        title: `Edit ${invData.inv_year} ${invData.inv_make} ${invData.inv_model} Review`,
        styles: ['form', 'management'],
        nav,
        review_id,
        review_date,
        review_text,
        ...params,
    });
}


reviewCont.updateReview  = async function (req, res) {
    const {
        review_id,
        review_text,
    } = req.body

    try {
        const updateResult = await reviewModel.updateReview(
            review_id,
            review_text,
        )

        if (updateResult) {
            req.flash("notice", `The review was successfully updated.`)
            res.redirect(`/account/`)
        } else {
            req.flash("notice", "Sorry, the review failed to be updated.")
            res.status(500).redirect(`/review/edit/${review_id}`)
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error updating the review.')
        res.status(500).redirect(`/review/edit/${review_id}`)
    }
}


reviewCont.buildDeleteConfirm = async function (req, res, next, params = {}) {
    let nav = await utilities.getNav();
    const review_id = parseInt(req.params.review_id)
    const data = await reviewModel.getReviewById(review_id)
    res.render("./review/delete-confirm", {
        title: `Delete Vehicle`,
        styles: ['form', 'management'],
        nav,
        ...data,
        ...params,
    });
};


reviewCont.deleteReview  = async function (req, res) {
    let {review_id} = req.body
    review_id = parseInt(review_id)

    try {
        const deleteResult = await reviewModel.deleteReview(review_id)

        if (deleteResult) {
            req.flash("notice", `The review was successfully deleted.`)
            res.redirect(`/account/`)
        } else {
            req.flash("notice", "Sorry, the review failed to be deleted.")
            res.status(500).redirect(`/review/${review_id}`)
        }
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error deleting the review.')
        res.status(500).redirect(`/review/${review_id}`)
    }
}


module.exports = reviewCont