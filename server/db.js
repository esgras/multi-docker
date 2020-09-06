const mysql = require('mysql2');
const keys = require('./keys');

const pool = mysql.createPool({
    // connectionLimit: 5,
    host: keys.mysqlHOST,
    user: keys.mysqlUSER,
    password: keys.mysqlPASSWORD,
    port: keys.mysqlPORT,
    database: keys.mysqlDATABASE
});

module.exports = pool;