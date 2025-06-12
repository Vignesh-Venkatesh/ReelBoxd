import express from "express";
import bcrypt from "bcrypt";

import { getUser, insertUser, checkPassword } from "../db/dbUtils.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

// POST /auth/register
// Registering a new user (username, password, avatar, bio)
router.post("/register", async (req, res) => {
  const { username, password, avatar, bio } = req.body;

  // username and password required
  if (!username || !password) {
    return res
      .status(400)
      .json({ status: 400, msg: "username and password are required" });
  }

  try {
    const existingUser = await getUser(username);

    // if user already exists, then we send 400 status code
    if (existingUser) {
      return res
        .status(400)
        .json({ status: 400, msg: `user (${username}) already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashing password

    await insertUser(username, hashedPassword, bio, avatar);

    // user registration successful
    res
      .status(201)
      .json({ status: 200, msg: `user (${username}) registered successfully` });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ status: 500, msg: "internal server error" });
  }
});

// POST /auth/login
// Logs in user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ status: 400, msg: "username and password are required" });
  }

  try {
    const existingUser = await getUser(username);

    if (!existingUser) {
      return res
        .status(404)
        .json({ status: 404, msg: `user (${username}) doesn't exist` });
    }

    const passwordCorrect = await checkPassword(username, password);

    if (passwordCorrect) {
      req.session.user = { username }; // storing username in session
      return res.status(200).json({
        status: 200,
        msg: `user (${username}) logged in successfully`,
      });
    }

    return res
      .status(401)
      .json({ status: 401, msg: "incorrect username or password" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: 500, msg: "internal server error" });
  }
});

// POST /auth/logout
// Logs out user
router.post("/logout", authMiddleware, async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ status: 500, msg: "failed to log out" });
    }
    res.clearCookie("connect.sid");
    return res
      .status(200)
      .json({ status: 200, msg: "logged out successfully" });
  });
});

// GET /auth/me
// Returns the current authenticated user
router.get("/me", authMiddleware, async (req, res) => {
  const user = req.session.user.username;
  const userInfo = await getUser(user);

  return res
    .status(200)
    .json({ status: 200, msg: "success", data: { ...userInfo } });
});

export default router;
