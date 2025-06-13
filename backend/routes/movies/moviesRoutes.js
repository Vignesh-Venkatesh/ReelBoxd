import express from "express";

import {
  getPopularMovies,
  getNowShowingMovies,
  getSearchedMovies,
} from "./tmdbUtils.js";
import { getMovieInfo } from "../../db/dbUtils.js";
import authMiddleware from "../../auth/authMiddleware.js";

const router = express.Router();

// GET /movies/popular
// Gets trending/popular movies
// Query Params: page
router.get("/popular", async (req, res) => {
  let clientPage = parseInt(req.query.page) || 1;
  let tmdbPage = (clientPage - 1) * 2 + 1;
  let results = [];

  if (clientPage > 250) {
    return res
      .status(400)
      .json({ status: 400, msg: "max number of pages is limited to 250" });
  }

  for (let i = 0; i < 2; i++) {
    try {
      const response = await getPopularMovies(tmdbPage);
      results.push(...response.results);
      tmdbPage += 1;
    } catch (err) {
      res.status(500).json({ status: 500, msg: "internal server error" });
      console.error("Error fetching page:", tmdbPage, err);
    }
  }

  res
    .status(200)
    .json({ status: 200, msg: "success", data: results, maxPages: 250 });
});

// GET /movies/now-showing
// Gets now showing movies
// Query Params: page
router.get("/now-showing", async (req, res) => {
  let clientPage = parseInt(req.query.page) || 1;
  let tmdbPage = (clientPage - 1) * 2 + 1;
  let results = [];

  if (clientPage > 250) {
    return res
      .status(400)
      .json({ status: 400, msg: "max number of pages is limited to 250" });
  }

  for (let i = 0; i < 2; i++) {
    try {
      const response = await getNowShowingMovies(tmdbPage);
      results.push(...response.results);
      tmdbPage += 1;
    } catch (err) {
      res.status(500).json({ status: 500, msg: "internal server error" });
      console.error("Error fetching page:", tmdbPage, err);
    }
  }

  res
    .status(200)
    .json({ status: 200, msg: "success", data: results, maxPages: 250 });
});

// GET /movies/search
// Search movies by title
// Query Params: `?movie=Example&page=x`
router.get("/search", async (req, res) => {
  let clientPage = parseInt(req.query.page) || 1;
  const movie_name = req.query.movie;

  if (clientPage > 250) {
    return res
      .status(400)
      .json({ status: 400, msg: "max number of pages is limited to 250" });
  }

  try {
    const response = await getSearchedMovies(movie_name, clientPage);
    return res
      .status(200)
      .json({ status: 200, msg: "success", data: response.results });
  } catch (err) {
    res.status(500).json({ status: 500, msg: "internal server error" });
    console.error("Error fetching page:", tmdbPage, err);
  }
});

// GET /movies/:id
// Gets full info on a movie (title, poster, genres, year, etc.)
router.get("/:movie_id", async (req, res) => {
  const movie_id = req.params.movie_id;

  try {
    const movieInfo = await getMovieInfo(movie_id);

    // if movie is found
    if (movieInfo) {
      return res
        .status(200)
        .json({ status: 200, msg: "success", data: { ...movieInfo } });
    }

    return res.status(404).json({ status: 404, msg: "movie not found" }); // if movie is not found
  } catch (err) {
    console.error("Movie fetch error:", err);
    return res.status(500).json({ status: 500, msg: "internal server error" });
  }
});

export default router;
