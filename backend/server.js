import { config } from "dotenv";
config(); // loading the .env file

import express from "express";
import session from "express-session";

import cors from "cors";

import auth from "./auth/auth.js";
import requireAuth from "./auth/authMiddleware.js";

import user from "./routes/user/userRoutes.js";

import movie from "./routes/movie/movieRoutes.js";

import movies from "./routes/movie/moviesRoutes.js";

import action from "./routes/actions/actionRoutes.js";

const app = express();

// JSON middleware
app.use(express.json());

// express session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
      httpOnly: true,
      secure: false, // true if using HTTPS in production
      sameSite: "lax",
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ReelBoxd server listening on PORT: ${PORT}`);
});

app.get("/api/v1/", (req, res) => {
  res
    .status(200)
    .json({ msg: "Welcome to ReelBoxd! This is the ReelBoxd API." });
});

// ============================================
// Auth routes
app.use("/api/v1/auth", auth);
// ============================================

// ============================================
// User routes
app.use("/api/v1/user", requireAuth, user);
// ============================================

// ============================================
// Movie routes
app.use("/api/v1/movie", requireAuth, movie);
// ============================================

// ============================================
// Movies routes
app.use("/api/v1/movies", requireAuth, movies);
// ============================================

// ============================================
// Action routes
app.use("/api/v1/actions", requireAuth, action);
// ============================================
