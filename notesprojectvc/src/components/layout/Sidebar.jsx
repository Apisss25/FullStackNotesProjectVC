"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconHome,
  IconNote,
  IconBookmark,
  IconUser,
  IconLogout,
  IconClose,
  IconPen,
  IconLeaf,
  IconLock,
} from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

const navItems = [
  { href: "/", label: "Beranda", icon: IconHome, exact: true },
  { href: "/my-notes", label: "Catatan Saya", icon: IconNote },
  { href: "/saved", label: "Catatan Tersimpan", icon: IconBookmark },
  { href: "/profile", label: "Profil", icon: IconUser },
];

function NavItem({ item, active, locked, onNavigate }) {
  const Icon = item.icon;
  const router = useRouter();
  const { showToast } = useToast();

  const handleClick = (event) => {
    if (locked) {
      event.preventDefault();
      showToast("Login untuk menggunakan fitur ini.", "info");
      router.push("/login");
      return;
    }
    onNavigate?.();
  };

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      aria-current={active ? "page" : undefined}
      className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mint)] ${
        active
          ? "bg-[var(--green)]/18 font-medium text-[var(--ink)]"
          : "text-[var(--ink-soft)] hover:bg-white/45 hover:text-[var(--ink)]"
      }`}
    >
      <Icon
        className={`h-[19px] w-[19px] transition-colors ${
          active ? "text-[var(--green)]" : "text-[var(--sage)] group-hover:text-[var(--ink-soft)]"
        }`}
      />
      <span className="flex-1">{item.label}</span>
      {locked ? <IconLock className="h-3.5 w-3.5 text-[var(--ink-soft)]/60" /> : null}
    </Link>
  );
}

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const isLocked = !user;

  const handleLogout = async () => {
    await logout();
    showToast("Kamu sudah keluar.", "success");
    onClose?.();
    router.push("/");
  };

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[var(--ink)]/30 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Navigasi utama"
        className={`fixed inset-y-0 left-0 z-50 flex w-[284px] max-w-[85vw] flex-col p-3.5 transition-transform duration-300 ease-out md:sticky md:top-0 md:z-0 md:h-screen md:max-w-none md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="glass flex h-full flex-col overflow-hidden p-3">
          <div className="flex items-center justify-between px-2 py-2.5">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] text-[var(--mint)]">
                <IconLeaf className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block font-head text-[17px] font-semibold tracking-tight text-[var(--ink)]">
                  Catatan Sosial
                </span>
                <span className="block text-[11px] text-[var(--ink-soft)]">
                  ruang menulis bersama
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu"
              className="grid h-10 w-10 place-items-center rounded-lg text-[var(--ink-soft)] transition-colors hover:bg-white/50 hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] md:hidden"
            >
              <IconClose />
            </button>
          </div>

          <Link
            href={isLocked ? "/login" : "/my-notes"}
            onClick={onClose}
            className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--green)] px-4 text-sm font-medium text-[var(--ink)] shadow-[0_10px_20px_rgba(29,185,84,0.2)] transition-[background-color,transform] duration-200 hover:bg-[#19a849] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
          >
            <IconPen className="h-4 w-4" />
            Tulis catatan
          </Link>

          <nav className="mt-5 flex flex-1 flex-col gap-1">
            <p className="px-3 pb-2 text-[11px] font-medium text-[var(--ink-soft)]/80">
              Menu
            </p>
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                active={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
                locked={isLocked}
                onNavigate={onClose}
              />
            ))}
          </nav>

          <div className="mt-3 rounded-2xl bg-white/38 p-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--sage)]/35 font-head text-sm font-semibold text-[var(--ink)]">
                {user?.username?.slice(0, 1).toUpperCase() || "T"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--ink)]">
                  {user?.username || "Tamu"}
                </p>
                <p className="text-[11px] text-[var(--ink-soft)]">
                  {user ? "Masuk sebagai penulis" : "Mode baca saja"}
                </p>
              </div>
            </div>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex min-h-9 w-full items-center gap-2 rounded-lg px-2 text-sm text-[var(--ink-soft)] transition-colors hover:bg-white/55 hover:text-[var(--danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
              >
                <IconLogout className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="mt-3 flex min-h-9 w-full items-center justify-center rounded-lg bg-[var(--ink)] px-2 text-sm font-medium text-[var(--mint)] transition-colors hover:bg-[var(--ink-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
              >
                Login atau daftar
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
