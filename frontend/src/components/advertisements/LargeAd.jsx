import { FaLink } from "react-icons/fa";

export default function LargeAd() {
  return (
    <a
      href="https://vigiii.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-neutral text-neutral-content hover:bg-neutral-content hover:text-neutral transition-colors duration-300 rounded-md p-4 h-[100px] w-full my-6 overflow-hidden relative"
    >
      <div className="flex justify-between items-center h-full relative z-10">
        <div className="flex flex-col justify-center">
          <span className="uppercase text-xs tracking-widest opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            Check out my portfolio
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold group-hover:underline underline-offset-4 decoration-2">
            vigiii.com
          </span>
        </div>
      </div>

      <FaLink className="absolute text-[200px] text-neutral-content opacity-10 -right-6 -bottom-10 pointer-events-none select-none z-0" />
    </a>
  );
}
