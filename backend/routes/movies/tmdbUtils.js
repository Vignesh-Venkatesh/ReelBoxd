import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export async function getSearchedMovies(movie, page = 1) {
  const url = `${BASE_URL}/search/movie?page=${page}&query=${movie}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        accept: "application/json",
        Authorization: `${API_KEY}`,
      },
    });

    return data;
  } catch (error) {
    console.error(
      "Error fetching searched movies:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch searched movies from TMDb");
  }
}

export async function getPopularMovies(page) {
  const url = `${BASE_URL}/movie/popular?page=${page}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        accept: "application/json",
        Authorization: `${API_KEY}`,
      },
    });

    return data;
  } catch (error) {
    console.error(
      "Error fetching popular movies:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch popular movies from TMDb");
  }
}

export async function getNowShowingMovies(page) {
  const url = `${BASE_URL}/movie/now_playing?page=${page}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        accept: "application/json",
        Authorization: `${API_KEY}`,
      },
    });

    return data;
  } catch (error) {
    console.error(
      "Error fetching now showing movies:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch now showing movies from TMDb");
  }
}

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
