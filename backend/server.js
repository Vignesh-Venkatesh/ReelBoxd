import express from "express";

// for managing sessions
import session from "express-session";

// for environment variables
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./auth/authRoutes.js";
import usersRoutes from "./routes/users/usersRoutes.js";
import moviesRoutes from "./routes/movies/moviesRoutes.js";

const app = express();

app.use(express.json()); // JSON middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60, // 1 hour
    },
  })
);

const PORT = process.env.PORT || 3000;

app.get("/api/", (req, res) => {
  res.status(200).json({ msg: "Welcome to the ReelBoxd API!" });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Users Routes
app.use("/api/users", usersRoutes);

// Movies Routes
app.use("/api/movies", moviesRoutes);

app.listen(PORT, () => {
  console.log(`ReelBoxd server running on port: ${PORT}`);
});
