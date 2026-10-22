"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { validateUsername, validatePassword, validatePasswordConfirmation } from "@/lib/validation";
import { apiClient } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirmation: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    const confirmError = validatePasswordConfirmation(
      formData.password,
      formData.passwordConfirmation
    );
    if (confirmError) newErrors.passwordConfirmation = confirmError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await apiClient("/api/register", {
        method: "POST",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          password_confirmation: formData.passwordConfirmation,
        }),
      });

      showToast("Daftar berhasil! Mengarahkan ke login...", "success");
      setTimeout(() => router.push("/login"), 700);
    } catch (err) {
      if (err.data?.errors) {
        setErrors(err.data.errors);
      }
      showToast(err.message || "Gagal terhubung ke server.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-10">
      <div className="w-full max-w-sm">
        <Card>
          <h1 className="font-head text-2xl font-semibold text-[var(--ink)]">Daftar akun baru</h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Mulai tulis catatan dan temukan catatan orang lain.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              placeholder="Nama unik 3-20 karakter"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              disabled={loading}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={loading}
            />
            <Input
              label="Konfirmasi password"
              name="passwordConfirmation"
              type="password"
              placeholder="Ketik ulang password"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              error={errors.passwordConfirmation}
              disabled={loading}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mendaftar..." : "Daftar"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--ink-soft)]">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-[var(--green)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
            >
              Masuk di sini
            </Link>
          </p>
        </Card>

        <p className="mt-5 text-center text-xs text-[var(--ink-soft)]">
          Dengan mendaftar, kamu setuju menggunakan fitur sesuai aturan aplikasi.
        </p>
      </div>
    </div>
  );
}
