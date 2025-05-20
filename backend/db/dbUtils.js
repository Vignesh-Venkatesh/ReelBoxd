import pool from "../db/db.js";

// checking if a particular user exists
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

// getting the password of the user
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

// getting information about the user by username
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

// getting information about the user by userID
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

// getting information about a particular movie
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

// inserting a movie
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

// inserting a new record into the watched table
const insertWatched = async (username, tmdb_id) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO watched (user_id, tmdb_id)
      SELECT id, $2 FROM users WHERE username = $1;
      `,
      [username, tmdb_id]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error inserting into watched table", err);
    throw err;
  }
};

// getting all watched movies for a user
const getWatchedMovies = async (username) => {
  const query = `
    SELECT m.*
    FROM watched w
    JOIN users u ON w.user_id = u.id
    JOIN movies m ON w.tmdb_id = m.tmdb_id
    WHERE u.username = $1
    ORDER BY w.watched_at DESC;
  `;

  const result = await pool.query(query, [username]);
  return result.rows;
};

// counting all watched movies for a user
const countWatchedMovies = async (username) => {
  const query = `
    SELECT COUNT(*) AS count
    FROM watched w
    JOIN users u ON w.user_id = u.id
    WHERE u.username = $1;
  `;

  const result = await pool.query(query, [username]);
  return parseInt(result.rows[0].count);
};

// checking if a specific movie is watched by a user
const isMovieWatched = async (username, tmdb_id) => {
  const query = `
    SELECT 1
    FROM watched w
    JOIN users u ON w.user_id = u.id
    WHERE u.username = $1 AND w.tmdb_id = $2
    LIMIT 1;
  `;

  const result = await pool.query(query, [username, tmdb_id]);
  return result.rowCount > 0;
};

// deleting a record from watched table
const deleteWatched = async (username, tmdb_id) => {
  const query = `
    DELETE FROM watched
    WHERE user_id = (SELECT id FROM users WHERE username = $1)
    AND tmdb_id = $2;
  `;

  await pool.query(query, [username, tmdb_id]);
};

// adding to favorites
const insertFavorite = async (username, tmdb_id) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO favorites (user_id, tmdb_id)
      SELECT id, $2 FROM users WHERE username = $1
      RETURNING *;
      `,
      [username, tmdb_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error inserting into favorites table", err);
    throw err;
  }
};

// removing from favorites
const deleteFavorite = async (username, tmdb_id) => {
  try {
    await pool.query(
      `
      DELETE FROM favorites
      WHERE user_id = (SELECT id FROM users WHERE username = $1)
      AND tmdb_id = $2;
      `,
      [username, tmdb_id]
    );
  } catch (err) {
    console.error("Error deleting from favorites table", err);
    throw err;
  }
};

// getting all favorite movies
const getFavoriteMovies = async (username) => {
  try {
    const result = await pool.query(
      `
      SELECT m.*
      FROM favorites f
      JOIN users u ON f.user_id = u.id
      JOIN movies m ON f.tmdb_id = m.tmdb_id
      WHERE u.username = $1
      ORDER BY f.favorited_at DESC;
      `,
      [username]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching favorite movies", err);
    throw err;
  }
};

// checking if movie is favorited
const isMovieFavorited = async (username, tmdb_id) => {
  try {
    const result = await pool.query(
      `
      SELECT 1 FROM favorites
      WHERE user_id = (SELECT id FROM users WHERE username = $1)
      AND tmdb_id = $2;
      `,
      [username, tmdb_id]
    );
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error checking if movie is favorited", err);
    throw err;
  }
};

// adding to watchlist
const insertWatchlist = async (username, tmdb_id) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO watchlist (user_id, tmdb_id)
      SELECT id, $2 FROM users WHERE username = $1
      RETURNING *;
      `,
      [username, tmdb_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error inserting into watchlist table", err);
    throw err;
  }
};

// removing from watchlist
const deleteWatchlist = async (username, tmdb_id) => {
  try {
    await pool.query(
      `
      DELETE FROM watchlist
      WHERE user_id = (SELECT id FROM users WHERE username = $1)
      AND tmdb_id = $2;
      `,
      [username, tmdb_id]
    );
  } catch (err) {
    console.error("Error deleting from watchlist table", err);
    throw err;
  }
};

// getting all watchlist movies
const getWatchlistMovies = async (username) => {
  try {
    const result = await pool.query(
      `
      SELECT m.*
      FROM watchlist w
      JOIN users u ON w.user_id = u.id
      JOIN movies m ON w.tmdb_id = m.tmdb_id
      WHERE u.username = $1
      ORDER BY w.watchlisted_at DESC;
      `,
      [username]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching watchlist movies", err);
    throw err;
  }
};

// checking if movie is watchlisted
const isMovieWatchlisted = async (username, tmdb_id) => {
  try {
    const result = await pool.query(
      `
      SELECT 1 FROM watchlist
      WHERE user_id = (SELECT id FROM users WHERE username = $1)
      AND tmdb_id = $2;
      `,
      [username, tmdb_id]
    );
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error checking if movie is watchlisted", err);
    throw err;
  }
};

// getting user review for particular movie
const getUserReviewForMovie = async (username, tmdb_id) => {
  try {
    const result = await pool.query(
      `
      SELECT r.*, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE u.username = $1 AND r.tmdb_id = $2;
      `,
      [username, tmdb_id]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching user review for movie", err);
    throw err;
  }
};

// inserting rating for a particular movie by a user
const insertMovieRatingByUser = async (username, tmdb_id, rating) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO reviews (user_id, tmdb_id, rating)
      VALUES ((SELECT id FROM users WHERE username = $1), $2, $3)
      RETURNING *;
      `,
      [username, tmdb_id, rating]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error inserting review rating", err);
  }
};

// insert review content for a particular movie by a user
const insertMovieReviewContentByUser = async (username, tmdb_id, content) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO reviews (user_id, tmdb_id, content)
      VALUES ((SELECT id FROM users WHERE username = $1), $2, $3)
      RETURNING *;
      `,
      [username, tmdb_id, content]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating review content", err);
  }
};

// update rating for a particular movie by a user
const updateMovieRatingByUser = async (username, tmdb_id, rating) => {
  try {
    const result = await pool.query(
      `UPDATE reviews
       SET rating = $3,
       reviewed_at = CURRENT_TIMESTAMP
       WHERE user_id = (SELECT id FROM users WHERE username = $1)
       AND tmdb_id = $2
        RETURNING *;
      `,
      [username, tmdb_id, rating]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating review rating", err);
  }
};

// update review content for a particular movie by a user
const updateMovieReviewContentByUser = async (username, tmdb_id, content) => {
  try {
    const result = await pool.query(
      `UPDATE reviews
       SET content = $3,
       reviewed_at = CURRENT_TIMESTAMP
       WHERE user_id = (SELECT id FROM users WHERE username = $1)
       AND tmdb_id = $2
        RETURNING *;
      `,
      [username, tmdb_id, content]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating review content", err);
  }
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
  insertWatched,
  getWatchedMovies,
  countWatchedMovies,
  isMovieWatched,
  deleteWatched,
  insertFavorite,
  deleteFavorite,
  getFavoriteMovies,
  isMovieFavorited,
  insertWatchlist,
  deleteWatchlist,
  getWatchlistMovies,
  isMovieWatchlisted,
  getUserReviewForMovie,
  insertMovieRatingByUser,
  insertMovieReviewContentByUser,
  updateMovieRatingByUser,
  updateMovieReviewContentByUser,
};
