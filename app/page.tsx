"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LucideSend,
  LucideArrowRight,
  LucideCheck,
  LucideTrendingUp,
  LucideShoppingCart,
  LucidePackage,
  LucideFileText,
  LucideBarChart3,
  LucideUsers,
  LucideShield,
  LucideZap,
  LucideStar,
  LucideMenu,
  LucideX,
} from "lucide-react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <LucideShoppingCart className="w-6 h-6" />,
      title: "Point of Sale",
      description:
        "Transaksi cepat dengan antarmuka kasir modern dan responsif",
    },
    {
      icon: <LucidePackage className="w-6 h-6" />,
      title: "Inventory Management",
      description: "Kelola stok produk secara real-time dengan akurat",
    },
    {
      icon: <LucideFileText className="w-6 h-6" />,
      title: "Invoice Otomatis",
      description: "Generate invoice secara otomatis dengan format profesional",
    },
    {
      icon: <LucideBarChart3 className="w-6 h-6" />,
      title: "Analisis Bisnis",
      description: "Laporan mendalam untuk pengambilan keputusan strategis",
    },
    {
      icon: <LucideUsers className="w-6 h-6" />,
      title: "Kelola Pelanggan",
      description: "Database pelanggan lengkap dengan riwayat transaksi",
    },
    {
      icon: <LucideShield className="w-6 h-6" />,
      title: "Keamanan Terjamin",
      description: "Data bisnis Anda aman dengan enkripsi tingkat tinggi",
    },
  ];

  const stats = [
    { value: "10K+", label: "Penjual Aktif" },
    { value: "500K+", label: "Transaksi Harian" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "Rating" },
  ];

  const testimonials = [
    {
      name: "Sarah Wijaya",
      role: "Pemilik Toko Hijab",
      content:
        "Sellora sangat membantu bisnis saya. Transaksi jadi lebih cepat dan laporan penjualan sangat detail!",
      rating: 5,
    },
    {
      name: "Ahmad Pratama",
      role: "Manager Retail",
      content:
        "Sistem inventory-nya luar biasa. Tidak pernah lagi mengalami kehabisan stok mendadak.",
      rating: 5,
    },
    {
      name: "Dewi Lestari",
      role: "Entrepreneur",
      content:
        "Dashboard yang intuitif membuat saya bisa memantau bisnis dari mana saja.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Gratis",
      period: "selamanya",
      description: "Cocok untuk usaha kecil yang baru memulai",
      features: ["1 Pengguna", "100 Produk", "Basic Laporan", "Email Support"],
      cta: "Mulai Gratis",
      popular: false,
    },
    {
      name: "Business",
      price: "Rp 299rb",
      period: "/bulan",
      description: "Solusi lengkap untuk bisnis berkembang",
      features: [
        "5 Pengguna",
        "Produk Tidak Terbatas",
        "Advanced Analytics",
        "Priority Support",
        "API Access",
        "Custom Invoice",
      ],
      cta: "Pilih Plan",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Kustom",
      period: "",
      description: "Untuk enterprise dengan kebutuhan spesifik",
      features: [
        "Pengguna Tidak Terbatas",
        "Custom Integrasi",
        "Dedicated Support",
        "SLA Guarantee",
        "On-premise Option",
      ],
      cta: "Hubungi Sales",
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-xl py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="text-2xl font-black bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Sellora
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Fitur
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Harga
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Testimoni
              </a>
              <Link
                href="/doc"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors flex items-center gap-1"
              >
                Dokumentasi
                <LucideArrowRight size={14} />
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-5 py-2.5 text-gray-700 font-semibold hover:text-purple-600 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2.5 bg-linear-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-full shadow-lg shadow-purple-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                Mulai Sekarang
                <LucideSend size={16} />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <LucideX size={24} className="text-gray-700" />
              ) : (
                <LucideMenu size={24} className="text-gray-700" />
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl">
            <div className="px-4 py-6 space-y-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-gray-700 font-medium hover:bg-purple-50 rounded-xl transition-colors"
              >
                Fitur
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-gray-700 font-medium hover:bg-purple-50 rounded-xl transition-colors"
              >
                Harga
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-gray-700 font-medium hover:bg-purple-50 rounded-xl transition-colors"
              >
                Testimoni
              </a>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-gray-700 font-medium hover:bg-purple-50 rounded-xl transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 bg-linear-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl text-center shadow-lg shadow-purple-300"
              >
                Mulai Sekarang
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-linear-to-r from-purple-100/50 to-blue-100/50 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-purple-700">
                🚀 Siap untuk meningkatkan bisnis Anda?
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight font-mono">
              Kelola Bisnis Lebih{" "}
              <span className="bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Cerdas & Efisien
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Platform all-in-one untuk mengelola penjualan, inventory, dan
              laporan bisnis. Tingkatkan produktivitas dengan teknologi modern
              yang mudah digunakan.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-purple-600 to-violet-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Coba Gratis Sekarang
                <LucideArrowRight size={20} />
              </Link>
              <Link
                href="/doc"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-2xl border-2 border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Lihat Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-black text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm lg:text-base text-gray-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-r from-purple-200 via-pink-200 to-blue-200 rounded-3xl blur-2xl opacity-50"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="aspect-video bg-linear-to-br from-gray-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🖥️</div>
                  <p className="text-gray-500 font-medium">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 lg:py-32 bg-linear-to-b from-white to-purple-50/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
              <LucideZap size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">
                Fitur Unggulan
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">
              Semua yang Anda butuhkan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dilengkapi dengan fitur lengkap untuk mengelola bisnis retail Anda
              secara profesional
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-purple-200 hover:border-2 hover:border-purple-200 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <LucideTrendingUp size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                Harga Terjangkau
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">
              Pilih paket yang sesuai
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Harga transparan tanpa biaya tersembunyi. Mulai gratis, upgrade
              kapan saja
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? "ring-2 ring-purple-500 scale-105 lg:scale-110 border border-purple-200"
                    : "border border-gray-100 hover:border-purple-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r from-purple-600 to-violet-600 text-white text-sm font-bold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-black text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-500 font-medium">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <LucideCheck size={12} className="text-green-600" />
                      </div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/register"
                  className={`block w-full py-4 text-center font-bold rounded-2xl transition-all duration-300 ${
                    plan.popular
                      ? "bg-linear-to-r from-purple-600 to-violet-600 text-white hover:-translate-y-1"
                      : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 lg:py-32 bg-linear-to-b from-purple-50/30 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full mb-4">
              <LucideStar size={16} className="text-pink-600" />
              <span className="text-sm font-semibold text-pink-700">
                Testimoni
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">
              Dipercaya ribuan pengusaha
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bergabung dengan ribuan pelaku bisnis yang telah merasakan manfaat
              Sellora
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-purple-200"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <LucideStar
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-linear-to-r from-purple-600 via-violet-600 to-blue-600 rounded-3xl p-8 lg:p-16 text-center overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 translate-y-32"></div>

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
                Mulai bisnis Anda hari ini
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan pengusaha yang telah meningkatkan
                bisnis mereka dengan Sellora
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Daftar Gratis
                  <LucideArrowRight size={20} />
                </Link>
                <Link
                  href="/doc"
                  className="w-full sm:w-auto px-8 py-4 bg-white/20 text-white font-bold text-lg rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Hubungi Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">S</span>
                </div>
                <span className="text-2xl font-black text-white">Sellora</span>
              </Link>
              <p className="text-gray-400 mb-6 max-w-sm">
                Platform all-in-one untuk mengelola bisnis retail Anda dengan
                lebih cerdas dan efisien.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
                >
                  <span className="text-sm">📘</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
                >
                  <span className="text-sm">📸</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
                >
                  <span className="text-sm">🐦</span>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Produk</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Fitur
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Harga
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Demo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Perusahaan</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Tentang
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Karir
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    Kontak
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Sellora. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-500 text-sm hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 text-sm hover:text-purple-400 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
