import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";

export const useUser = () => {
  const [hydrated, setHydrated] = useState(false);

  const {
    user,
    token,
    isAuthenticated,
    login,
    register,
    setUser,
    updateUser,
    logout,
    isLoading,
    initialize,
  } = useUserStore();

  useEffect(() => {
    setHydrated(true);
    if (!user && !token) {
      initialize();
    }
  }, [user, token, initialize]);

  return {
    user: hydrated ? user : null,
    token: hydrated ? token : null,
    isAuthenticated: hydrated ? isAuthenticated : false,
    isLoading: hydrated ? isLoading : true,
    login,
    register,
    setUser,
    updateUser,
    logout,
  };
};