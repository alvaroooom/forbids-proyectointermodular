import { createContext, useCallback, useContext, useEffect, useState } from "react";

import {

  clearAuthSession,

  fetchCurrentUser,

  getAuthSession,

  onSessionExpired,

} from "../utils/auth";

import { disconnectRealtimeClient } from "../hooks/useProductRealtime";



const AuthContext = createContext(null);



export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);



  const logout = useCallback(() => {
    disconnectRealtimeClient();
    clearAuthSession({ notify: false });
    setCurrentUser(null);
  }, []);



  const refreshUser = async () => {

    const session = getAuthSession();

    if (!session?.token) {

      setCurrentUser(null);

      return null;

    }



    const user = await fetchCurrentUser();

    setCurrentUser(user);

    return user;

  };



  useEffect(() => {

    return onSessionExpired(() => {

      disconnectRealtimeClient();

      setCurrentUser(null);

    });

  }, []);



  useEffect(() => {

    let isMounted = true;



    const loadSession = async () => {

      const session = getAuthSession();

      if (!session?.token) {

        if (isMounted) {

          setCurrentUser(null);

          setIsLoading(false);

        }

        return;

      }



      try {

        const user = await fetchCurrentUser();

        if (isMounted) {

          setCurrentUser(user);

        }

      } catch {

        disconnectRealtimeClient();

        localStorage.removeItem("forbidsAuth");

        localStorage.removeItem("forbidsUser");

        if (isMounted) {

          setCurrentUser(null);

        }

      } finally {

        if (isMounted) {

          setIsLoading(false);

        }

      }

    };



    loadSession();



    return () => {

      isMounted = false;

    };

  }, []);



  return (

    <AuthContext.Provider

      value={{ currentUser, setCurrentUser, isLoading, refreshUser, logout }}

    >

      {children}

    </AuthContext.Provider>

  );

}



export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error("useAuth debe usarse dentro de AuthProvider");

  }

  return context;

}


