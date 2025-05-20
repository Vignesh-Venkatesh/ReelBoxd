import { useState, useEffect } from "react";
import {
  FaRegEye,
  FaEye,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa6";
import axios from "axios";

export default function Actions({ tmdb_id }) {
  const [watched, setWatched] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [watchlisted, setWatchListed] = useState(false);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);

        const [watchedRes, favRes, watchlistRes, reviewRes] = await Promise.all(
          [
            axios.get(
              `http://localhost:5000/api/v1/actions/watched/${tmdb_id}`,
              { withCredentials: true }
            ),
            axios.get(
              `http://localhost:5000/api/v1/actions/favorite/${tmdb_id}`,
              { withCredentials: true }
            ),
            axios.get(
              `http://localhost:5000/api/v1/actions/watchlist/${tmdb_id}`,
              { withCredentials: true }
            ),
            axios.get(`http://localhost:5000/api/v1/user/review/${tmdb_id}`, {
              withCredentials: true,
            }),
          ]
        );

        setWatched(watchedRes.data.watched);
        setFavorited(favRes.data.favorite);
        setWatchListed(watchlistRes.data.watchlisted);
        setRating(reviewRes.data.rating || null);
        setLoading(false);
      } catch (err) {
        console.error("Error loading actions:", err);
        setLoading(true);
      }
    };

    fetchActions();
  }, [tmdb_id]);

  const updateRating = async (val) => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/user/review/${tmdb_id}`,
        { rating: val },
        { withCredentials: true }
      );
      setRating(val);
    } catch (err) {
      console.error("Failed to update rating", err);
    }
  };

  const handleWatched = async () => {
    try {
      if (watched) {
        // if it's already watched, we remove it
        const res = await axios.delete(
          `http://localhost:5000/api/v1/actions/watched/${tmdb_id}`,
          { withCredentials: true }
        );
        setWatched(false);
      } else {
        // if it's not watched, we add it
        const res = await axios.post(
          `http://localhost:5000/api/v1/actions/watched/${tmdb_id}`,
          {},
          { withCredentials: true }
        );
        setWatched(true);
      }
    } catch (err) {
      console.error("Error updating watched status:", err);
    }
  };

  const handleFavorited = async () => {
    try {
      if (favorited) {
        // if it's already favorited, we remove it
        const res = await axios.delete(
          `http://localhost:5000/api/v1/actions/favorite/${tmdb_id}`,
          { withCredentials: true }
        );
        setFavorited(false);
      } else {
        // if it's not favorited, we add it
        const res = await axios.post(
          `http://localhost:5000/api/v1/actions/favorite/${tmdb_id}`,
          {},
          { withCredentials: true }
        );
        setFavorited(true);
      }
    } catch (err) {
      console.error("Error updating favorited status:", err);
    }
  };

  const handleWatchListed = async () => {
    try {
      if (watchlisted) {
        // if it's already watchlisted, we remove it
        const res = await axios.delete(
          `http://localhost:5000/api/v1/actions/watchlist/${tmdb_id}`,
          { withCredentials: true }
        );
        setWatchListed(false);
      } else {
        // if it's not watchlisted, we add it
        const res = await axios.post(
          `http://localhost:5000/api/v1/actions/watchlist/${tmdb_id}`,
          {},
          { withCredentials: true }
        );
        setWatchListed(true);
      }
    } catch (err) {
      console.error("Error updating watchlisted status:", err);
    }
  };

  const ICON_SIZE = 24;

  return (
    <div className="mt-4 bg-base-200 p-4 rounded-lg shadow-md">
      {loading ? (
        <div className="skeleton h-[100px]" />
      ) : (
        <>
          <div className="flex justify-around">
            {/* watched */}
            <div
              className="cursor-pointer"
              onClick={() => {
                handleWatched(watched);
                setWatched(!watched);
              }}
            >
              {watched ? (
                <FaEye size={ICON_SIZE} className="text-green-600" />
              ) : (
                <FaRegEye size={ICON_SIZE} />
              )}
            </div>

            {/* favorited */}
            <div
              className="cursor-pointer"
              onClick={() => {
                handleFavorited(favorited);
                setFavorited(!favorited);
              }}
            >
              {favorited ? (
                <FaHeart size={ICON_SIZE} className="text-red-600" />
              ) : (
                <FaRegHeart size={ICON_SIZE} />
              )}
            </div>

            {/* watchlisted */}
            <div
              className="cursor-pointer"
              onClick={() => {
                handleWatchListed(watchlisted);
                setWatchListed(!watchlisted);
              }}
            >
              {watchlisted ? (
                <FaBookmark size={ICON_SIZE} className="text-yellow-500" />
              ) : (
                <FaRegBookmark size={ICON_SIZE} />
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="mt-4 ">
            {watched ? (
              <div className="rating rating-md flex justify-around">
                {[1, 2, 3, 4, 5].map((val) => (
                  <input
                    key={val}
                    type="radio"
                    name="rating"
                    className="mask mask-star-2 bg-secondary"
                    checked={rating === val}
                    disabled={!watched}
                    onChange={() => watched && updateRating(val)}
                  />
                ))}
              </div>
            ) : (
              <div className="tooltip tooltip-bottom w-full">
                <div className="tooltip-content">
                  <div className="">
                    Mark as{" "}
                    <span className="text-secondary font-bold">watched</span> to
                    rate!
                  </div>
                </div>

                <div className="rating rating-md flex justify-around ">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <input
                      key={val}
                      type="radio"
                      name="rating"
                      className="mask mask-star-2 bg-secondary"
                      checked={rating === val}
                      disabled={!watched}
                      onChange={() => watched && updateRating(val)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
