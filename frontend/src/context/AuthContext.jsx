import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // actual user object
  const [authenticated, setAuthenticated] = useState(null); // null = loading, true/false = known

  useEffect(() => {
    axios
      .get("/api/v1/auth/checkAuth", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setAuthenticated(true);
      })
      .catch(() => {
        setUser(false);
        setAuthenticated(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, authenticated, setAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
