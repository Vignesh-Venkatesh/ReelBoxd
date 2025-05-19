import { useState, useEffect } from "react";
import axios from "axios";

import ReviewCard from "../reviews/ReviewCard";

export default function MovieLatestReviews({ tmdb_id }) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/movie/${tmdb_id}/latest-reviews`,
          { withCredentials: true }
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch movie reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tmdb_id]);

  return (
    <div className="mt-10">
      <div className="flex justify-between opacity-70 mb-2">
        <h1 className="text-md uppercase font-bold">Latest Reviews</h1>
        <h1 className="text-sm cursor-pointer hover:text-accent">more</h1>
      </div>
      <hr className="opacity-20 mb-2" />

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-[100px] skeleton"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {reviews.length === 0 ? (
            <div className="text-sm text-base-content opacity-70">
              No reviews yet.
            </div>
          ) : (
            reviews
              .slice(0, 5)
              .map((review) => <ReviewCard key={review.id} {...review} />)
          )}
        </div>
      )}
    </div>
  );
}
