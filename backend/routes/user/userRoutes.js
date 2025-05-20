import pool from "../../db/db.js";
import express from "express";
import dbUtils from "../../db/dbUtils.js";

const router = express.Router();

// GET /api/v1/user/info
// get information about the user
router.get("/info", async (req, res) => {
  const username = req.query.username;
  const userid = req.query.userid;

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

// GET /api/v1/user/review/:tmdb_id?username
// Get a review by a user for a specific movie
router.get("/review/:tmdb_id", async (req, res) => {
  try {
    const username = req.query.username;
    const tmdb_id = req.params.tmdb_id;

    let review = await dbUtils.getUserReviewForMovie(username, tmdb_id);

    if (!review) {
      review = {};
    }
    res.status(200).json({ review });
  } catch (err) {
    console.error("Error fetching review", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// PUT /api/v1/user/review/:tmdb_id
// Update a review by the logged-in user for a specific movie
router.put("/review/:tmdb_id", async (req, res) => {
  try {
    const user = req.session.user;
    const tmdb_id = req.params.tmdb_id;
    const { rating, content } = req.body;

    if (rating) {
      const updateRating = await dbUtils.updateMovieRatingByUser(
        user.username,
        tmdb_id,
        rating
      );
      if (!updateRating) {
        const insertRating = await dbUtils.insertMovieRatingByUser(
          user.username,
          tmdb_id,
          rating
        );

        if (!insertRating) {
          return res.status(404).json({ error: "Error updating review" });
        }
      }
    }

    if (content) {
      const updateContent = await dbUtils.updateMovieReviewContentByUser(
        user.username,
        tmdb_id,
        content
      );

      if (!updateContent) {
        const insertContent = await dbUtils.insertMovieReviewContentByUser(
          user.username,
          tmdb_id,
          content
        );

        if (!insertContent) {
          return res.status(404).json({ error: "Error updating review" });
        }
      }
    }

    res.status(200).json({ message: "Review updated successfully" });
  } catch (err) {
    console.error("Error updating review", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
