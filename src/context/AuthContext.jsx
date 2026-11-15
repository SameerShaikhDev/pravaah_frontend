import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import authService from "../services/auth.service";
import { setAccessToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const res = await authService.getMe();
        const freshUser = res.data.user;
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      } catch {
        setAccessToken(null);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    }
    bootstrap();
  }, []);

  function persistSession({ user: nextUser, accessToken }) {
    setAccessToken(accessToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  }

  async function login(credentials) {
    const res = await authService.login(credentials);
    persistSession(res.data);
    return res.data.user;
  }

  async function register(payload) {
    const res = await authService.register(payload);
    return res.data.user;
  }

  async function logout() {
    try {
      await authService.logout();
    } catch {
      /* ignore network errors on logout */
    } finally {
      setAccessToken(null);
      localStorage.removeItem("user");
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      isTpo: user?.role === "tpo",
      isBootstrapping,
      login,
      register,
      logout,
      setUser: (u) => {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      },
    }),
    [user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
