import express from "express";
import axios from "axios";
import pool from "../../db/db.js";
import dbUtils from "../../db/dbUtils.js";

const router = express.Router();

// POST /api/v1/actions/watched/:tmdb_id
// adding to watched table
router.post("/watched/:tmdb_id", async (req, res) => {
  const username = req.session.user.username;
  const tmdb_id = req.params.tmdb_id;

  try {
    const watched = await dbUtils.insertWatched(username, tmdb_id);
    res.status(201).json({ message: "Movie marked as watched", watched });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark movie as watched" });
  }
});

// DELETE /api/v1/actions/watched/:tmdb_id
// removes from watched table
router.delete("/watched/:tmdb_id", async (req, res) => {
  const username = req.session.user.username;
  const tmdb_id = req.params.tmdb_id;

  try {
    await dbUtils.deleteWatched(username, tmdb_id);
    res.status(200).json({ message: "Movie unmarked as watched" });
  } catch (err) {
    console.error("Failed to unmark movie as watched", err);
    res.status(500).json({ error: "Failed to unmark movie as watched" });
  }
});

// GET /api/v1/actions/watched?username
// getting all watched movies for the user
router.get("/watched", async (req, res) => {
  const username = req.query.username;

  try {
    if (username) {
      const watchedMovies = await dbUtils.getWatchedMovies(username);
      const countWatchedMovies = await dbUtils.countWatchedMovies(username);
      res.status(200).json({ countWatchedMovies, watchedMovies });
    } else {
      res.status(500).json({ error: "Failed to fetch watched movies" });
    }
  } catch (err) {
    console.error("Error fetching watched movies", err);
    res.status(500).json({ error: "Failed to fetch watched movies" });
  }
});

// GET /api/v1/actions/watched/:tmdb_id
// checking if a movie is marked as watched
router.get("/watched/:tmdb_id", async (req, res) => {
  const username = req.session.user.username;
  const tmdb_id = req.params.tmdb_id;

  try {
    const isWatched = await dbUtils.isMovieWatched(username, tmdb_id);
    res.status(200).json({ watched: isWatched });
  } catch (err) {
    console.error("Error checking if movie is watched", err);
    res.status(500).json({ error: "Failed to check watched status" });
  }
});

// POST /api/v1/actions/favorite/:tmdb_id
// adding to favorites table
router.post("/favorite/:tmdb_id", async (req, res) => {
  const username = req.session.user.username;
  const tmdb_id = req.params.tmdb_id;

  try {
    const favorite = await dbUtils.insertFavorite(username, tmdb_id);
    res.status(201).json({ message: "Movie marked as favorite", favorite });
  } catch (err) {
    console.error("Failed to mark movie as favorite", err);
    res.status(500).json({ error: "Failed to mark movie as favorite" });
  }
});

// DELETE /api/v1/actions/favorite/:tmdb_id
// removes from favorites table
router.delete("/favorite/:tmdb_id", async (req, res) => {
  const username = req.session.user.username;
  const tmdb_id = req.params.tmdb_id;

  try {
    await dbUtils.deleteFavorite(username, tmdb_id);
    res.status(200).json({ message: "Movie unmarked as favorite" });
  } catch (err) {
    console.error("Failed to unmark movie as favorite", err);
    res.status(500).json({ error: "Failed to unmark movie as favorite" });
  }
});

// GET /api/v1/actions/favorite?username
// getting all favorite movies for the user
router.get("/favorite", async (req, res) => {
  const username = req.query.username;

  try {
    if (username) {
      const favoriteMovies = await dbUtils.getFavoriteMovies(username);
      res.status(200).json(favoriteMovies);
    } else {
      res.status(400).json({ error: "Username is required" });
    }
  } catch (err) {
    console.error("Error fetching favorite movies", err);
    res.status(500).json({ error: "Failed to fetch favorite movies" });
  }
});

// GET /api/v1/actions/favorite/:tmdb_id
// checking if a movie is marked as favorite
router.get("/favorite/:tmdb_id", async (req, res) => {
  const username = req.session.user.username;
  const tmdb_id = req.params.tmdb_id;

  try {
    const isFavorite = await dbUtils.isMovieFavorited(username, tmdb_id);
    res.status(200).json({ favorite: isFavorite });
  } catch (err) {
    console.error("Error checking if movie is favorite", err);
    res.status(500).json({ error: "Failed to check favorite status" });
  }
});

// POST /api/v1/actions/watchlist/:tmdb_id
// adding a movie to user's watchlist
router.post("/watchlist/:tmdb_id", async (req, res) => {
  const username = req.session.user.username;
  const tmdb_id = req.params.tmdb_id;

  try {
    const added = await dbUtils.insertWatchlist(username, tmdb_id);
    res.status(201).json({ message: "Movie added to watchlist", added });
  } catch (err) {
    console.error("Failed to add to watchlist", err);
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
});

// DELETE /api/v1/actions/watchlist/:tmdb_id
// removing a movie from watchlist
router.delete("/watchlist/:tmdb_id", async (req, res) => {
  const username = req.session.user.username;
  const tmdb_id = req.params.tmdb_id;

  try {
    await dbUtils.deleteWatchlist(username, tmdb_id);
    res.status(200).json({ message: "Movie removed from watchlist" });
  } catch (err) {
    console.error("Failed to remove from watchlist", err);
    res.status(500).json({ error: "Failed to remove from watchlist" });
  }
});

// GET /api/v1/actions/watchlist?username
// getting all movies in a user's watchlist
router.get("/watchlist", async (req, res) => {
  const username = req.query.username;

  try {
    if (username) {
      const movies = await dbUtils.getWatchlistMovies(username);
      res.status(200).json(movies);
    } else {
      res.status(400).json({ error: "Username is required" });
    }
  } catch (err) {
    console.error("Error fetching watchlist", err);
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

// GET /api/v1/actions/watchlist/:tmdb_id
// checking if a movie is in the watchlist
router.get("/watchlist/:tmdb_id", async (req, res) => {
  const username = req.session.user.username;
  const tmdb_id = req.params.tmdb_id;

  try {
    const isWatchlisted = await dbUtils.isMovieWatchlisted(username, tmdb_id);
    res.status(200).json({ watchlisted: isWatchlisted });
  } catch (err) {
    console.error("Error checking watchlist status", err);
    res.status(500).json({ error: "Failed to check watchlist status" });
  }
});

export default router;
