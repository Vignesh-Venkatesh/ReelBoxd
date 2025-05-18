import axios from "axios";
import { useState, useEffect } from "react";
import PosterLarge from "../posters/PosterLarge";

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/movies/popular`,
          { withCredentials: true }
        );
        setMovies(res.data.results); // setting results
      } catch (err) {
        console.error("Failed to fetch popular movies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div className="w-[950px] mx-auto mt-6">
      <main>
        {/* top title bar */}
        <div className="flex justify-between opacity-70">
          <h1 className="text-md uppercase font-bold">Popular Movies</h1>
          <h1 className="text-sm cursor-pointer hover:text-accent">more</h1>
        </div>

        {/* divider */}
        <hr className="opacity-20" />

        {/* movie list */}
        <div className="mt-2">
          {loading ? (
            <div className="flex justify-between">
              <div className="skeleton h-[345px] w-[230px]"></div>
              <div className="skeleton h-[345px] w-[230px]"></div>
              <div className="skeleton h-[345px] w-[230px]"></div>
              <div className="skeleton h-[345px] w-[230px]"></div>
            </div>
          ) : (
            <div className="flex justify-between">
              {movies.slice(0, 4).map((movie, idx) => (
                <PosterLarge
                  key={idx}
                  id={movie.id}
                  title={movie.title}
                  image_path={movie.poster_path}
                  release_date={movie.release_date}
                  setLoading={setLoading}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
