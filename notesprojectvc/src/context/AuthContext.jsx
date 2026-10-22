"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getToken, setToken as saveToken, removeToken, apiClient } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient("/api/me", { token });
        if (response?.data) {
          setUser(response.data);
        } else {
          removeToken();
        }
      } catch (error) {
        removeToken();
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      removeToken();
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = async (username, password) => {
    const response = await apiClient("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (response?.data?.token) {
      saveToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    }
    throw new Error("Login gagal");
  };

  const logout = async () => {
    try {
      await apiClient("/api/logout", { method: "POST" });
    } catch (err) {
    } finally {
      removeToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
