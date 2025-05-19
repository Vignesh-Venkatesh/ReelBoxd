import { useState, useEffect } from "react";

import axios from "axios";
import PosterSmall from "../posters/PosterSmall";

export default function JustReviewed() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJustReviewedMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/movies/latest-reviews`,
          { withCredentials: true }
        );

        setMovies(res.data.reviews); // setting results
      } catch (err) {
        console.error("Failed to fetch just reviewed movies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJustReviewedMovies();
  }, []);

  return (
    <div>
      <main>
        {/* top title bar */}
        <div className="flex justify-between opacity-70">
          <h1 className="text-md uppercase font-bold">Just Reviewed</h1>
          <h1 className="text-sm cursor-pointer hover:text-accent">more</h1>
        </div>

        {/* divider */}
        <hr className="opacity-20" />

        {/* movie list */}
        <div className="mt-2">
          {loading ? (
            <div className="grid grid-cols-12 place-items-center">
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
              <div className="skeleton h-[105px] w-[70px] rounded-md"></div>
            </div>
          ) : (
            <div className="grid grid-cols-12 place-items-center">
              {movies.map((movie, idx) => (
                <PosterSmall
                  key={idx}
                  id={movie.tmdb_id}
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
