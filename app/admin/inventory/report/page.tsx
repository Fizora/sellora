"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucideEye,
  LucideTrendingUp,
  LucideTrendingDown,
  LucidePackage,
} from "lucide-react";

interface ReportItem {
  id: string;
  title: string;
  type: "stock" | "product" | "transaction";
  period: string;
  date: string;
  status: "ready" | "processing";
}

const initialReports: ReportItem[] = [
  {
    id: "1",
    title: "Laporan Stock Bulanan",
    type: "stock",
    period: "Maret 2024",
    date: "2024-03-01",
    status: "ready",
  },
  {
    id: "2",
    title: "Laporan Penjualan Product",
    type: "product",
    period: "Februari 2024",
    date: "2024-02-01",
    status: "ready",
  },
  {
    id: "3",
    title: "Laporan Transaksi Harian",
    type: "transaction",
    period: "15 Maret 2024",
    date: "2024-03-15",
    status: "ready",
  },
  {
    id: "4",
    title: "Laporan Stock Mingguan",
    type: "stock",
    period: "Minggu 2 - Maret 2024",
    date: "2024-03-14",
    status: "ready",
  },
  {
    id: "5",
    title: "Laporan Product Terlaris",
    type: "product",
    period: "Maret 2024",
    date: "2024-03-01",
    status: "processing",
  },
];

export default function ReportPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [reports] = useState<ReportItem[]>(initialReports);

  const filteredReports =
    filterType === "all"
      ? reports
      : reports.filter((r) => r.type === filterType);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "stock":
        return "Stock";
      case "product":
        return "Product";
      case "transaction":
        return "Transaksi";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stock":
        return "bg-blue-100 text-blue-800";
      case "product":
        return "bg-purple-100 text-purple-800";
      case "transaction":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = [
    {
      title: "Total Reports",
      value: reports.length,
      change: "Reports",
      icon: <LucideFileText size={18} />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Stock Reports",
      value: reports.filter((r) => r.type === "stock").length,
      change: "+2",
      icon: <LucidePackage size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Product Reports",
      value: reports.filter((r) => r.type === "product").length,
      change: "+1",
      icon: <LucideTrendingUp size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Ready to Download",
      value: reports.filter((r) => r.status === "ready").length,
      change: "Available",
      icon: <LucideDownload size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <DashboardLayout
      config={{
        title: "Inventory | Report",
        moduleItems: [
          { label: "Dashboard", href: "/admin/inventory" },
          { label: "Stock", href: "/admin/inventory/stock" },
          { label: "Product", href: "/admin/inventory/product" },
          { label: "Code Product", href: "/admin/inventory/code-product" },
          { label: "Report", href: "/admin/inventory/report" },
        ],
      }}
    >
      <main className="min-h-screen p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-mono">
              Stock Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <LucideTrendingUp className="text-green-600" size={20} />
                  <span className="text-gray-700">Stock Masuk</span>
                </div>
                <span className="font-bold text-green-600">+120</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <LucideTrendingDown className="text-red-600" size={20} />
                  <span className="text-gray-700">Stock Keluar</span>
                </div>
                <span className="font-bold text-red-600">-40</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <LucidePackage className="text-purple-600" size={20} />
                  <span className="text-gray-700">Total Stock</span>
                </div>
                <span className="font-bold text-purple-600">405</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-mono">
              Product Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <LucidePackage className="text-blue-600" size={20} />
                  <span className="text-gray-700">Total Product</span>
                </div>
                <span className="font-bold text-blue-600">5</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <LucideFileText className="text-indigo-600" size={20} />
                  <span className="text-gray-700">Total Kode Product</span>
                </div>
                <span className="font-bold text-indigo-600">6</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <LucideFileText className="text-orange-600" size={20} />
                  <span className="text-gray-700">Laporan Bulan Ini</span>
                </div>
                <span className="font-bold text-orange-600">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report List */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-purple-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Daftar Laporan
            </h2>
            <div className="flex gap-2">
              {["all", "stock", "product", "transaction"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${
                    filterType === type
                      ? "bg-linear-to-r from-violet-500 to-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type === "all"
                    ? "Semua"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition gap-3"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center shadow-sm">
                    <LucideFileText className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {report.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {report.period} •{" "}
                      {new Date(report.date).toLocaleDateString("id-ID")}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(
                        report.type,
                      )}`}
                    >
                      {getTypeLabel(report.type)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-14 sm:ml-0">
                  {report.status === "ready" ? (
                    <>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-100 rounded-lg transition">
                        <LucideEye size={16} /> Lihat
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-100 rounded-lg transition">
                        <LucideDownload size={16} /> Unduh
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1.5 text-sm text-orange-600 bg-orange-100 rounded-lg">
                      Processing...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
