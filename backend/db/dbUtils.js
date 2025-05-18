import pool from "../db/db.js";

const checkUserExists = async (username) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [
      username.trim(),
    ]);
    return result.rows.length > 0;
  } catch (err) {
    console.error("Error checking if user exists:", err);
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
  }
};

const getUserInfo = async (username) => {
  try {
    const result = await pool.query(
      `SELECT id, avatar, bio, created_at FROM users WHERE username = $1`,
      [username.trim()]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching user information", err);
  }
};

const getMovieInfo = async (tmdb_id) => {
  try {
    const result = await pool.query(`SELECT * FROM movies WHERE tmdb_id = $1`, [
      tmdb_id,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching movie information", err);
  }
};

export default { checkUserExists, getPassword, getUserInfo, getMovieInfo };
