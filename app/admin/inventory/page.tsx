"use client";

// app/admin/inventory/page.tsx
import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import {
  LucidePackage,
  LucideTrendingUp,
  LucideAlertTriangle,
  LucideTags,
} from "lucide-react";

export default function Inventory() {
  const inventoryItems = [
    {
      name: "Hijab Rifa",
      category: "Hijab",
      stock: 120,
      price: 85000,
      status: "In Stock",
      emoji: "🧕",
    },
    {
      name: "Ori Mukenah",
      category: "Mukenah",
      stock: 95,
      price: 150000,
      status: "In Stock",
      emoji: "🧕",
    },
    {
      name: "Cargo Loos",
      category: "Pants",
      stock: 80,
      price: 200000,
      status: "Low Stock",
      emoji: "👖",
    },
    {
      name: "Sandal Wanita",
      category: "Footwear",
      stock: 65,
      price: 75000,
      status: "Low Stock",
      emoji: "👡",
    },
    {
      name: "Tas Ransel",
      category: "Bags",
      stock: 45,
      price: 250000,
      status: "Critical",
      emoji: "🎒",
    },
  ];

  const statusStyles: Record<string, string> = {
    "In Stock": "bg-emerald-100 text-emerald-700",
    "Low Stock": "bg-amber-100 text-amber-700",
    Critical: "bg-red-100 text-red-700",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Produk",
      value: "156",
      change: "+5",
      icon: <LucidePackage size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Nilai Stok",
      value: "Rp 87.2M",
      change: "+12%",
      icon: <LucideTrendingUp size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Stok Rendah",
      value: "23",
      change: "-3",
      icon: <LucideAlertTriangle size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Kategori",
      value: "12",
      change: "+1",
      icon: <LucideTags size={18} />,
      gradient: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <DashboardLayout
      config={{
        title: "Inventory",
        moduleItems: [
          { label: "Ringkasan", href: "/admin/inventory" },
          { label: "Stok", href: "/admin/inventory/stock" },
          { label: "Produk", href: "/admin/inventory/product" },
          { label: "Kode Produk", href: "/admin/inventory/code-product" },
          { label: "Laporan", href: "/admin/inventory/report" },
          { label: "Pengaturan", href: "/admin/inventory/settings" },
        ],
      }}
    >
      <div className="p-4 mb-15 md:my-0 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">
            Inventory
          </h1>
          <p className="text-gray-500">Kelola stok produk Anda</p>
        </div>

        {/* Stats Cards */}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${stat.gradient} p-6 text-white`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {stat.icon}
                  </div>
                  <span className="text-white/80 text-sm font-medium">
                    {stat.title}
                  </span>
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-emerald-200">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-purple-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Daftar Produk</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {inventoryItems.map((item, index) => (
              <div
                key={index}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
                    {item.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="text-xs text-gray-500">{item.stock} unit</p>
                  </div>
                  <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
