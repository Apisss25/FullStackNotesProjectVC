"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { IconBookmark, IconLeaf } from "@/components/icons";
import { getNotes } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import Skeleton from "@/components/ui/Skeleton";
import Card from "@/components/ui/Card";
import { saveNote, unsaveNote } from "@/lib/api";

function NoteCard({ note, isOwner, isSaved, saving, onSaveClick }) {
  const shortContent = note.excerpt || note.content?.slice(0, 160) || "";
  const timeAgo = note.created_at ? formatDistanceToNowStrict(new Date(note.created_at), { addSuffix: true }) : "";

  return (
    <article className="glass p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/notes/${note.id}`} className="flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] rounded-md">
          <h3 className="font-head text-lg font-semibold leading-snug text-[var(--ink)] line-clamp-1">
            {note.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)] line-clamp-2">
            {shortContent}
          </p>
        </Link>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/45">
        <div className="flex items-center gap-2 text-xs text-[var(--ink-soft)]">
          <span className="font-medium text-[var(--ink)]">{note.username}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={note.created_at}>{timeAgo}</time>
        </div>

        {isOwner ? (
          <Link
            href={`/my-notes?edit=${note.id}`}
            className="text-sm font-medium text-[var(--green)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
          >
            Edit
          </Link>
        ) : (
          <button
            type="button"
            onClick={onSaveClick}
            disabled={saving}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] ${
              isSaved
                ? "bg-[var(--green)]/15 text-[var(--green)] hover:bg-[var(--green)]/25"
                : "bg-white/55 text-[var(--ink-soft)] hover:bg-white/80"
            } ${saving ? "opacity-60 cursor-wait" : ""}`}
          >
            <IconBookmark className="h-3.5 w-3.5" />
            {isSaved ? "Tersimpan" : "Simpan"}
          </button>
        )}
      </footer>
    </article>
  );
}

function NoteCardSkeleton() {
  return (
    <article className="glass p-5 flex flex-col">
      <Skeleton className="h-6 w-3/4 rounded mb-3" />
      <Skeleton className="h-4 w-full rounded mb-2" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <div className="mt-4 flex justify-between items-center pt-3 border-t border-white/45">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </article>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [savingIds, setSavingIds] = useState({});

  const fetchNotes = async (pageNum, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await getNotes(pageNum);
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
        showToast("Gagal memuat catatan.", "error");
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchNotes(1);
    }
  }, [authLoading]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchNotes(page + 1, true);
    }
  };

  const handleSaveClick = async (noteId, currentlySaved) => {
    if (!user) {
      showToast("Login untuk menggunakan fitur ini.", "info");
      router.push("/login?redirect=/");
      return;
    }
    setSavingIds((prev) => ({ ...prev, [noteId]: true }));
    try {
      if (currentlySaved) {
        await unsaveNote(noteId);
        showToast("Catatan dihapus dari tersimpan.", "success");
      } else {
        await saveNote(noteId);
        showToast("Catatan disimpan.", "success");
      }
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId ? { ...note, is_saved: !currentlySaved } : note
        )
      );
    } catch (err) {
      showToast(err.message || "Gagal mengubah status simpan.", "error");
    } finally {
      setSavingIds((prev) => ({ ...prev, [noteId]: false }));
    }
  };

  if (authLoading) {
    return (
      <div className="py-6 md:py-10">
        <header className="max-w-2xl">
          <h1 className="font-head text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            Catatan Terbaru
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-base">
            Jelajahi catatan dari seluruh penulis. Simpan yang menarik, baca kapan saja.
          </p>
        </header>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <NoteCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10">
      <header className="max-w-2xl">
        <h1 className="font-head text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
          Catatan Terbaru
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-base">
          Jelajahi catatan dari seluruh penulis. Simpan yang menarik, baca kapan saja.
        </p>
      </header>

      {notes.length === 0 && !loading ? (
        <div className="mt-8 glass p-8 text-center">
          <IconLeaf className="mx-auto h-12 w-12 text-[var(--sage)]" />
          <p className="mt-4 text-[var(--ink-soft)]">Belum ada catatan. Jadilah yang pertama menulis!</p>
          <Link
            href={user ? "/my-notes" : "/register"}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--green)] px-5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[#19a849] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
          >
            {user ? "Tulis catatan pertama" : "Daftar untuk menulis"}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isOwner={user?.username === note.username}
              isSaved={note.is_saved}
              saving={savingIds[note.id]}
              onSaveClick={() => handleSaveClick(note.id, note.is_saved)}
            />
          ))}
          {loading && [...Array(3)].map((_, i) => <NoteCardSkeleton key={`skeleton-${i}`} />)}
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