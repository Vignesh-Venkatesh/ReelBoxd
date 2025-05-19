import { useState, useEffect } from "react";

import axios from "axios";
import PosterSmall from "../posters/PosterSmall";
import Review from "../Review";

export default function PopularReviews() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularReviewsThisWeekk = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/movies/popular-reviews?page=1&this-week=true`,
          { withCredentials: true }
        );

        setMovies(res.data.reviews); // setting results
      } catch (err) {
        console.error("Failed to fetch popular reviews this week", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularReviewsThisWeekk();
  }, []);

  return (
    <div>
      <main>
        {/* top title bar */}
        <div className="flex justify-between opacity-70">
          <h1 className="text-md uppercase font-bold">
            Popular reviews this week
          </h1>
          <h1 className="text-sm cursor-pointer hover:text-accent">more</h1>
        </div>
        {/* divider */}
        <hr className="opacity-20" />

        {/* movie list */}
        <div className="mt-2">
          {loading ? (
            <div className="space-y-2">
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
              <div className="skeleton h-[105px] rounded-md"></div>
            </div>
          ) : (
            <div className="">
              {movies.map((movie, idx) => (
                <Review
                  key={idx}
                  tmdb_id={movie.tmdb_id}
                  title={movie.title}
                  image_path={movie.poster_path}
                  release_date={movie.release_date}
                  setLoading={setLoading}
                  content={movie.content}
                  rating={movie.rating}
                  reviewed_at={movie.reviewed_at}
                  like_count={movie.like_count}
                  user_id={movie.user_id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
