"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect } from "react";
import {
  LucidePackage,
  LucideTrendingUp,
  LucideAlertTriangle,
  LucideTags,
} from "lucide-react";
import {
  ProductWithStock,
  getProducts,
  getInventoryStats,
} from "@/lib/inventory";

export default function Inventory() {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalValue: 0,
    lowStock: 0,
    criticalStock: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [productsData, statsData] = await Promise.all([
        getProducts(),
        getInventoryStats(),
      ]);
      setProducts(productsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const statusStyles: Record<string, string> = {
    available: "bg-emerald-100 text-emerald-700",
    low: "bg-amber-100 text-amber-700",
    critical: "bg-red-100 text-red-700",
    out: "bg-gray-100 text-gray-700",
  };

  const statusLabels: Record<string, string> = {
    available: "Tersedia",
    low: "Stok Rendah",
    critical: "Kritis",
    out: "Habis",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Produk",
      value: stats.totalProducts,
      change: "+5",
      icon: <LucidePackage size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Nilai Stok",
      value: formatCurrency(stats.totalValue),
      change: "+12%",
      icon: <LucideTrendingUp size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Stok Rendah",
      value: stats.lowStock + stats.criticalStock,
      change: "-3",
      icon: <LucideAlertTriangle size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Kategori",
      value: stats.totalCategories,
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((stat, index) => (
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
                <p className="text-sm text-white/70">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-purple-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Daftar Produk</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : products.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {products.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>📦</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.category_name || "Tanpa Kategori"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(item.price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.stock_quantity} unit
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full ${statusStyles[item.stock_status]}`}
                    >
                      {statusLabels[item.stock_status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Belum ada produk. Silakan tambah produk di halaman Produk.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
