const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return new Error("Unable to create account")
  }
}

/* *****************************
*   Update account
* *************************** */
async function updateAccount(account_firstname, account_lastname, account_email, old_account_email){
  try {
      const sql = `
        UPDATE account
        SET account_firstname = $1,
            account_lastname = $2,
            account_email = $3
        WHERE account_email = $4
        RETURNING *;`;
      
      const result = await pool.query(sql, [account_firstname, account_lastname, account_email, old_account_email])
      
      if (result.rowCount === 0) {
        throw new Error("No account was updated. Please check the provided email.")
      }
      
      return result
  } catch (error) {
    throw new Error("Unable to update account: " + error.message)
  }
}

/* *****************************
*   Update account password
* *************************** */
async function updatePassword(account_id, account_password){
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *;`;
    
    const result = await pool.query(sql, [account_password, account_id]);
    
    if (result.rowCount === 0) {
      throw new Error("No password was updated. Please check the provided account ID.");
    }
    
    return result;
  } catch (error) {
    throw new Error("Unable to update password: " + error.message);
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return new Error("Unable to check for existing account")
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using id
* ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id]
    );
    
    if (result.rowCount === 0) {
      throw new Error("No matching account found. Please check the provided account ID.");
    }

    return result.rows[0];
  } catch (error) {
    throw new Error("Unable to retrieve account: " + error.message);
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
};