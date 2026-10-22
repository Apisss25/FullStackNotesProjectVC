"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { IconArrowRight, IconBookmark, IconPen, IconTrash2 } from "@/components/icons";
import { getNoteDetail, saveNote, unsaveNote } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Dialog from "@/components/ui/Dialog";
import Skeleton from "@/components/ui/Skeleton";

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params?.id;
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && noteId) {
      fetchNote();
    }
  }, [authLoading, noteId]);

  const fetchNote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNoteDetail(noteId);
      const noteData = response?.data;
      if (noteData) {
        setNote(noteData);
        setIsSaved(noteData.is_saved || false);
      } else {
        setError("Catatan tidak ditemukan");
      }
    } catch (err) {
      if (err.status === 404) {
        setError("Catatan tidak ditemukan atau sudah dihapus");
      } else {
        setError(err.message || "Gagal memuat catatan");
      }
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user?.username === note?.username;

  const handleSaveToggle = async () => {
    if (!user) {
      showToast("Login untuk menggunakan fitur ini.", "info");
      router.push(`/login?redirect=/notes/${noteId}`);
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveNote(noteId);
        showToast("Catatan dihapus dari tersimpan.", "success");
        setIsSaved(false);
      } else {
        await saveNote(noteId);
        showToast("Catatan disimpan.", "success");
        setIsSaved(true);
      }
    } catch (err) {
      showToast(err.message || "Gagal mengubah status simpan.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { apiClient } = await import("@/lib/api");
      await apiClient(`/api/notes/${noteId}`, { method: "DELETE" });
      showToast("Catatan berhasil dihapus.", "success");
      setTimeout(() => router.push("/my-notes"), 700);
    } catch (err) {
      showToast(err.message || "Gagal menghapus catatan.", "error");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (authLoading) {
    return (
      <div className="py-6 md:py-10">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <Card className="text-center">
          <h1 className="font-head text-2xl font-semibold text-[var(--ink)]">
            {error}
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Catatan yang kamu cari mungkin sudah dihapus atau tidak tersedia.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--green)] px-5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[#19a849] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
          >
            <IconArrowRight className="h-4 w-4" />
            Kembali ke beranda
          </Link>
        </Card>
      </div>
    );
  }

  if (loading || !note) {
    return (
      <div className="py-6 md:py-10">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const timeAgo = note.created_at
    ? formatDistanceToNowStrict(new Date(note.created_at), { addSuffix: true })
    : "";

  return (
    <div className="py-6 md:py-10">
      <div className="max-w-3xl">
        <header className="mb-8">
          <h1 className="font-head text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            {note.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--ink-soft)]">
            <span className="font-medium text-[var(--ink)]">{note.username}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={note.created_at}>{timeAgo}</time>
          </div>
        </header>

        <article className="glass p-6 sm:p-8 mb-8">
          <div className="prose prose-sm max-w-none text-[var(--ink)]">
            <p className="whitespace-pre-wrap leading-relaxed text-base sm:text-lg">
              {note.content}
            </p>
          </div>
        </article>

        <div className="flex flex-wrap items-center gap-3">
          {isOwner ? (
            <>
<Link
              href={`/my-notes?edit=${noteId}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--green)] px-5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[#19a849] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
            >
                <IconPen className="h-4 w-4" />
                Edit catatan
              </Link>
              <Button
                variant="danger"
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleting}
              >
                <IconTrash2 className="h-4 w-4" />
                Hapus
              </Button>
            </>
          ) : (
            <Button
              variant={isSaved ? "primary" : "secondary"}
              onClick={handleSaveToggle}
              disabled={saving || !user}
            >
              <IconBookmark className="h-4 w-4" />
              {isSaved ? "Tersimpan" : "Simpan"}
            </Button>
          )}
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-white/55 px-5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
          >
            <IconArrowRight className="h-4 w-4 rotate-180" />
            Kembali
          </Link>
        </div>

        <Dialog
          open={showDeleteDialog}
          title="Hapus catatan?"
          description="Tindakan ini tidak dapat dibatalkan. Catatan dan semua bookmark akan dihapus secara permanen."
          confirmLabel="Hapus"
          cancelLabel="Batal"
          tone="danger"
          onConfirm={handleDelete}
          onClose={() => setShowDeleteDialog(false)}
        />
      </div>
    </div>
  );
}
