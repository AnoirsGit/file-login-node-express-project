const mysql = require('mysql2');
require('dotenv').config();

const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_DATABASE
const port = process.env.DB_PORT

const pool = mysql.createPool({
    host, user, password, database, port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }

            connection.query(query, params, (queryErr, results) => {
                connection.release();

                if (queryErr) {
                    return reject(queryErr);
                }

                resolve(results);
            });
        });
    });
}

module.exports = { pool, executeQuery };
