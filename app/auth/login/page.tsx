import Link from "next/link";
import { LucideLock, LucideMail, LucideUser } from "lucide-react";

export default function Register() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-[url('/auth.jpg')] bg-cover bg-center lg:bg-[length:200%_100%]">
      {/* Bagian KIRI: 2/3 transparent image (hidden mobile) */}
      <div className="hidden lg:flex lg:w-2/3 bg-black/50 relative overflow-hidden">
        {/* Optional: linear overlay + content promo */}
        <div className="absolute inset-0 bg-linear-to-r from-black/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-start justify-center p-16 max-w-lg ml-16"></div>
      </div>

      {/* Bagian KANAN: 1/3 Register Form (full width mobile) */}
      <div className="bg-white h-screen w-full lg:w-1/3 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        {/* Mobile: No background image, full white */}
        <div className="w-full max-w-md bg-white/100 lg:bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 mx-auto">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="font-black text-4xl bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Sellora
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Masuk
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-6">
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
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
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
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
                  placeholder="Buat password aman"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            >
              Masuk Sekarang
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              Buat akun sekarang
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
