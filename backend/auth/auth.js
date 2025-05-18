import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/db.js";

import dbUtils from "../db/dbUtils.js";

const router = express.Router();

// Signing up new user
// POST /api/v1/auth/signup
router.post("/signup", async (req, res) => {
  const { username, password, avatar = "", bio = "" } = req.body;

  const BIO_LENGTH = 200;
  if (bio.length > BIO_LENGTH) {
    return res
      .status(400)
      .json({ error: "Bio length exceeded 200 characters." });
  }

  // checking if username was submitted
  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  // checking if password was submitted
  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  // checking if user already exists
  const existingUser = await dbUtils.checkUserExists(username);
  if (existingUser) {
    return res.status(400).json({ error: "Username is already taken." });
  }

  try {
    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `
        INSERT INTO users (username, password_hash, avatar, bio)
        VALUES ($1, $2, $3, $4)
        `,
      [username.trim(), hashedPassword, avatar, bio]
    );

    req.session.user = { username: username, avatar: avatar, bio: bio };

    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    console.error("SignUp Error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Logging in existing user
// POST /api/v1/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // checking if user already exists
  const existingUser = await dbUtils.checkUserExists(username);
  if (!existingUser) {
    return res.status(401).json({ error: "User does not exist." });
  }

  try {
    // getting password from database
    const dbResult = await pool.query(
      `SELECT password_hash, avatar, bio FROM users WHERE username = $1`,
      [username.trim()]
    );

    const user = dbResult.rows[0];

    // hashing the password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      req.session.user = {
        username: username,
        avatar: user.avatar,
        bio: user.bio,
      };
      res.status(200).json({ msg: "Login Successful." });
    } else {
      res.status(401).json({ error: "Invalid Credentials." });
    }
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Logging out user
// POST /api/v1/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }

    // clear session cookie on client
    res.clearCookie("connect.sid");
    res.sendStatus(200);
  });
});

// GET /api/v1/auth/checkAuth
router.get("/checkAuth", (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ user: req.session.user });
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
