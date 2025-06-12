import express from "express";

import { getMovieInfo } from "../../db/dbUtils.js";
import authMiddleware from "../../auth/authMiddleware.js";

const router = express.Router();

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
