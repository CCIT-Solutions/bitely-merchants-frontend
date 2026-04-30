"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Loading from "@/components/shared/Loading";

interface AuthGuardProps {
  children: React.ReactNode;
  requireGuest?: boolean;
  requireAuth?: boolean;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireGuest = false,
  requireAuth = false,
  redirectTo = "/",
  loadingComponent,
}) => {
  const { user, token, isLoading, isAuthenticated } = useUser();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const hasAuth = !!(user?.id && token) || isAuthenticated;

      if (requireGuest && hasAuth) {
        console.log("Authenticated user on guest page, redirecting...");
        router.replace(redirectTo);
        return;
      }

      if (requireAuth && !hasAuth) {
        console.log("Unauthenticated user on protected page, redirecting...");
        router.replace(redirectTo);
        return;
      }

      setShouldRender(true);
    }
  }, [user, token, isLoading, isAuthenticated, requireGuest, requireAuth, redirectTo, router]);

  if (isLoading || !shouldRender) {
    return <>{loadingComponent || <Loading />}</>;
  }

  return <>{children}</>;
};

export const withAuthGuard = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, "children">
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  );

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
};
