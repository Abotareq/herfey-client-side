"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/auth/verify`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok && data.loggedIn && data.user) {
          // Save decoded user data and token into user state
          setUser({
            ...data.user, // Decoded JWT data from server
            token: data.token, // Include raw token if needed
          });
          console.log("User data fetched:", data.user, "Token:", data.token);
        } else {
          console.log("No user data or invalid response:", data);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching auth status:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
