const { Pool } = require("pg")
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool
if (process.env.NODE_ENV == "development") {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
        rejectUnauthorized: false,
        },
    })

    // Added for troubleshooting queries
    // during development
    module.exports = {
    async query(text, params) {
        try {
        const res = await pool.query(text, params)

        // temporary to clean up logging
        if (!text.includes("session")) {
          console.log("executed query", { text })
        }

        return res
        } catch (error) {
          console.error(`\x1b[31m error in query \x1b[0m`, { text });
          if (process.env.NODE_ENV === 'development') {
            // print error in red
            console.error('\x1b[31m', error.stack, '\x1b[0m');
          }
          throw error
        }
    },
    }
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}