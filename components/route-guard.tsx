"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hrefToKey } from "@/lib/nav-links";

// Renders nothing. On mount it checks the nav config and, if the current
// route has been turned off in /admin, redirects to "/". Placed alongside
// page content so enabled pages render immediately with no blank flash.
export const RouteGuard = ({ route }: { route: string }) => {
  const router = useRouter();

  useEffect(() => {
    const key = hrefToKey(route);
    if (!key) return;

    let cancelled = false;
    fetch("/api/nav-config", { cache: "no-store" })
      .then((r) => r.json())
      .then((config) => {
        if (!cancelled && config?.[key] === false) {
          router.replace("/");
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [route, router]);

  return null;
};
