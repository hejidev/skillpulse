"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const auth = useAuth();

    useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ✅ ADD THIS
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    setUser(null);

    // optional: notify app
    window.dispatchEvent(new Event("auth-change"));
  };

  return (
    <AuthContext.Provider value={{auth, user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);