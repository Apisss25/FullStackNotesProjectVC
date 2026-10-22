"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { IconBookmark, IconCalendar, IconLeaf, IconNote, IconRefreshCw, IconUser } from "@/components/icons";
import { getProfile } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

function formatDate(value) {
  if (!value) return "-";
  return format(new Date(value), "d MMMM yyyy", { locale: id });
}

function ProfileNote({ note }) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="block rounded-xl bg-white/35 p-4 transition-colors hover:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
    >
      <h3 className="font-head text-base font-semibold text-[var(--ink)]">{note.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        {note.excerpt || "Tidak ada cuplikan."}
      </p>
      <p className="mt-3 text-xs text-[var(--ink-soft)]">{formatDate(note.created_at)}</p>
    </Link>
  );
}

function ProfileContent() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProfile();
      setProfile(response?.data || null);
    } catch (requestError) {
      setError(requestError.message || "Gagal memuat profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="py-6 md:py-10">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="mt-3 h-5 w-72" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => <Skeleton key={item} className="h-28 rounded-[var(--radius)]" />)}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[1, 2].map((item) => <Skeleton key={item} className="h-56 rounded-[var(--radius)]" />)}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="py-10">
        <Card className="text-center">
          <IconLeaf className="mx-auto h-12 w-12 text-[var(--sage)]" />
          <h1 className="mt-4 font-head text-2xl font-semibold text-[var(--ink)]">Profil belum bisa dimuat</h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">{error || "Data profil tidak tersedia."}</p>
          <Button className="mt-5" onClick={loadProfile}><IconRefreshCw className="h-4 w-4" /> Coba lagi</Button>
        </Card>
      </div>
    );
  }

  const recentNotes = profile.recent_notes || [];
  const recentSavedNotes = profile.recent_saved_notes || [];

  return (
    <div className="py-6 md:py-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-head text-2xl font-semibold text-[var(--mint)]">
            {profile.username?.slice(0, 1).toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="font-head text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">{profile.username}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--ink-soft)]"><IconCalendar className="h-4 w-4" /> Bergabung {formatDate(profile.joined_at)}</p>
          </div>
        </div>
        <Button variant="secondary" onClick={loadProfile}><IconRefreshCw className="h-4 w-4" /> Segarkan</Button>
      </header>

      <section aria-label="Statistik profil" className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--green)]/18 text-[var(--green)]"><IconNote className="h-5 w-5" /></span>
          <div><p className="text-sm text-[var(--ink-soft)]">Catatan saya</p><p className="font-head text-2xl font-semibold text-[var(--ink)]">{profile.notes_count}</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--sage)]/25 text-[var(--ink-soft)]"><IconBookmark className="h-5 w-5" /></span>
          <div><p className="text-sm text-[var(--ink-soft)]">Catatan tersimpan</p><p className="font-head text-2xl font-semibold text-[var(--ink)]">{profile.saved_notes_count}</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--lime)]/60 text-[var(--ink-soft)]"><IconUser className="h-5 w-5" /></span>
          <div><p className="text-sm text-[var(--ink-soft)]">Status akun</p><p className="font-head text-2xl font-semibold text-[var(--ink)]">Aktif</p></div>
        </Card>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <Card>
          <div className="flex items-end justify-between gap-3">
            <div><h2 className="font-head text-xl font-semibold text-[var(--ink)]">Catatan saya</h2><p className="mt-1 text-sm text-[var(--ink-soft)]">Lima catatan terbaru.</p></div>
            <Link href="/my-notes" className="text-sm font-medium text-[var(--green)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]">Lihat semua</Link>
          </div>
          <div className="mt-5 space-y-3">
            {recentNotes.length ? recentNotes.map((note) => <ProfileNote key={note.id} note={note} />) : <p className="rounded-xl bg-white/30 p-5 text-sm text-[var(--ink-soft)]">Belum ada catatan. <Link className="font-medium text-[var(--green)] hover:underline" href="/my-notes">Tulis catatan pertama.</Link></p>}
          </div>
        </Card>

        <Card>
          <div className="flex items-end justify-between gap-3">
            <div><h2 className="font-head text-xl font-semibold text-[var(--ink)]">Catatan tersimpan</h2><p className="mt-1 text-sm text-[var(--ink-soft)]">Bacaan yang kamu tandai.</p></div>
            <Link href="/saved" className="text-sm font-medium text-[var(--green)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]">Lihat semua</Link>
          </div>
          <div className="mt-5 space-y-3">
            {recentSavedNotes.length ? recentSavedNotes.map((note) => <ProfileNote key={note.id} note={note} />) : <p className="rounded-xl bg-white/30 p-5 text-sm text-[var(--ink-soft)]">Belum ada catatan tersimpan. <Link className="font-medium text-[var(--green)] hover:underline" href="/">Jelajahi catatan.</Link></p>}
          </div>
        </Card>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return <RequireAuth><ProfileContent /></RequireAuth>;
}
