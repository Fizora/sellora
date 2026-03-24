"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucidePrinter,
  LucideCalendar,
  LucidePackage,
  LucideShoppingCart,
  LucideDollarSign,
  LucideReceipt,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideAlertTriangle,
} from "lucide-react";

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

  // Dummy data untuk ringkasan
  const overallStats = [
    {
      title: "Total Pendapatan",
      value: "Rp 124.5 JT",
      change: "+12.5%",
      icon: <LucideDollarSign size={18} />,
      gradient: "from-violet-600 to-purple-700",
    },
    {
      title: "Transaksi",
      value: "1,245",
      change: "+8.2%",
      icon: <LucideShoppingCart size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Produk Terjual",
      value: "3,847",
      change: "+5.3%",
      icon: <LucidePackage size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Faktur Tertunda",
      value: "Rp 28.3 JT",
      change: "-2.1%",
      icon: <LucideReceipt size={18} />,
      gradient: "from-blue-500 to-indigo-600",
      negative: true,
    },
  ];

  // Data laporan per modul
  const posReport = {
    totalSales: "Rp 87.2 JT",
    totalTransactions: 432,
    averageTransaction: "Rp 201,852",
    topProduct: "Hijab Rifa",
    topProductSales: "Rp 23.4 JT",
  };

  const inventoryReport = {
    totalProducts: 156,
    totalStockValue: "Rp 89.7 JT",
    lowStockItems: 23,
    outOfStockItems: 5,
  };

  const invoiceReport = {
    totalInvoices: 324,
    totalPaid: "Rp 96.2 JT",
    totalPending: "Rp 18.5 JT",
    totalOverdue: "Rp 9.8 JT",
  };

  // Toggle module selection
  const toggleModule = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module],
    );
  };

  const handleExportPDF = () => {
    alert("Export as PDF (demo)");
  };

  const handleExportExcel = () => {
    alert("Export as Excel (demo)");
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

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {overallStats.map((stat, idx) => (
            <div
              key={idx}
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
                <p
                  className={`text-sm ${stat.negative ? "text-red-200" : "text-emerald-200"}`}
                >
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Module Reports */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* POS Report */}
          {selectedModules.includes("pos") && (
            <div className="bg-white rounded-2xl border border-purple-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <LucideShoppingCart size={20} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Laporan POS
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Total Penjualan</p>
                    <p className="text-xl font-bold text-gray-900">
                      {posReport.totalSales}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Transaksi</p>
                    <p className="text-xl font-bold text-gray-900">
                      {posReport.totalTransactions}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Rata-rata Transaksi</p>
                    <p className="text-xl font-bold text-gray-900">
                      {posReport.averageTransaction}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Produk Terlaris</p>
                    <p className="text-lg font-bold text-gray-900">
                      {posReport.topProduct}
                    </p>
                    <p className="text-sm text-purple-600">
                      {posReport.topProductSales}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Report */}
          {selectedModules.includes("inventory") && (
            <div className="bg-white rounded-2xl border border-purple-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <LucidePackage size={20} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Inventory Report
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Total Produk</p>
                    <p className="text-xl font-bold text-gray-900">
                      {inventoryReport.totalProducts}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Nilai Stok</p>
                    <p className="text-xl font-bold text-gray-900">
                      {inventoryReport.totalStockValue}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <LucideAlertTriangle
                        size={16}
                        className="text-amber-500"
                      />
                      <p className="text-sm text-gray-500">Item Stok Rendah</p>
                    </div>
                    <p className="text-xl font-bold text-amber-600">
                      {inventoryReport.lowStockItems}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <LucideTrendingDown size={16} className="text-red-500" />
                      <p className="text-sm text-gray-500">Stok Habis</p>
                    </div>
                    <p className="text-xl font-bold text-red-600">
                      {inventoryReport.outOfStockItems}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Report */}
          {selectedModules.includes("invoice") && (
            <div className="bg-white rounded-2xl border border-purple-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <LucideReceipt size={20} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Invoice Report
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Total Faktur</p>
                    <p className="text-xl font-bold text-gray-900">
                      {invoiceReport.totalInvoices}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Jumlah Dibayar</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {invoiceReport.totalPaid}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Jumlah Tertunda</p>
                    <p className="text-xl font-bold text-amber-600">
                      {invoiceReport.totalPending}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-500">Jumlah Terlambat</p>
                    <p className="text-xl font-bold text-red-600">
                      {invoiceReport.totalOverdue}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Chart Section (optional) */}
        <div className="bg-white rounded-2xl border border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Trends
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">
              Chart will be displayed here (e.g., revenue over selected period)
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
