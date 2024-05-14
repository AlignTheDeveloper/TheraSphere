const mysql = require("mysql2/promise");

let connection = null;

async function query(sql, params){
    if(connection === null){
        connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: " root",
        password: "",
        database: "tx2day",
        });
    }
    sql = mysql.format(sql, params);
    const [results] = await connection.execute(sql, params);
    return results;
}

module.exports = {
    query
}