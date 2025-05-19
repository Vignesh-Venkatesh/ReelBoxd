import Navbar from "../components/Navbar";
import UserInfo from "../components/profile/UserInfo";
import Footer from "../components/Footer";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>
      <main className="flex-grow">
        <div className="w-[950px] mx-auto mt-6">
          <UserInfo username={username}></UserInfo>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}
