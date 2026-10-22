"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

export default function AppShell({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="flex min-h-screen w-full">
          <div id="app-sidebar">
            <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-14 sm:px-6 md:px-8 md:pt-8">
              <Topbar onOpenMenu={() => setDrawerOpen(true)} />
              {children}
            </main>
            <footer className="mx-auto w-full max-w-6xl px-4 pb-8 pt-2 text-xs text-[var(--ink-soft)] sm:px-6 md:px-8">
              Catatan Sosial · dibuat untuk menulis dan membaca bersama
            </footer>
          </div>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
