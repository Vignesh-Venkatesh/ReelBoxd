export default function PosterSmall({
  id,
  title,
  image_path,
  setLoading,
  release_date,
}) {
  return (
    <div className="h-[105px] w-[75px] tooltip tooltip-secondary tooltip-bottom">
      <div className="tooltip-content text-xs  shadow-lg">
        <div className="">
          {title} ({release_date.slice(0, 4)})
        </div>
      </div>
      <img
        src={`https://image.tmdb.org/t/p/w500/${image_path}`}
        alt={title}
        loading="lazy"
        onLoad={() => setLoading(false)}
        className="w-full h-full rounded-sm border-2 border-transparent hover:border-secondary duration-300 tansition-colors cursor-pointer"
      />
    </div>
  );
}
