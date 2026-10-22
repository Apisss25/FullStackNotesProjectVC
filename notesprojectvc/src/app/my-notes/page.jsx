"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import NoteForm from "@/components/notes/NoteForm";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Skeleton from "@/components/ui/Skeleton";
import { IconArrowRight, IconLeaf, IconPen } from "@/components/icons";
import { createNote, deleteNote, getMyNotes, updateNote, getSavedNotes } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

function NoteListItem({ note, onEdit, onDelete }) {
  return (
    <article className="glass p-5">
      <Link href={`/notes/${note.id}`} className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]">
        <h2 className="font-head text-xl font-semibold text-[var(--ink)]">{note.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]">
          {note.excerpt || note.content}
        </p>
      </Link>
      <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-white/45 pt-3">
        <Button variant="secondary" size="sm" onClick={() => onEdit(note)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(note)}>
          Hapus
        </Button>
      </div>
    </article>
  );
}

function MyNotesContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editId) {
      const noteToEdit = notes.find((n) => n.id.toString() === editId);
      if (noteToEdit) {
        setEditingNote(noteToEdit);
        setFormOpen(true);
      }
    }
  }, [editId, notes]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async (pageNumber = 1, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);
    try {
      const response = await getMyNotes(pageNumber);
      const paginator = response?.data;
      const items = paginator?.data || [];
      setNotes((current) => (append ? [...current, ...items] : items));
      setPage(paginator?.current_page || pageNumber);
      setHasMore((paginator?.current_page || pageNumber) < (paginator?.last_page || 1));
    } catch (requestError) {
      setError(requestError.message || "Gagal memuat catatan.");
      if (append) showToast("Gagal memuat catatan berikutnya.", "error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const openCreate = () => {
    setEditingNote(null);
    setFormOpen(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingNote) {
        const response = await updateNote(editingNote.id, data);
        const updated = response?.data;
        setNotes((current) => current.map((note) => note.id === editingNote.id ? { ...note, ...updated } : note));
        showToast("Catatan berhasil diperbarui.", "success");
      } else {
        const response = await createNote(data);
        if (response?.data) setNotes((current) => [response.data, ...current]);
        showToast("Catatan berhasil dibuat.", "success");
      }
      setFormOpen(false);
      setEditingNote(null);
    } catch (requestError) {
      showToast(requestError.message || "Gagal menyimpan catatan.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingNote) return;
    try {
      await deleteNote(deletingNote.id);
      setNotes((current) => current.filter((note) => note.id !== deletingNote.id));
      showToast("Catatan berhasil dihapus.", "success");
    } catch (requestError) {
      showToast(requestError.message || "Gagal menghapus catatan.", "error");
    } finally {
      setDeletingNote(null);
    }
  };

  if (formOpen) {
    return (
      <div className="py-6 md:py-10">
        <NoteForm note={editingNote} loading={saving} onSubmit={handleSubmit} onCancel={() => { setFormOpen(false); setEditingNote(null); }} />
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-head text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">Catatan Saya</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)]">Semua catatan yang kamu tulis, tersimpan di satu tempat.</p>
        </div>
        <Button onClick={openCreate}><IconPen className="h-4 w-4" /> Catatan baru</Button>
      </header>

      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => <Card key={item}><Skeleton className="h-6 w-3/4" /><Skeleton className="mt-4 h-4 w-full" /><Skeleton className="mt-2 h-4 w-2/3" /></Card>)}
        </div>
      ) : error ? (
        <Card className="mt-8 text-center"><p className="text-[var(--danger)]">{error}</p><Button className="mt-4" onClick={() => loadNotes()}>Coba lagi</Button></Card>
      ) : notes.length === 0 ? (
        <Card className="mt-8 flex flex-col items-center text-center"><IconLeaf className="h-12 w-12 text-[var(--sage)]" /><h2 className="mt-4 font-head text-xl font-semibold">Belum ada catatan</h2><p className="mt-2 text-sm text-[var(--ink-soft)]">Tulis catatan pertama untuk mulai mengisi ruangmu.</p><Button className="mt-5" onClick={openCreate}>Tulis catatan</Button></Card>
      ) : (
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-2">{notes.map((note) => <NoteListItem key={note.id} note={note} onEdit={openEdit} onDelete={setDeletingNote} />)}</div>
          {hasMore && <div className="mt-8 text-center"><Button variant="secondary" onClick={() => loadNotes(page + 1, true)} disabled={loadingMore}>{loadingMore ? "Memuat..." : "Muat lebih banyak"}<IconArrowRight className="h-4 w-4 rotate-90" /></Button></div>}
        </>
      )}

      <Dialog open={Boolean(deletingNote)} title="Hapus catatan?" description="Catatan dan bookmark terkait akan dihapus secara permanen." confirmLabel="Hapus" tone="danger" onConfirm={handleDelete} onClose={() => setDeletingNote(null)} />
    </div>
  );
}

export default function MyNotesPage() {
  return <RequireAuth><MyNotesContent /></RequireAuth>;
}