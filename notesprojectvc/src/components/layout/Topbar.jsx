"use client";

import Link from "next/link";
import { IconMenu, IconLeaf } from "@/components/icons";

export default function Topbar({ onOpenMenu }) {
  return (
    <header className="sticky top-0 z-30 -mx-4 mb-5 flex items-center justify-between gap-3 border-b border-white/45 bg-white/35 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:hidden">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Buka menu"
        aria-controls="app-sidebar"
        className="grid h-11 w-11 place-items-center rounded-xl bg-white/55 text-[var(--ink)] transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
      >
        <IconMenu />
      </button>
      <Link href="/" className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--ink)] text-[var(--mint)]">
          <IconLeaf className="h-4 w-4" />
        </span>
        <span className="font-head text-base font-semibold tracking-tight">
          Catatan Sosial
        </span>
      </Link>
      <span className="h-11 w-11" aria-hidden="true" />
    </header>
  );
}
