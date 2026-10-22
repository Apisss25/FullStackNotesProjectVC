"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { validateUsername, validatePassword } from "@/lib/validation";
import { useAuth } from "@/context/AuthContext";

function safeRedirect(value) {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const redirectTo = safeRedirect(searchParams.get("redirect"));

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.username, formData.password);
      showToast("Login berhasil. Selamat datang kembali.", "success");
      router.replace(redirectTo);
    } catch (err) {
      showToast(err.message || "Username atau password salah.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-10">
      <div className="w-full max-w-sm">
        <Card>
          <h1 className="font-head text-2xl font-semibold text-[var(--ink)]">Masuk ke akun</h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Buka catatan pribadi dan jelajahi catatan orang lain.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Username kamu"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              disabled={loading}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password kamu"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={loading}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memeriksa..." : "Masuk"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--ink-soft)]">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-[var(--green)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
            >
              Daftar sekarang
            </Link>
          </p>
        </Card>

        <p className="mt-5 text-center text-xs text-[var(--ink-soft)]">
          Login aman. Password disimpan terenkripsi di server.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-sm py-16">
          <Skeleton className="h-80 rounded-[var(--radius)]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
