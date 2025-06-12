import express from "express";

import { getUser } from "../../db/dbUtils.js";
import authMiddleware from "../../auth/authMiddleware.js";

const router = express.Router();

// GET /users/:username
// Gets public profile of the user
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const userInfo = await getUser(username);

    if (userInfo) {
      return res
        .status(200)
        .json({ status: 200, msg: "success", data: { ...userInfo } });
    }

    return res
      .status(404)
      .json({ status: 404, msg: `user (${username}) not found` });
  } catch (err) {
    console.error("User fetch error:", err);
    return res.status(500).json({ status: 500, msg: "internal server error" });
  }
});

export default router;
