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

  const [disabled, setDisabled] = useState(false);

  const [review, setReview] = useState({});

  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");

  useState(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/v1/user/me`, {
          withCredentials: true,
        });
        setUsername(res.data.username);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWatched = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/actions/watched/${tmdb_id}`,
          {
            withCredentials: true,
          }
        );
        setWatched(res.data.watched);
      } catch (err) {
        console.error("Failed to fetch if user watched the movie", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorited = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/actions/favorite/${tmdb_id}`,
          {
            withCredentials: true,
          }
        );
        setFavorited(res.data.favorite);
      } catch (err) {
        console.error("Failed to fetch if user favorited the movie", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWatchListed = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/actions/watchlist/${tmdb_id}`,
          {
            withCredentials: true,
          }
        );
        setWatchListed(res.data.watchlisted);
      } catch (err) {
        console.error("Failed to fetch if user watchlisted the movie", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserReview = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/user/review/${tmdb_id}`,
          {
            withCredentials: true,
          }
        );
        console.log(res.data);
        setReview(res.data);
      } catch (err) {
        console.error("Failed to fetch review of the user for the movie", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchWatched();
    fetchFavorited();
    fetchWatchListed();
    fetchUserReview();
  }, [tmdb_id]);

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
    <div className="mt-4 bg-base-200 p-4 rounded-lg">
      {/* watched, favorited, watchlisted */}
      {loading ? (
        <div className="skeleton h-[100px]"></div>
      ) : (
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
              <div className="tooltip tooltip-left">
                <div className="tooltip-content ">
                  <div className="text-sm shadow">Watched</div>
                </div>
                <FaEye size={ICON_SIZE} className="text-green-500" />
              </div>
            ) : (
              <div className="tooltip tooltip-left">
                <div className="tooltip-content">
                  <div className="text-sm shadow">Not Watched</div>
                </div>
                <FaRegEye size={ICON_SIZE} />
              </div>
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
              <div className="tooltip tooltip-bottom">
                <div className="tooltip-content ">
                  <div className="text-sm shadow">Favorited</div>
                </div>
                <FaHeart size={ICON_SIZE} className="text-red-500" />
              </div>
            ) : (
              <div className="tooltip tooltip-bottom">
                <div className="tooltip-content ">
                  <div className="text-sm shadow">Not Favorited</div>
                </div>
                <FaRegHeart size={ICON_SIZE} />
              </div>
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
              <div className="tooltip tooltip-right">
                <div className="tooltip-content ">
                  <div className="text-sm shadow">Watchlisted</div>
                </div>
                <FaBookmark size={ICON_SIZE} className="text-yellow-500" />
              </div>
            ) : (
              <div className="tooltip tooltip-right">
                <div className="tooltip-content ">
                  <div className="text-sm shadow">Not Watchlisted</div>
                </div>
                <FaRegBookmark size={ICON_SIZE} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* review and add review */}
      <div className="mt-2">
        <div className="rating rating-lg flex justify-around">
          {[1, 2, 3, 4, 5].map((val) => (
            <input
              key={val}
              type="radio"
              name="rating"
              className="mask mask-star-2"
              checked={review.rating == val}
              disabled={disabled}
              onChange={() => !disabled && setRating(val)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
