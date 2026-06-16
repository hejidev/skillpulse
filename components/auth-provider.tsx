"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  setUser: (
    user: User | null
  ) => void;

  setToken: (
    token: string | null
  ) => void;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,

    setUser: () => {},

    setToken: () => {},

    logout: () => {},
  });

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const syncAuth = () => {
      try {
        const storedToken =
          localStorage.getItem(
            "token"
          );

        const storedUser =
          localStorage.getItem(
            "user"
          );

        console.log(
          "TOKEN:",
          storedToken
        );

        console.log(
          "USER:",
          storedUser
        );

        if (
          !storedToken ||
          !storedUser
        ) {
          setUser(null);
          setToken(null);
          setLoading(false);
          return;
        }

        setToken(storedToken);

        setUser(
          JSON.parse(storedUser)
        );
      } catch (error) {
        console.log(
          "AUTH ERROR:",
          error
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "role"
        );

        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    syncAuth();

    window.addEventListener(
      "auth-change",
      syncAuth
    );

    return () => {
      window.removeEventListener(
        "auth-change",
        syncAuth
      );
    };
  }, []);

  const logout = () => {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );

  localStorage.removeItem(
    "role"
  );

  setUser(null);

  setToken(null);

  window.dispatchEvent(
    new Event("auth-change")
  );
};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setUser,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext =
  () => useContext(AuthContext);