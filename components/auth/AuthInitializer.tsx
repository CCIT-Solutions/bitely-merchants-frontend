"use client";
import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useUserStore((state) => state.initialize);

  useEffect(() => {
    initialize();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (e.newValue) {
          useUserStore.setState({ token: e.newValue });
        } else {
          useUserStore.getState().logout();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initialize]);

  return <>{children}</>;
}