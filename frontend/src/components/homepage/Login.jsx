import { useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../../context/AuthContext";

export default function Login({ setLogin }) {
  const { setUser } = useAuth(); // use context

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError(false);
      await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { username, password },
        { withCredentials: true }
      );

      // Fetch user info after login
      const res = await axios.get(
        "http://localhost:5000/api/v1/auth/checkAuth",
        {
          withCredentials: true,
        }
      );
      setUser(res.data.user);

      navigate("/films");
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="bg-base-200 min-h-screen flex items-center justify-center font-poppins">
      <div className="bg-base-100 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-primary mb-6">Login</h1>

        {/* login form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            {error ? (
              <div role="alert" className="alert alert-error alert-soft mb-4 ">
                <span>Incorrect Username or Password</span>
              </div>
            ) : (
              <></>
            )}
            <label className="label">
              <span className="label-text text-sm">Username</span>
            </label>
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <button className="btn btn-primary w-full mt-4">Log In</button>
          <h1 className="text-center" onClick={() => setLogin(false)}>
            Don't have an account?{" "}
            <span className="hover:underline cursor-pointer font-bold hover:text-secondary">
              Sign Up
            </span>
          </h1>
        </form>
      </div>
    </div>
  );
}
