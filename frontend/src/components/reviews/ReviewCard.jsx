import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function ReviewCard({
  user_id,
  username,
  avatar,
  content,
  rating,
  reviewed_at,
  like_count,
}) {
  const [validAvatar, setValidAvatar] = useState(true);
  const placeholderLetter = username ? username[0].toUpperCase() : "?";

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
    <div className="flex flex-col p-4 shadow-lg rounded-md bg-base-100">
      <div className="flex justify-between items-center mb-1">
        <div className="flex gap-2 items-center">
          {renderAvatar()}
          <span className="text-sm font-medium">{username}</span>
        </div>
        <span className="text-xs italic opacity-60">
          {new Date(reviewed_at).toDateString()}
        </span>
      </div>

      <p className="text-sm mt-1 text-base-content">{content}</p>

      <div className="flex justify-between text-sm mt-3">
        <div className="rating rating-xs">
          {[1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              type="radio"
              name={`rating-${user_id}-${reviewed_at}`}
              className="mask mask-star-2 bg-green-600"
              aria-label={`${i} star`}
              checked={i === rating}
              readOnly
            />
          ))}
        </div>
        <div className="flex gap-2 items-center text-red-500">
          <FaHeart />
          <span className="text-xs text-base-content mt-[2px]">
            {like_count}
          </span>
        </div>
      </div>
    </div>
  );
}
