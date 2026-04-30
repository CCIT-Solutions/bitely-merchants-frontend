import { useRouter } from "next/navigation";
import { useUser } from "./useUser";
import { useEffect, useState } from "react";

export const useAuthGuard = (options: {
  requireGuest?: boolean;
  requireAuth?: boolean;
  redirectTo?: string;
}) => {
  const { user, token, isLoading, isAuthenticated } = useUser()
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const hasAuth = !!(user?.id && token) || isAuthenticated;

      if (options.requireGuest && hasAuth) {
        router.replace(options.redirectTo || "/");
        setIsAllowed(false);
        return;
      }

      if (options.requireAuth && !hasAuth) {
        router.replace(options.redirectTo || "/login");
        setIsAllowed(false);
        return;
      }

      setIsAllowed(true);
    }
  }, [user, token, isLoading, isAuthenticated, options, router]);

  return { isAllowed, isLoading, isAuthenticated, user, token };
};