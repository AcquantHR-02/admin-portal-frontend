"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return sessionStorage.getItem("authToken");
}

function getServerSnapshot() {
  return null;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (token === null) {
      return;
    }

    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [token, pathname, router]);

  // Server render / hydration phase
  if (token === null) {
    return null;
  }

  // No authentication token
  if (!token) {
    return null;
  }

  // Authenticated
  return <>{children}</>;
}
