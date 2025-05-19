import { useState } from "react";
import MovieInfo from "../components/movie/MovieInfo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Movie() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <MovieInfo />
      </main>
      <Footer />
    </div>
  );
}
