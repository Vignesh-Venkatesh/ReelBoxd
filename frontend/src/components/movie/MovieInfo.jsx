import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import MovieLatestReviews from "./MovieLatestReviews";
import Actions from "./Actions";

export default function MovieInfo() {
  const { tmdb_id } = useParams();
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(true);
  const [posterLoaded, setPosterLoaded] = useState(false);

  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/movie/${tmdb_id}`,
          { withCredentials: true }
        );
        setMovie(res.data);
      } catch (err) {
        console.error("Failed to fetch movie info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieInfo();
  }, [tmdb_id]);

  return (
    <div className="relative">
      {/* Backdrop image section */}
      {loading ? (
        <div className="w-screen h-[400px] skeleton"></div>
      ) : (
        <div className="relative w-screen h-[400px] overflow-hidden">
          <img
            src={
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
                : "/fallback-backdrop.jpg"
            }
            alt={movie.title}
            className="w-full h-full object-cover object-top brightness-60"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent z-10" />
        </div>
      )}

      {/* Overlapping content */}
      <div className="relative z-20 -mt-30">
        <div className="w-[950px] mx-auto">
          <div className="flex gap-10">
            {/* Poster and Actions section */}
            <div>
              {/* Poster */}
              <div className="h-[345px] w-[230px] rounded-lg overflow-hidden shadow-lg">
                {!posterLoaded && (
                  <div className="skeleton h-full w-full"></div>
                )}
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                      : "/fallback-poster.jpg"
                  }
                  alt={movie.title}
                  loading="lazy"
                  onLoad={() => setPosterLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    posterLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>

              <div className="mt-2">
                <Actions tmdb_id={tmdb_id}></Actions>
              </div>
            </div>
            {/* Title, release year, overview */}
            <div className="mt-4">
              {/* Title, release year */}
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl font-bold font-cinzel tracking-wider">
                  {movie.title}
                </h1>
                {movie.release_date && (
                  <h1 className="text-sm italic">
                    ({movie.release_date.slice(0, 4)})
                  </h1>
                )}
              </div>

              {/* Overview */}
              <div className="mt-2 text-wrap text-base-content max-w-[600px]">
                <p>{movie.overview}</p>
              </div>

              {/* Latest Reviews */}
              <MovieLatestReviews tmdb_id={tmdb_id}></MovieLatestReviews>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
