import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../../context/AuthContext";

export default function SignUp({ setLogin }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [validAvatar, setValidAvatar] = useState(true);

  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      await axios.post(
        "http://localhost:5000/api/v1/auth/signup",
        { username, password, bio, avatar },
        { withCredentials: true }
      );

      const res = await axios.get(
        "http://localhost:5000/api/v1/auth/checkAuth",
        { withCredentials: true }
      );

      setUser(res.data.user);
      navigate("/films");
    } catch (err) {
      console.error(err);
      setError("User already exists. Try logging in.");
    }
  };

  const renderAvatar = () => {
    const initial = username ? username[0].toUpperCase() : "";

    if (avatar && validAvatar) {
      return (
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img
              src={avatar}
              alt="Avatar Preview"
              onError={() => setValidAvatar(false)}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="avatar avatar-placeholder">
        <div className="bg-neutral text-neutral-content w-12 rounded-full">
          <span className="text-xl">{initial}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-base-200 min-h-screen flex items-center justify-center font-poppins">
      <div className="bg-base-100 p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Header with Avatar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Sign Up</h1>
          {renderAvatar()}
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
          {error && (
            <div
              role="alert"
              className="alert alert-error alert-soft mb-4 rounded-md font-semibold"
            >
              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="label">
              <span className="label-text text-sm">Username</span>
            </label>
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text text-sm">Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label">
              <span className="label-text text-sm">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered w-full"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="label">
              <span className="label-text text-sm">Bio (optional)</span>
            </label>
            <textarea
              maxLength={200}
              placeholder="Tell us about yourself"
              className="textarea textarea-bordered w-full"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="text-xs text-right mt-1">{bio.length}/200</p>
          </div>

          {/* Avatar URL */}
          <div>
            <label className="label">
              <span className="label-text text-sm">Avatar URL (optional)</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              value={avatar}
              onChange={(e) => {
                setAvatar(e.target.value);
                setValidAvatar(true); // reset on new input
              }}
            />
          </div>

          <button className="btn btn-primary w-full mt-4">
            Create Account
          </button>

          <h1 className="text-center" onClick={() => setLogin(true)}>
            Already have an account?{" "}
            <span className="hover:underline cursor-pointer font-bold hover:text-secondary">
              Login
            </span>
          </h1>
        </form>
      </div>
    </div>
  );
}
