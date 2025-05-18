import Navbar from "../components/Navbar";
import UserInfo from "../components/profile/UserInfo";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();
  return (
    <main>
      <Navbar></Navbar>
      <div className="w-[950px] mx-auto mt-6">
        <UserInfo username={username}></UserInfo>
      </div>
    </main>
  );
}
