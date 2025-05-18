import express from "express";
import axios from "axios";
import pool from "../../db/db.js";
import dbUtils from "../../db/dbUtils.js";

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Fetches movie from TMDB and caches it in DB
export const cacheMovieFromTMDB = async (tmdb_id) => {
  const url = `https://api.themoviedb.org/3/movie/${tmdb_id}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });

    const {
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      runtime,
      status,
    } = data;

    const inserted = await dbUtils.insertMovieInfo(
      tmdb_id,
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      runtime,
      status
    );

    return await dbUtils.getMovieInfo(tmdb_id);
  } catch (err) {
    console.error(
      "Error fetching from TMDB:",
      err.response?.data || err.message
    );
    throw new Error("TMDB fetch failed");
  }
};

// GET /api/v1/movie/:tmdb_id
// Returns cached movie or fetches from TMDB

router.get("/:tmdb_id", async (req, res) => {
  const { tmdb_id } = req.params;

  try {
    let movie = await dbUtils.getMovieInfo(tmdb_id);

    if (!movie) {
      movie = await cacheMovieFromTMDB(tmdb_id);
    }

    res.status(200).json({ movie });
  } catch (err) {
    console.error("Error in GET /movie/:tmdb_id:", err.message);
    res.status(500).json({ error: "Failed to retrieve movie info." });
  }
});

export default router;
