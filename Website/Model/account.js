const connection = require("./connection");

async function insertRow(parameters) {
  const sqlStatement = `INSERT INTO accounts (user_name, email, password) VALUES (?, ?, ?)`;
  const queryParameters = [parameters.user_name, parameters.email, parameters.password];

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
    // console.log('Query Results:', results); // Debugging line
    if (!results) {
      return null;
    }
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("Error in findUserByUserName:", error);
    throw error;
  }
}

async function findUserByEmail(email) {
  const sqlStatement = `SELECT * FROM accounts WHERE email = ?`;
  const queryParameters = [email];
  try {
    const [results] = await connection.query(sqlStatement, queryParameters);
    if (!results) {
      return null;
    }
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("Error in findUserByEmail:", error);
    throw error;
  }
}

async function setResetToken(id, token, expires) {
  const sqlStatement = `UPDATE accounts SET reset_token = ?, reset_token_expires = ? WHERE id = ?`;
  const queryParameters = [token, expires, id];
  try {
    const [results] = await connection.query(sqlStatement, queryParameters);
    return results;
  } catch (error) {
    console.error("Error in setResetToken:", error);
    throw error;
  }
}

async function findUserByToken(token) {
  const sqlStatement = `SELECT * FROM accounts WHERE reset_token = ?`;
  const queryParameters = [token];
  try {
    const [results] = await connection.query(sqlStatement, queryParameters);
    if (!results) {
      return null;
    }
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("Error in findUserByToken:", error);
    throw error;
  }
}

async function updatePassword(id, hashedPassword) {
  const sqlStatement = `UPDATE accounts SET password = ? WHERE id = ?`;
  const queryParameters = [hashedPassword, id];
  try {
    const [results] = await connection.query(sqlStatement, queryParameters);
    return results;
  } catch (error) {
    console.error("Error in updatePassword:", error);
    throw error;
  }
}

async function clearResetToken(id) {
  const sqlStatement = `UPDATE accounts SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?`;
  const queryParameters = [id];
  try {
    const [results] = await connection.query(sqlStatement, queryParameters);
    return results;
  } catch (error) {
    console.error("Error in clearResetToken:", error);
    throw error;
  }
}

module.exports = {
  insertRow,
  findUserByUserName,
  findUserByEmail,
  setResetToken,
  findUserByToken,
  updatePassword,
  clearResetToken,
};
