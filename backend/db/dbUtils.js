import pool from "../db/db.js";

const checkUserExists = async (username) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [
      username.trim(),
    ]);
    return result.rows.length > 0;
  } catch (err) {
    console.error("Error checking if user exists:", err);
    throw err;
  }
};

const getPassword = async (username) => {
  try {
    const result = await pool.query(
      `SELECT password_hash FROM users WHERE username = $1`,
      [username.trim()]
    );
    return result.rows[0]?.password_hash || null;
  } catch (err) {
    console.error("Error fetching password hash:", err);
    throw err;
  }
};

export default { checkUserExists, getPassword };
