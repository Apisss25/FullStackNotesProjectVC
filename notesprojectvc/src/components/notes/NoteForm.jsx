"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { IconClose, IconPen } from "@/components/icons";

export default function NoteForm({ note, loading, onSubmit, onCancel }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Judul wajib diisi.";
    else if (title.trim().length > 150) nextErrors.title = "Judul maksimal 150 karakter.";
    if (!content.trim()) nextErrors.content = "Isi catatan wajib diisi.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) onSubmit({ title: title.trim(), content: content.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-head text-xl font-semibold text-[var(--ink)]">
            {note ? "Edit catatan" : "Tulis catatan baru"}
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            {note ? "Perbarui judul atau isi catatanmu." : "Tulis sesuatu yang ingin kamu simpan."}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Tutup form"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[var(--ink-soft)] hover:bg-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
        >
          <IconClose />
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <Input
          label="Judul"
          name="title"
          value={title}
          maxLength={150}
          placeholder="Contoh: Hal-hal kecil hari ini"
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
          disabled={loading}
        />
        <Input
          as="textarea"
          label="Isi catatan"
          name="content"
          value={content}
          placeholder="Tulis isi catatanmu di sini..."
          onChange={(event) => setContent(event.target.value)}
          error={errors.content}
          disabled={loading}
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          <IconPen className="h-4 w-4" />
          {loading ? "Menyimpan..." : note ? "Simpan perubahan" : "Simpan catatan"}
        </Button>
      </div>
    </form>
  );
}
