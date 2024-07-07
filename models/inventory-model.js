const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getClassificationNameById(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification WHERE classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassificationById(classification_id){
  try {
    const sql = "SELECT * FROM classification WHERE classification_id = $1"
    const classification = await pool.query(sql, [classification_id])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

async function addClassification(classification_name) {
  try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
  } catch (error) {
      return error.message
  }
}

async function addInventory(
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
) {
  try {
      const sql = `
        INSERT INTO inventory (
          classification_id, 
          inv_make, 
          inv_model, 
          inv_year, 
          inv_price, 
          inv_miles, 
          inv_color, 
          inv_description, 
          inv_image, 
          inv_thumbnail
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;
      const values = [
        classification_id, 
        inv_make, 
        inv_model, 
        inv_year, 
        inv_price, 
        inv_miles, 
        inv_color, 
        inv_description, 
        inv_image, 
        inv_thumbnail
      ];
      const result = await pool.query(sql, values);
      return result.rows[0];
  } catch (error) {
      return error.message;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  checkExistingClassification,
  addClassification,
  getClassificationNameById,
  checkExistingClassificationById,
  addInventory,
};
