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

const getUserInfoByID = async (userID) => {
  try {
    const result = await pool.query(
      `SELECT username, avatar, bio, created_at FROM users WHERE id = $1`,
      [userID]
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

const insertMovieInfo = async (
  tmdb_id,
  title,
  overview,
  poster_path,
  backdrop_path,
  release_date,
  runtime,
  movie_status
) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO movies (tmdb_id,title,overview,poster_path,backdrop_path,release_date,runtime,status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `,
      [
        tmdb_id,
        title,
        overview,
        poster_path,
        backdrop_path,
        release_date,
        runtime,
        movie_status,
      ]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error inserting movie info", err);
  }
};

// helper function to get the latest review of a particular movie
const getMovieLatestReview = async (tmdb_id, limit, offset) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        reviews.*,
        users.username,
        users.avatar,
        movies.title,
        movies.poster_path,
        movies.release_date,
        COUNT(review_likes.id) AS like_count
      FROM reviews
      JOIN movies ON reviews.tmdb_id = movies.tmdb_id
      JOIN users ON reviews.user_id = users.id
      LEFT JOIN review_likes ON reviews.id = review_likes.review_id
      WHERE reviews.tmdb_id = $1
      GROUP BY reviews.id, users.username, users.avatar, movies.title, movies.poster_path, movies.release_date
      ORDER BY reviews.reviewed_at DESC
      LIMIT $2 OFFSET $3;
      `,
      [tmdb_id, limit, offset]
    );
    return result.rows;
  } catch (err) {
    console.error(`Error fetching latest reviews of TMDB ID: ${tmdb_id}`, err);
  }
};

// helper functions to get latest reviews and the count of latest reviews for pagination
const getLatestReviews = async (limit, offset) => {
  try {
    const result = await pool.query(
      `
      SELECT
        reviews.*,
        movies.title,
        movies.poster_path,
        movies.release_date
      FROM reviews
      JOIN movies ON reviews.tmdb_id = movies.tmdb_id
      ORDER BY reviewed_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    return result.rows;
  } catch (err) {
    console.error("Error fetching latest reviews with movie info", err);
  }
};

const getTotalReviewCount = async () => {
  try {
    const result = await pool.query(`SELECT COUNT(*) FROM reviews;`);
    return parseInt(result.rows[0].count, 10);
  } catch (err) {
    console.error("Error counting reviews", err);
  }
};

// helper functions to get latest reviews (distinct ofc) and the count of latest reviews for pagination
const getUniqueLatestReviews = async (limit, offset) => {
  try {
    const result = await pool.query(
      `
      SELECT r.*, m.title, m.poster_path, m.release_date
      FROM reviews r
      JOIN movies m ON r.tmdb_id = m.tmdb_id
      INNER JOIN (
        SELECT tmdb_id, MAX(reviewed_at) AS latest_reviewed_at
        FROM reviews
        GROUP BY tmdb_id
      ) AS latest
      ON r.tmdb_id = latest.tmdb_id AND r.reviewed_at = latest.latest_reviewed_at
      ORDER BY r.reviewed_at DESC
      LIMIT $1 OFFSET $2;
      `,
      [limit, offset]
    );

    return result.rows;
  } catch (err) {
    console.error("Error fetching unique movie reviews", err);
  }
};

const getUniqueTotalReviewCount = async () => {
  try {
    const result = await pool.query(
      `SELECT COUNT(DISTINCT tmdb_id) FROM reviews;`
    );
    return parseInt(result.rows[0].count, 10);
  } catch (err) {
    console.error("Error counting unique movies", err);
  }
};

// helper functions to get popular reviews and the count of latest reviews for pagination
const getPopularReviews = async (limit, offset, thisWeek = false) => {
  const baseQuery = `
    SELECT r.*, m.title, m.poster_path, m.release_date, COUNT(rl.id) AS like_count
    FROM reviews r
    JOIN movies m ON r.tmdb_id = m.tmdb_id
    LEFT JOIN review_likes rl ON r.id = rl.review_id
    ${thisWeek ? `WHERE r.reviewed_at >= NOW() - INTERVAL '7 days'` : ""}
    GROUP BY r.id, m.title, m.poster_path, m.release_date
    ORDER BY like_count DESC
    LIMIT $1 OFFSET $2;
  `;
  const result = await pool.query(baseQuery, [limit, offset]);
  return result.rows;
};

const getPopularReviewCount = async (thisWeek = false) => {
  const countQuery = `
    SELECT COUNT(*) FROM reviews
    ${thisWeek ? `WHERE reviewed_at >= NOW() - INTERVAL '7 days'` : ""};
  `;
  const result = await pool.query(countQuery);
  return parseInt(result.rows[0].count, 10);
};

export default {
  checkUserExists,
  getPassword,
  getUserInfo,
  getUserInfoByID,
  getMovieInfo,
  insertMovieInfo,
  getMovieLatestReview,
  getLatestReviews,
  getTotalReviewCount,
  getUniqueLatestReviews,
  getUniqueTotalReviewCount,
  getPopularReviews,
  getPopularReviewCount,
};
