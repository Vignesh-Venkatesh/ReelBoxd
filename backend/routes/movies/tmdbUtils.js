import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export async function getMovie(movie_id) {
  const url = `${BASE_URL}/movie/${movie_id}?language=en-US`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        accept: "application/json",
        Authorization: `${API_KEY}`,
      },
    });

    // destructuring the necessary fields only
    const {
      id,
      title,
      original_title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      status,
    } = data;

    return {
      id,
      title,
      original_title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      status,
    };
  } catch (error) {
    console.error(
      "Error fetching movie:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch movie from TMDb");
  }
}
