"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  LucideFileText,
  LucideDollarSign,
  LucideTrendingUp,
  LucideCalendar,
  LucideUsers,
  LucideClock,
  LucideAlertTriangle,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
);

export default function InvoiceAnalyticsPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  // Dummy data berdasarkan periode
  const getInvoiceData = () => {
    if (period === "daily") {
      return {
        labels: [
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
        ],
        invoices: [2, 3, 4, 5, 6, 5, 4, 3, 2],
        revenue: [1.2, 2.1, 2.8, 3.5, 4.2, 3.8, 3.0, 2.2, 1.5],
      };
    } else if (period === "weekly") {
      return {
        labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
        invoices: [4, 5, 6, 7, 8, 6, 5],
        revenue: [2.5, 3.2, 3.8, 4.5, 5.2, 4.0, 3.1],
      };
    } else {
      return {
        labels: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"],
        invoices: [18, 22, 25, 30],
        revenue: [12.5, 15.2, 18.3, 21.5],
      };
    }
  };

  const data = getInvoiceData();

  const invoiceTrendData = {
    labels: data.labels,
    datasets: [
      {
        label: "Jumlah Invoice",
        data: data.invoices,
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Revenue (Juta Rp)",
        data: data.revenue,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
      },
    ],
  };

  const statusDistributionData = {
    labels: ["Lunas", "Tertunda", "Jatuh Tempo"],
    datasets: [
      {
        data: [68, 22, 10],
        backgroundColor: [
          "rgba(139, 92, 246, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const topCustomersData = {
    labels: [
      "John Doe",
      "Jane Smith",
      "Ahmad Fauzi",
      "Siti Aminah",
      "Budi Santoso",
    ],
    datasets: [
      {
        label: "Total Belanja (Juta Rp)",
        data: [12.5, 9.8, 7.2, 5.5, 4.0],
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Jumlah Invoice" },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      y1: {
        beginAtZero: true,
        position: "right" as const,
        title: { display: true, text: "Revenue (Juta Rp)" },
        grid: { drawOnChartArea: false },
      },
      x: { grid: { display: false } },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0, 0, 0, 0.05)" } },
      x: { grid: { display: false } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { usePointStyle: true, padding: 16 },
      },
    },
    cutout: "70%",
  };

  const stats = [
    {
      title: "Total Faktur",
      value: "156",
      change: "+12",
      icon: <LucideFileText size={18} />,
      gradient: "from-violet-600 to-purple-700",
    },
    {
      title: "Total Pendapatan",
      value: "Rp 124.5 JT",
      change: "+18%",
      icon: <LucideDollarSign size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Rata-rata Nilai",
      value: "Rp 798K",
      change: "+5%",
      icon: <LucideTrendingUp size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Jumlah Terlambat",
      value: "Rp 8.2 JT",
      change: "-2%",
      icon: <LucideAlertTriangle size={18} />,
      gradient: "from-red-500 to-rose-600",
    },
  ];

  return (
    <DashboardLayout
      config={{
        title: "Analitik Faktur",
        moduleItems: [
          { label: "Faktur", href: "/admin/invoice" },
          { label: "Analitik", href: "/admin/invoice/analytics" },
          { label: "Pengaturan", href: "/admin/invoice/settings" },
        ],
      }}
    >
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-mono">
              Analitik Faktur
            </h1>
            <p className="text-gray-500">Wawasan kinerja untuk faktur Anda</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-purple-200 rounded-md p-1">
            <button
              onClick={() => setPeriod("daily")}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                period === "daily"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setPeriod("weekly")}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                period === "weekly"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Mingguan
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                period === "monthly"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Bulanan
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, idx) => (
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
                <p className="text-sm text-emerald-200">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice & Revenue Trend */}
        <div className="bg-white rounded-2xl border border-purple-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">
              Tren Faktur & Pendapatan
            </h3>
            <LucideCalendar size={18} className="text-gray-400" />
          </div>
          <div className="h-80">
            <Line data={invoiceTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Status Distribution & Top Customers */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">
              Distribusi Status Faktur
            </h3>
            <div className="h-72">
              <Doughnut
                data={statusDistributionData}
                options={doughnutOptions}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">
              Pelanggan Teratas berdasarkan Pengeluaran
            </h3>
            <div className="h-72">
              <Bar data={topCustomersData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Additional Insights (if daily) */}
        {period === "daily" && (
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">
              Distribusi Faktur per Jam
            </h3>
            <div className="space-y-3">
              {data.labels.map((hour, i) => (
                <div key={hour} className="flex items-center gap-4">
                  <span className="w-16 text-sm text-gray-600">{hour}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(data.invoices[i] / 8) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {data.invoices[i]} faktur
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
