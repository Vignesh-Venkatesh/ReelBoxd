import pool from "./db.js";
import bcrypt from "bcrypt";

import { getMovie } from "../routes/movies/tmdbUtils.js";

export async function addMovieInfo(tmdb_id) {
  try {
    const {
      id,
      title,
      original_title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      status,
    } = await getMovie(tmdb_id);

    const query = `
      INSERT INTO movies (
        id, title, original_title, overview, poster_path, backdrop_path, release_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
    `;

    const values = [
      id,
      title,
      original_title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      status,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}

export async function getMovieInfo(movie_id) {
  try {
    // checking if the movie exists in the database
    const checkQuery = "SELECT * FROM movies WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [movie_id]);

    if (checkResult.rows.length > 0) {
      return checkResult.rows[0]; // movie exists in DB
    }

    return await addMovieInfo(movie_id);
  } catch (err) {
    console.error("getMovieInfo error:", err);
    throw err;
  }
}

// function to get user information
export async function getUser(username) {
  const query =
    "SELECT username, bio, avatar_url, created_at FROM users WHERE username = $1";
  const values = [username];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}

// function to insert new user
export async function insertUser(username, passwordHash, bio, avatar_url) {
  const query =
    "INSERT INTO users (username, password_hash, bio, avatar_url) VALUES ($1, $2, $3, $4)";
  const values = [username, passwordHash, bio, avatar_url];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}

// fucntion to check password of the user
export async function checkPassword(username, plainTextPassword) {
  const query = "SELECT password_hash FROM users WHERE username = $1";
  const values = [username];

  try {
    const result = await pool.query(query, values);
    const storedHash = result.rows[0]?.password_hash;

    if (!storedHash) return false;

    return await bcrypt.compare(plainTextPassword, storedHash);
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}
