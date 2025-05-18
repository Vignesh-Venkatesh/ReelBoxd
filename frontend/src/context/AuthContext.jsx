import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = loading, false = not logged in

  useEffect(() => {
    axios
      .get("/api/v1/auth/checkAuth", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
