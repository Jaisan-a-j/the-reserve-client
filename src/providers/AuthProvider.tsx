import { useEffect, useState } from "react";

import { AuthContext, type UserType } from "../context/AuthContext";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ) => {
    const data = await registerUser({
      fullName,
      email,
      password,
    });

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const data = await loginUser({
      email,
      password,
    });

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) return;

      try {
        const userData = await getCurrentUser(token);

        setUser(userData);
      } catch (error) {
        console.error(error);

        logout();
      }
    };

    verifyUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
