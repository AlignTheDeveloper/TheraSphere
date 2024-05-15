const connection = require("./connection");

async function insertRow(parameters) {
  const sqlStatement = `INSERT INTO accounts (user_name, password) VALUES (?, ?)`;
  const queryParameters = [parameters.user_name, parameters.password];

  try {
    const [results] = await connection.query(sqlStatement, queryParameters);
    return results;
  } catch (error) {
    console.error("Error in insertRow:", error);
    throw error;
  }
}

async function findUserByUserName(user_name) {
  const sqlStatement = `SELECT * FROM accounts WHERE user_name = ?`;
  const queryParameters = [user_name];

  try {
    const [results] = await connection.query(sqlStatement, queryParameters);
    console.log('Query Results:', results); // Debugging line
    if (!results) {
      return null;
    }
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("Error in findUserByUserName:", error);
    throw error;
  }
}

module.exports = {
  insertRow,
  findUserByUserName,
};
