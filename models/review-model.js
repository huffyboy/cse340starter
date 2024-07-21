const pool = require("../database/")

/* ***************************
 *  Get the specific review by id
 * ************************** */
async function getReviewById(review_id) {
    const query = `
        SELECT
            review_id,
            review_text,
            TO_CHAR(review_date, 'FMMonth DD, YYYY') as review_date,
            inv_id,
            account_id
        FROM public.review 
        WHERE review_id = $1;
    `;
    try {
        const data = await pool.query(query, [review_id])
        return data.rows[0]
    } catch (error) {
        console.error("getReviewsByInvId error " + error)
    }
}

/* ***************************
 *  Get all reviews by inventory id
 * ************************** */
async function getReviewsByInvId(inv_id) {
    const query = `
        SELECT
            r.review_id,
            r.review_text,
            TO_CHAR(r.review_date, 'FMMonth DD, YYYY') as review_date,
            r.inv_id,
            r.account_id,
            CONCAT(LEFT(a.account_firstname, 1), ' ', a.account_lastname) AS screen_name
        FROM public.review r
        JOIN account a ON a.account_id = r.account_id
        WHERE r.inv_id = $1
        ORDER BY r.review_date DESC;
    `;
    try {
        const data = await pool.query(query, [inv_id])
        return data.rows
    } catch (error) {
        console.error("getReviewsByInvId error " + error)
    }
}

/* ***************************
 *  Get all reviews by inventory id
 * ************************** */
async function getReviewsByAccountId(account_id) {
    const query = `
        SELECT
            r.review_id,
            r.review_text,
            TO_CHAR(r.review_date, 'FMMonth DD, YYYY') as review_date,
            r.inv_id,
            r.account_id,
            CONCAT(i.inv_year, ' ', i.inv_make, ' ', i.inv_model) AS review_item
        FROM public.review r
        JOIN inventory i ON i.inv_id = r.inv_id
        WHERE r.account_id = $1
        ORDER BY r.review_date DESC;
    `;
    try {
        const data = await pool.query(query, [account_id])
        return data.rows
    } catch (error) {
        console.error("getReviewsByAccountId error " + error)
    }
}

/* ***************************
 * Get Review
 * ************************** */
async function getReviewsById(review_id) {
    const query = `
        SELECT *
        FROM public.review
        WHERE r.inv_id = $1;
    `;
    try {
        const data = await pool.query(query, [review_id])
        return data.rows[0]
    } catch (error) {
        console.error("getReviewsById error " + error)
    }
}

async function addReview(
    review_text,
    inv_id,
    account_id,
  ) {
    try {
        const sql = `
            INSERT INTO review (
                review_text,
                inv_id,
                account_id
            ) VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [
            review_text,
            inv_id,
            account_id,
        ];
        const result = await pool.query(sql, values);
        return result.rows[0];
    } catch (error) {
        return error.message;
    }
  }

/* ***************************
 * Update Review
 * ************************** */
async function updateReview(review_id, review_text) {
    const query = `
        UPDATE public.review SET
            review_text = $2
        WHERE review_id = $1 RETURNING *;
    `;
    try {
        const data = await pool.query(query, [review_id, review_text])
        return data.rows[0]
    } catch (error) {
        console.error("updateReview error " + error)
    }
}

/* ***************************
 * Delete Review
 * ************************** */
async function deleteReview(review_id) {
    try {
        const query = `DELETE FROM public.review WHERE review_id = $1;`;
        const data = await pool.query(query, [review_id])
        return data;
    } catch (error) {
        console.error("deleteReview error " + error)
    }
}

module.exports = {
    getReviewById,
    getReviewsByInvId,
    getReviewsByAccountId,
    getReviewsById,
    addReview,
    updateReview,
    deleteReview,
};