"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { IconBookmark } from "@/components/icons";
import { getSavedNotes, saveNote, unsaveNote } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import Skeleton from "@/components/ui/Skeleton";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";

function SavedNote({ note, onUnsave, unsaving }) {
  const timeAgo = note.created_at ? formatDistanceToNowStrict(new Date(note.created_at), { addSuffix: true }) : "";

  return (
    <article className="glass p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/notes/${note.id}`} className="flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] rounded-md">
          <h3 className="font-head text-lg font-semibold leading-snug text-[var(--ink)] line-clamp-1">
            {note.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)] line-clamp-2">
            {note.excerpt || "Tidak ada cuplikan."}
          </p>
        </Link>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/45">
        <div className="flex items-center gap-2 text-xs text-[var(--ink-soft)]">
          <span className="font-medium text-[var(--ink)]">{note.username}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={note.created_at}>{timeAgo}</time>
        </div>
        <button
          type="button"
          onClick={() => onUnsave(note.id)}
          disabled={unsaving}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] ${
            unsaving ? "opacity-60 cursor-wait" : "bg-white/55 text-[var(--ink-soft)] hover:bg-white/80"
          }`}
        >
          <IconBookmark className="h-3.5 w-3.5" />
          {unsaving ? "Menghapus..." : "Hapus dari tersimpan"}
        </button>
      </footer>
    </article>
  );
}

function SavedNoteSkeleton() {
  return (
    <article className="glass p-5 flex flex-col">
      <Skeleton className="h-6 w-3/4 rounded mb-3" />
      <Skeleton className="h-4 w-full rounded mb-2" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <div className="mt-4 flex justify-between items-center pt-3 border-t border-white/45">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
    </article>
  );
}

function SavedContent() {
  const { showToast } = useToast();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unsavingIds, setUnsavingIds] = useState({});

  const fetchSavedNotes = async (pageNum, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await getSavedNotes(pageNum);
      const data = response?.data?.data || response?.data || [];

      if (append) {
        setNotes((prev) => [...prev, ...data]);
      } else {
        setNotes(data);
      }

      const currentPage = response?.data?.current_page || pageNum;
      const lastPage = response?.data?.last_page || 1;
      setPage(currentPage);
      setHasMore(currentPage < lastPage);
    } catch (err) {
      if (!append) {
        showToast("Gagal memuat catatan tersimpan.", "error");
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchSavedNotes(1);
    } else if (!authLoading && !user) {
      showToast("Login untuk melihat catatan tersimpan.", "info");
      router.push("/login?redirect=/saved");
    }
  }, [authLoading, user]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchSavedNotes(page + 1, true);
    }
  };

  const handleUnsave = async (noteId) => {
    setUnsavingIds((prev) => ({ ...prev, [noteId]: true }));
    try {
      await unsaveNote(noteId);
      showToast("Catatan dihapus dari tersimpan.", "success");
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      showToast(err.message || "Gagal menghapus dari tersimpan.", "error");
    } finally {
      setUnsavingIds((prev) => ({ ...prev, [noteId]: false }));
    }
  };

  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="py-6 md:py-10">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="mt-3 h-5 w-72" />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SavedNoteSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10">
      <header className="max-w-2xl">
        <h1 className="font-head text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
          Catatan Tersimpan
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-base">
          Catatan yang kamu simpan dari penulis lain akan muncul di sini.
        </p>
      </header>

      {notes.length === 0 && !loading ? (
        <div className="mt-8 glass p-8 text-center">
          <h2 className="font-head text-xl font-semibold text-[var(--ink)]">Belum ada catatan tersimpan</h2>
          <p className="mt-2 text-[var(--ink-soft)]">Jelajahi catatan dan simpan yang menarik.</p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--green)] px-5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[#19a849] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
          >
            Jelajahi catatan
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <SavedNote
              key={note.id}
              note={note}
              unsaving={unsavingIds[note.id]}
              onUnsave={handleUnsave}
            />
          ))}
          {loading && [...Array(3)].map((_, i) => <SavedNoteSkeleton key={`skeleton-${i}`} />)}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-white/55 px-5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] disabled:opacity-50"
          >
            {loadingMore ? "Memuat..." : "Muat lebih banyak"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SavedPage() {
  return <Suspense fallback={<div className="py-10"><Skeleton className="h-10 w-56 mb-3" /><Skeleton className="h-4 w-72 mb-8" /><Skeleton className="h-64 w-full rounded-[var(--radius)]" /></div>}><SavedContent /></Suspense>;
}