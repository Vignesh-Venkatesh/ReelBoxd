import Navbar from "../components/Navbar";
import PopularMovies from "../components/films/PopularMovies";
import LargeAd from "../components/advertisements/LargeAd";
import JustReviewed from "../components/films/JustReviewed";
import PopularReviews from "../components/films/PopularReviews";
import Footer from "../components/Footer";

export default function Films() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="w-[950px] mx-auto flex-grow">
        {/* popular movies */}
        <PopularMovies></PopularMovies>
        {/* large ad */}
        <LargeAd></LargeAd>
        {/* just reviewed films */}
        <JustReviewed></JustReviewed>

        {/* popular reviews this week and top reviewers this week */}
        <div className="mt-6">
          {/* popular reviews this week */}
          <div className="w-6/10">
            <PopularReviews></PopularReviews>
          </div>

          {/* divider */}
          <div className="w-1/10"></div>

          {/* top reviewers this week */}
          <div className="w-3/10"></div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}
