import Login from "../components/homepage/Login";

import { useState } from "react";
import SignUp from "../components/homepage/SignUp";

export default function Home() {
  const [login, setLogin] = useState(true); // to check if user wants to signup or login

  return (
    <div className="flex min-h-screen">
      {/* First (left) Section - about filmboxd */}
      <div className="w-6/10 shadow-md">Homepage</div>

      {/* Second (right) Section - login/signup form */}
      <div className="w-4/10">
        {login ? (
          <Login setLogin={setLogin}></Login>
        ) : (
          <SignUp setLogin={setLogin}></SignUp>
        )}
      </div>
    </div>
  );
}
