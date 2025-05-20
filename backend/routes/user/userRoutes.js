import pool from "../../db/db.js";
import express from "express";
import dbUtils from "../../db/dbUtils.js";

const router = express.Router();

// GET /api/v1/user/info
// get information about the user
router.get("/info", async (req, res) => {
  const username = req.query.username;
  const userid = parseInt(req.query.userid);

  try {
    if (username) {
      const userInfo = await dbUtils.getUserInfo(username);
      const { id, avatar, bio, created_at } = userInfo;
      res.status(200).json({ id, username, avatar, bio, created_at });
    } else {
      const userInfo = await dbUtils.getUserInfoByID(userid);
      const { username, avatar, bio, created_at } = userInfo;
      res.status(200).json({ userid, username, avatar, bio, created_at });
    }
  } catch (err) {
    console.error("User info fetch error", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// GET /api/v1/user/me
// getting information about current user in session
router.get("/me", async (req, res) => {
  try {
    const user = req.session.user;
    res.status(200).json(user);
  } catch (err) {
    console.error("Self fetch error", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// GET /api/v1/user/review/:tmdb_id
// Get a review by the logged-in user for a specific movie
router.get("/review/:tmdb_id", async (req, res) => {
  try {
    const user = req.session.user;
    const tmdb_id = parseInt(req.params.tmdb_id, 10);

    const review = await dbUtils.getUserReviewForMovie(user.username, tmdb_id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(review);
  } catch (err) {
    console.error("Error fetching review", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

export default router;
