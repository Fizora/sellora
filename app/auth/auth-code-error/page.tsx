"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LucideArrowLeft, LucideAlertCircle } from "lucide-react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || searchParams.get("error_code");
  const errorDescription =
    searchParams.get("description") ||
    searchParams.get("error_description") ||
    "Terjadi kesalahan saat autentikasi. Silakan coba lagi atau hubungi administrator.";

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <LucideAlertCircle size={40} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Gagal Masuk</h1>
          <p className="text-gray-600 mb-8">{errorDescription}</p>
          {errorCode && (
            <p className="text-sm text-gray-400 mb-4">
              Kode error: {errorCode}
            </p>
          )}
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            <LucideArrowLeft size={20} />
            Kembali ke Login
          </Link>
        </div>
      </main>
    </>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100 px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LucideAlertCircle size={40} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              Gagal Masuk
            </h1>
            <p className="text-gray-600 mb-8">Memuat...</p>
          </div>
        </main>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
