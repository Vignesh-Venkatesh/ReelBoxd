export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300 mt-12">
      <div className="max-w-[950px] mx-auto px-4 py-6 flex justify-between items-center text-sm text-base-content opacity-70 font-poppins">
        {/* Left Side - reelboxd stuff */}
        <div>
          <h1 className="font-bold text-lg tracking-wide">
            Reel<span className="text-secondary">Boxd</span>
          </h1>
          <p className="text-xs mt-1">Favorite. WatchList. Review.</p>
        </div>

        {/* Right Side - links */}
        <div className="flex flex-col gap-2">
          <a
            href="https://github.com/Vignesh-Venkatesh/ReelBoxd"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition"
          >
            Project Repository
          </a>
        </div>
      </div>
    </footer>
  );
}
