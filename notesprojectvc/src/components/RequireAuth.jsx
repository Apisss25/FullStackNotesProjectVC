"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Skeleton from "@/components/ui/Skeleton";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <div className="py-10">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="mt-4 h-5 w-96 max-w-full" />
        <Skeleton className="mt-8 h-48 w-full" />
      </div>
    );
  }

  return children;
}
