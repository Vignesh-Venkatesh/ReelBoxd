import PosterSmall from "./posters/PosterSmall";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

export default function Review({
  tmdb_id,
  title,
  image_path,
  release_date,
  setLoading,
  content,
  rating,
  reviewed_at,
  like_count,
  user_id,
}) {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [validAvatar, setValidAvatar] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/user/info?userid=${user_id}`,
          { withCredentials: true }
        );
        setAvatar(res.data.avatar || "");
        setUsername(res.data.username || "");
      } catch (err) {
        console.error("Error fetching user info", err);
      }
    };

    fetchAvatar();
  }, [user_id]);

  const placeholderLetter = username ? username[0].toUpperCase() : "";

  const renderAvatar = () => {
    if (avatar && validAvatar) {
      return (
        <div className="avatar w-5 h-5">
          <div className="rounded-full">
            <img
              src={avatar}
              alt={`${username}'s avatar`}
              onError={() => setValidAvatar(false)}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="avatar avatar-placeholder w-5 h-5">
        <div className="bg-neutral text-neutral-content rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">{placeholderLetter}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-2 p-2 shadow-lg rounded-md my-4">
      <div>
        <PosterSmall
          id={tmdb_id}
          title={title}
          image_path={image_path}
          release_date={release_date}
          setLoading={setLoading}
        />
      </div>

      <div className="flex flex-col w-full">
        <div className="flex">
          <h1 className="flex gap-2 items-baseline text-lg font-black text-primary opacity-80">
            {title}
            <span className="italic text-xs font-normal">
              ({release_date.slice(0, 4)})
            </span>
          </h1>
          <div className="divider divider-horizontal"></div>
          <div className="flex gap-2 items-center">
            {renderAvatar()}
            <h1 className="text-sm">{username}</h1>
          </div>
        </div>

        <p className="text-xs italic">{new Date(reviewed_at).toDateString()}</p>

        <p className="text-sm mt-2">{content}</p>

        <div className="flex justify-between text-sm mt-3">
          <div className="rating rating-xs">
            {[1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                type="radio"
                name={`rating-${Math.random()}`} // prevent clashing in lists
                className="mask mask-star-2 bg-green-600"
                aria-label={`${i} star`}
                checked={i === rating}
                readOnly
              />
            ))}
          </div>
          <div className="flex gap-2 items-center text-red-500">
            <FaHeart className="" />
            {/* <span className="text-xs text-base-content mt-[2px]">
            {like_count} {like_count == 1 ? "like" : "likes"}
            </span> */}
            <span className="text-xs text-base-content mt-[2px]">
              {like_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
