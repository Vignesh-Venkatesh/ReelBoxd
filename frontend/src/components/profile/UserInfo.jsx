import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserInfo({ username }) {
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [watchedCount, setWatchedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/user/info?username=${username}`,
          { withCredentials: true }
        );
        setAvatar(res.data.avatar);
        setBio(res.data.bio);
        setCreatedAt(new Date(res.data.created_at).toLocaleDateString());
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };

    const fetchWatched = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/actions/watched?username=${username}`,
          { withCredentials: true }
        );
        setWatchedCount(res.data.countWatchedMovies);
      } catch (err) {
        console.error("Failed to fetch watched movies", err);
      }
    };

    Promise.all([fetchUserInfo(), fetchWatched()]).finally(() =>
      setLoading(false)
    );
  }, [username, navigate]);

  const placeholderLetter = username ? username[0].toUpperCase() : "";

  if (loading) {
    return (
      <div className="w-full flex justify-between items-center mt-6">
        <div className="flex space-x-3 items-center">
          <div className="skeleton w-16 h-16 rounded-full"></div>
          <div>
            <div className="skeleton h-4 w-24 mb-2"></div>
            <div className="skeleton h-3 w-32"></div>
          </div>
        </div>
        <div className="flex space-x-6">
          <div className="skeleton h-15 w-15"></div>
          <div className="skeleton h-15 w-15"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mt-6">
        {/* avatar, username and member since */}
        <div className="flex space-x-3 items-center">
          <div className="avatar avatar-placeholder">
            {avatar ? (
              <div className="w-16 h-16 rounded-full shadow-lg">
                <img src={avatar} alt={`${username}'s avatar`} />
              </div>
            ) : (
              <div className="w-16 h-16 shadow-lg rounded-full bg-neutral text-neutral-content justify-center flex items-center">
                <span className="text-4xl font-bold">{placeholderLetter}</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold">{username}</h1>
            <p className="text-sm opacity-60">Member since {createdAt}</p>
          </div>
        </div>

        {/* number of films watched and number of reviews */}
        <div className="flex space-x-3 items-center">
          <div className="stats">
            <div className="stat place-items-center">
              <div className="stat-value text-3xl">{watchedCount}</div>
              <div className="stat-desc">Films Watched</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-value text-3xl">3</div>
              <div className="stat-desc">Films Reviewed</div>
            </div>
          </div>
        </div>
      </div>

      {bio ? (
        <div className="mt-2 bg-neutral text-neutral-content p-2 text-center italic rounded-sm shadow-md">
          “{bio}”
        </div>
      ) : null}
    </div>
  );
}
