import { Link } from "react-router-dom";

export default function PosterLarge({
  id,
  title,
  image_path,
  setLoading,
  release_date,
}) {
  return (
    <Link to={`/movie/${id}`}>
      <div className="h-[345px] w-[230px] tooltip tooltip-bottom tooltip-secondary">
        <div className="tooltip-content text-xs shadow-lg">
          <div className="">
            {title} ({release_date.slice(0, 4)})
          </div>
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w500/${image_path}`}
          alt={title}
          loading="lazy"
          onLoad={() => setLoading(false)}
          className="w-full h-full rounded-lg border-4 border-transparent hover:border-secondary duration-300 tansition-colors cursor-pointer"
        />
      </div>
    </Link>
  );
}
