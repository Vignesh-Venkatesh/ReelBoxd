import { useParams } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";
import UserInfo from "./UserInfo";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserWatched() {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);

  const { username } = useParams();

  useEffect(() => {
    const fetchWatched = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/actions/watched?username=${username}`,
          { withCredentials: true }
        );
        setWatched(res.data.watchedMovies);
      } catch (err) {
        console.error("Failed to fetch watched movies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatched();
  }, [username]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow w-[950px] mx-auto">
        <UserInfo username={username} />

        {/* top title bar */}
        <div className="flex justify-between opacity-70 mt-6">
          <h1 className="text-md uppercase font-bold">Watched Films</h1>
        </div>

        {/* divider */}
        <hr className="opacity-20 mb-4" />

        {loading ? (
          <div className="space-y-2 mt-2">
            <div className="skeleton h-[100px] w-full" />
          </div>
        ) : watched.length > 0 ? (
          <div className="grid grid-cols-12 gap-1">
            {watched.map((movie) => {
              return (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  key={movie.tmdb_id}
                  className="rounded-sm border-2 border-transparent hover:border-secondary transition-colors duration-300"
                />
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-base-content">No watched films yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
