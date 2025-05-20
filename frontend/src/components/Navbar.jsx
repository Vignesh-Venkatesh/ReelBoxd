import { FaMoon, FaSun, FaSearch } from "react-icons/fa";

import axios from "axios";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Toast from "./Toast";

export default function Navbar() {
  const [error, setError] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [validAvatar, setValidAvatar] = useState(true);

  const navigate = useNavigate(); // for redirecting
  const { setUser } = useAuth(); // context

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/user/me", {
          withCredentials: true,
        });
        setUserInfo(res.data);
        setValidAvatar(true); // reset valid avatar on reload
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setError(false);
      await axios.post(
        "http://localhost:5000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );

      setUser(false);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      setError(true);
    }
  };

  // helperfunction for avatar or fallback
  const renderUserAvatar = () => {
    const initial = userInfo.username ? userInfo.username[0].toUpperCase() : "";

    if (userInfo.avatar && validAvatar) {
      return (
        <div className="avatar w-8 h-8">
          <div className="rounded-full">
            <img
              src={userInfo.avatar}
              alt="User Avatar"
              onError={() => setValidAvatar(false)}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="avatar avatar-placeholder w-8 h-8">
        <div className="bg-neutral text-neutral-content rounded-full">
          <span className="text-md">{initial}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-base-200 p-6 font-jetbrainsmono relative shadow-lg z-100">
      {/* toast only shown if there is an error logging out */}
      {error && (
        <Toast
          message="Error trying to logout"
          type="error"
          duration={3000}
          onClose={() => setError(false)}
        />
      )}

      {/* navbar content */}
      <div className="w-[1000px] mx-auto flex justify-between items-end">
        {/* left - title */}
        <Link to={"/films"}>
          <h1 className="font-black text-3xl opacity-90">
            Reel<span className="text-secondary">Boxd</span>
          </h1>
        </Link>

        {/* right - theme toggle + logout */}
        <div className="space-x-2 flex items-center">
          {/* home button */}
          <Link to={"/films"}>
            <button className="btn btn-sm btn-ghost">Home</button>
          </Link>

          {/* search box */}
          <label className="input input-sm">
            <FaSearch className="opacity-50" />
            <input type="search" required placeholder="Search Film" />
          </label>

          {/* divider */}
          <div className="divider divider-horizontal"></div>

          {/* theme toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <FaMoon size={15} />
            <input
              type="checkbox"
              className="toggle theme-controller"
              value="winter"
            />
            <FaSun size={18} />
          </label>

          {/* user dropdown - contains logout, profile, settings */}
          <details className="dropdown">
            <summary className="btn w-10 h-10 ml-2 flex items-center justify-center rounded-full hover:bg-neutral hover:text-accent hover:border-transparent">
              {renderUserAvatar()}
            </summary>

            <ul className="menu dropdown-content bg-base-200 space-y-1 rounded-sm z-1 w-30 shadow-sm">
              {/* home button */}
              <Link to={"/films"}>
                <li>
                  <button className="btn btn-sm btn-ghost">Home</button>
                </li>
              </Link>
              <Link to={`/user/${userInfo.username}`}>
                <li>
                  <button className="btn btn-sm btn-ghost">My Profile</button>
                </li>
              </Link>
              <Link to={`/user/${userInfo.username}/watched`}>
                <li>
                  <button className="btn btn-sm btn-ghost">Watched</button>
                </li>
              </Link>
              <li>
                {/* logout button */}
                <button
                  className="btn btn-soft btn-error btn-sm rounded-md"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
