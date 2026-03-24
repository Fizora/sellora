"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucidePackage,
  LucideSearch,
  LucideFilter,
  LucideX,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  status: "available" | "low" | "out";
}

export default function InventoryReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Data dummy inventory
  const [inventoryItems] = useState<InventoryItem[]>([
    {
      id: "INV-001",
      name: "Hijab Rifa",
      category: "Pakaian",
      stock: 45,
      unit: "pcs",
      price: 233500,
      status: "available",
    },
    {
      id: "INV-002",
      name: "Baju Muslim",
      category: "Pakaian",
      stock: 12,
      unit: "pcs",
      price: 250000,
      status: "low",
    },
    {
      id: "INV-003",
      name: "Al-Qur'an Terjemah",
      category: "Buku",
      stock: 0,
      unit: "eks",
      price: 125000,
      status: "out",
    },
    {
      id: "INV-004",
      name: "Sajadah",
      category: "Perlengkapan",
      stock: 8,
      unit: "lembar",
      price: 70000,
      status: "low",
    },
    {
      id: "INV-005",
      name: "Mukena",
      category: "Pakaian",
      stock: 23,
      unit: "set",
      price: 350000,
      status: "available",
    },
    {
      id: "INV-006",
      name: "Tasbih Digital",
      category: "Aksesoris",
      stock: 15,
      unit: "pcs",
      price: 85000,
      status: "available",
    },
    {
      id: "INV-007",
      name: "Sarung",
      category: "Pakaian",
      stock: 0,
      unit: "pcs",
      price: 120000,
      status: "out",
    },
    {
      id: "INV-008",
      name: "Al-Qur'an Tajwid",
      category: "Buku",
      stock: 5,
      unit: "eks",
      price: 150000,
      status: "low",
    },
    {
      id: "INV-009",
      name: "Minyak Attar",
      category: "Aksesoris",
      stock: 32,
      unit: "botol",
      price: 45000,
      status: "available",
    },
    {
      id: "INV-010",
      name: "Peci Hitam",
      category: "Pakaian",
      stock: 18,
      unit: "pcs",
      price: 55000,
      status: "available",
    },
  ]);

  // Ambil daftar kategori unik untuk filter
  const categories = [
    "all",
    ...new Set(inventoryItems.map((item) => item.category)),
  ];

  // Filter data berdasarkan search, kategori, dan status
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExportPDF = () => {
    alert("Ekspor ke PDF (demo) - data yang difilter akan diekspor");
  };

  const handleExportExcel = () => {
    alert("Ekspor ke Excel (demo) - data yang difilter akan diekspor");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  return (
    <DashboardLayout
      config={{
        title: "Inventory Report",
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-mono">
              Laporan Inventory
            </h1>
            <p className="text-gray-500">
              Data stok barang dan status ketersediaan
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50 transition"
            >
              <LucideFileText size={16} />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50 transition"
            >
              <LucideDownload size={16} />
              Excel
            </button>
          </div>
        </div>

        {/* Filter dan Pencarian */}
        <div className="bg-white rounded-2xl border border-purple-200 p-4 space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cari
              </label>
              <div className="relative">
                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ID atau nama barang..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Kategori */}
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "Semua" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Stok
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Semua</option>
                <option value="available">Tersedia</option>
                <option value="low">Stok Rendah</option>
                <option value="out">Habis</option>
              </select>
            </div>

            {/* Tombol Reset */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition"
            >
              <LucideX size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Tabel Inventory */}
        <div className="bg-white rounded-2xl border border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LucidePackage size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Daftar Stok Barang
            </h2>
            <span className="ml-auto text-sm text-gray-500">
              {filteredItems.length} item
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Barang
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satuan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {item.stock}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {item.unit}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "available"
                            ? "bg-green-100 text-green-800"
                            : item.status === "low"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "available"
                          ? "Tersedia"
                          : item.status === "low"
                            ? "Stok Rendah"
                            : "Habis"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data yang sesuai dengan filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
