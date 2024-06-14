const connection = require('./connection');

async function findTherapistByAccountId(account_id) {
  const sqlStatement = `SELECT * FROM therapists WHERE account_id = ?`;
  const queryParameters = [account_id];

  try {
    const [results] = await connection.query(sqlStatement, queryParameters);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("Error in findTherapistByAccountId:", error);
    throw error;
  }
}

async function insertTherapist(data) {
  const sqlStatement = `INSERT INTO therapists (account_id, first_name, last_name) VALUES (?, ?, ?)`;
  const queryParameters = [data.account_id, data.first_name, data.last_name];

  try {
    const [results] = await connection.query(sqlStatement, queryParameters);
    return results;
  } catch (error) {
    console.error("Error in insertTherapist:", error);
    throw error;
  }
}

module.exports = {
  findTherapistByAccountId,
  insertTherapist
};
