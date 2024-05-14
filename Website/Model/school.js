const connection = require("./connection");

async function getAllSchools(){
    const sqlStatement = "SELECT * FROM schools";

    return await connection.query(sqlStatement);
}

module.exports = {
    getAllSchools
}