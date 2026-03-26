"use client";

import Link from "next/link";
import {
  LucideLock,
  LucideMail,
  LucideLoader2,
  LucideCheckCircle,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Register() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ─── Daftar dengan Google (OAuth) ──────────────────────────────
  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      console.log("Starting Google OAuth (register)...");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/admin/dashboard`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      console.log("OAuth response:", { data, error });

      if (error) {
        console.error("OAuth error:", error);
        setError(error.message);
        setGoogleLoading(false);
        return;
      }

      if (data.url) {
        console.log("Redirecting to:", data.url);
        window.location.href = data.url;
      } else {
        setError("Tidak ada URL redirect");
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      console.error("OAuth exception:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Gagal daftar dengan Google";
      setError(errorMessage);
      setGoogleLoading(false);
    }
  };

  // ─── Daftar dengan Email & Password ────────────────────────────
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="w-full max-w-md p-6 sm:p-8">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="font-black text-4xl bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Sellora
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Buat Akun</h2>
          <p className="text-gray-500 mt-1 text-sm">Daftar untuk memulai</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200">
          {/* Success State */}
          {success ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <LucideCheckCircle size={48} className="text-green-500" />
              <h3 className="text-lg font-bold text-gray-800">
                Cek Email Kamu!
              </h3>
              <p className="text-sm text-gray-500">
                Kami mengirimkan link konfirmasi ke{" "}
                <span className="font-semibold text-gray-700">{email}</span>.
                Buka email dan klik link untuk mengaktifkan akun.
              </p>
              <Link
                href="/auth/login"
                className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Kembali ke halaman login →
              </Link>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Google Button */}
              <button
                id="btn-google-register"
                type="button"
                onClick={handleGoogleRegister}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-purple-200 hover:border-purple-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <LucideLoader2 size={20} className="animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {googleLoading ? "Mengalihkan..." : "Daftar dengan Google"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-400 font-medium">atau</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleEmailRegister}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <LucideMail
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LucideLock
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-11 pr-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
                      placeholder="Buat password aman (min. 6 karakter)"
                    />
                  </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500">
                  Dengan mendaftar, Anda setuju dengan{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Syarat dan Ketentuan
                  </Link>{" "}
                  serta{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:underline"
                  >
                    Kebijakan Privasi
                  </Link>
                </p>

                {/* Submit Button */}
                <button
                  id="btn-email-register"
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading && (
                    <LucideLoader2 size={18} className="animate-spin" />
                  )}
                  {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}
