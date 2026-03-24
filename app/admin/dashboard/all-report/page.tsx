"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucidePackage,
  LucideShoppingCart,
  LucideReceipt,
} from "lucide-react";

// Tipe data untuk setiap modul
interface PosTransaction {
  id: string;
  date: string;
  customer: string;
  product: string;
  quantity: number;
  amount: number;
  status: "completed" | "pending" | "cancelled";
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  status: "available" | "low" | "out";
}

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  customer: string;
  total: number;
  paid: number;
  status: "paid" | "partial" | "pending" | "overdue";
}

export default function AllReportDashboard() {
  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "custom"
  >("week");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([
    "pos",
    "inventory",
    "invoice",
  ]);

  // Data dummy untuk POS
  const [posTransactions] = useState<PosTransaction[]>([
    {
      id: "TRX-001",
      date: "2025-03-24",
      customer: "Umum",
      product: "Hijab Rifa",
      quantity: 2,
      amount: 467000,
      status: "completed",
    },
    {
      id: "TRX-002",
      date: "2025-03-24",
      customer: "Aisyah",
      product: "Baju Muslim",
      quantity: 1,
      amount: 250000,
      status: "completed",
    },
    {
      id: "TRX-003",
      date: "2025-03-23",
      customer: "Fatimah",
      product: "Al-Qur'an Terjemah",
      quantity: 1,
      amount: 125000,
      status: "completed",
    },
    {
      id: "TRX-004",
      date: "2025-03-23",
      customer: "Umum",
      product: "Sajadah",
      quantity: 3,
      amount: 210000,
      status: "completed",
    },
    {
      id: "TRX-005",
      date: "2025-03-22",
      customer: "Zahra",
      product: "Hijab Rifa",
      quantity: 1,
      amount: 233500,
      status: "pending",
    },
    {
      id: "TRX-006",
      date: "2025-03-21",
      customer: "Rahma",
      product: "Mukena",
      quantity: 2,
      amount: 700000,
      status: "completed",
    },
    {
      id: "TRX-007",
      date: "2025-03-20",
      customer: "Laili",
      product: "Al-Qur'an Tajwid",
      quantity: 1,
      amount: 150000,
      status: "cancelled",
    },
  ]);

  // Data dummy untuk Inventory
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
  ]);

  // Data dummy untuk Invoice
  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-2025-001",
      date: "2025-03-20",
      dueDate: "2025-03-27",
      customer: "PT. Berkah Abadi",
      total: 12500000,
      paid: 5000000,
      status: "partial",
    },
    {
      id: "INV-2025-002",
      date: "2025-03-15",
      dueDate: "2025-03-22",
      customer: "CV. Amanah Jaya",
      total: 8750000,
      paid: 8750000,
      status: "paid",
    },
    {
      id: "INV-2025-003",
      date: "2025-03-10",
      dueDate: "2025-03-17",
      customer: "UD. Makmur",
      total: 5000000,
      paid: 0,
      status: "pending",
    },
    {
      id: "INV-2025-004",
      date: "2025-03-05",
      dueDate: "2025-03-12",
      customer: "Fashion Store",
      total: 15200000,
      paid: 15200000,
      status: "paid",
    },
    {
      id: "INV-2025-005",
      date: "2025-03-01",
      dueDate: "2025-03-08",
      customer: "Toko Qalbu",
      total: 3500000,
      paid: 0,
      status: "overdue",
    },
    {
      id: "INV-2025-006",
      date: "2025-02-28",
      dueDate: "2025-03-07",
      customer: "Zahra Collection",
      total: 6750000,
      paid: 2000000,
      status: "partial",
    },
  ]);

  // Toggle module selection
  const toggleModule = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module],
    );
  };

  const handleExportPDF = () => {
    alert("Ekspor ke PDF (demo) - data yang ditampilkan akan diekspor");
  };

  const handleExportExcel = () => {
    alert("Ekspor ke Excel (demo) - data yang ditampilkan akan diekspor");
  };

  // Helper format mata uang
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout
      config={{
        title: "All Reports",
        moduleItems: [
          { label: "Ringkasan", href: "/admin/dashboard" },
          { label: "Analitik", href: "/admin/dashboard/analytics" },
          { label: "Laporan", href: "/admin/dashboard/all-report" },
        ],
      }}
    >
      <div className="p-4 mb-15 md:my-0 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-mono">
              All Reports
            </h1>
            <p className="text-gray-500">
              Laporan komprehensif di seluruh modul
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

        {/* Date Range & Module Filters */}
        <div className="bg-white rounded-2xl border border-purple-200 p-4 space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {["today", "week", "month", "custom"].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range as any)}
                  className={`px-3 py-1.5 text-sm rounded-md transition ${
                    dateRange === range
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range === "today"
                    ? "Hari Ini"
                    : range === "week"
                      ? "Minggu Ini"
                      : range === "month"
                        ? "Bulan Ini"
                        : "Kustom"}
                </button>
              ))}
            </div>
            {dateRange === "custom" && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={selectedModules.includes("pos")}
                onChange={() => toggleModule("pos")}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              POS
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={selectedModules.includes("inventory")}
                onChange={() => toggleModule("inventory")}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              Inventory
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={selectedModules.includes("invoice")}
                onChange={() => toggleModule("invoice")}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              Invoice
            </label>
          </div>
        </div>

        {/* Tabel POS */}
        {selectedModules.includes("pos") && (
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideShoppingCart size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Laporan Transaksi POS
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Transaksi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tx.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {tx.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {tx.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {tx.product}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {tx.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tx.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tx.status === "completed"
                            ? "Selesai"
                            : tx.status === "pending"
                              ? "Pending"
                              : "Dibatalkan"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabel Inventory */}
        {selectedModules.includes("inventory") && (
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucidePackage size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Laporan Stok Inventory
              </h2>
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
                  {inventoryItems.map((item) => (
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
            </div>
          </div>
        )}

        {/* Tabel Invoice */}
        {selectedModules.includes("invoice") && (
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideReceipt size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Laporan Faktur (Invoice)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. Faktur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jatuh Tempo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dibayar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {inv.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {inv.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {inv.dueDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {inv.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(inv.total)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(inv.paid)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            inv.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : inv.status === "partial"
                                ? "bg-blue-100 text-blue-800"
                                : inv.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {inv.status === "paid"
                            ? "Lunas"
                            : inv.status === "partial"
                              ? "Sebagian"
                              : inv.status === "pending"
                                ? "Tertunda"
                                : "Terlambat"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
