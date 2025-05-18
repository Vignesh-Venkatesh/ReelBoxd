import express from "express";
import axios from "axios";
import pool from "../../db/db.js";
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

export default router;
