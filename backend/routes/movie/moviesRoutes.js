import express from "express";
import axios from "axios";
import pool from "../../db/db.js";
import dbUtils from "../../db/dbUtils.js";
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// GET /api/v1/movies/popular?page=1
router.get("/popular", async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;

  try {
    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });

    const movies = response.data.results.map((movie) => ({
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      popularity: movie.popularity,
    }));

    res.status(200).json({
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
      results: movies,
    });
  } catch (err) {
    console.error(
      "Error fetching popular movies:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to fetch popular movies." });
  }
});

// GET /api/v1/movies/popular-reviews?page=1&this-week=true
router.get("/popular-reviews", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;
  const thisWeek = req.query["this-week"] === "true";

  try {
    let reviews, totalCount;

    [reviews, totalCount] = await Promise.all([
      dbUtils.getPopularReviews(limit, offset, thisWeek),
      dbUtils.getPopularReviewCount(thisWeek),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      reviews,
    });
  } catch (err) {
    console.error("Error fetching popular reviews", err);
    res.status(500).json({ error: "Failed to fetch popular reviews." });
  }
});

// GET /api/v1/movies/latest-reviews?page=1&all=true
router.get("/latest-reviews", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;
  const getAll = req.query.all === "true";

  try {
    let reviews, totalCount;

    if (getAll) {
      [reviews, totalCount] = await Promise.all([
        dbUtils.getLatestReviews(limit, offset),
        dbUtils.getTotalReviewCount(),
      ]);
    } else {
      [reviews, totalCount] = await Promise.all([
        dbUtils.getUniqueLatestReviews(limit, offset),
        dbUtils.getUniqueTotalReviewCount(),
      ]);
    }

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      reviews,
    });
  } catch (err) {
    console.error("Error fetching paginated reviews", err);
    res.status(500).json({ error: "Failed to fetch latest reviews." });
  }
});

export default router;
