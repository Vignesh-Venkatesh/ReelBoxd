import { useState } from "react";

export default function PosterLarge({ title, image_path }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="h-[345px] w-[230px]">
      <img
        src={`https://image.tmdb.org/t/p/w500/${image_path}`}
        alt={title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full rounded transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
