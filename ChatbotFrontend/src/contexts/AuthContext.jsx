import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      // future: decode token se user info nikalna
      setUser({ email: localStorage.getItem("email") });
    }
  }, [token]);

  const login = (data) => {
    setToken(data.token);
    setUser({ email: data.email, name: data.name });
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
