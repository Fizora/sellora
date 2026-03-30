"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect } from "react";
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
  LucideDollarSign,
  LucideShoppingCart,
  LucideTrendingUp,
  LucideCreditCard,
  LucideCalendar,
  LucidePrinter,
  LucideUsers,
  LucideLoader2,
} from "lucide-react";
import {
  getPosSalesByPeriod,
  getPosTopProducts,
  getPosStats,
  getPaymentMethodDistribution,
} from "@/lib/pos-settings";

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

export default function PosAnalyticsPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<{
    labels: string[];
    sales: number[];
    orders: number[];
  }>({ labels: [], sales: [], orders: [] });
  const [topProducts, setTopProducts] = useState<
    { name: string; quantity: number }[]
  >([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrder: 0,
    uniqueCustomers: 0,
  });
  const [paymentMethodData, setPaymentMethodData] = useState<{
    labels: string[];
    data: number[];
  }>({ labels: [], data: [] });

  useEffect(() => {
    loadData();
  }, [period]);

  async function loadData() {
    try {
      setLoading(true);
      const [salesDataResult, topProductsResult, statsResult, paymentData] =
        await Promise.all([
          getPosSalesByPeriod(period),
          getPosTopProducts(5),
          getPosStats(),
          getPaymentMethodDistribution(),
        ]);
      setSalesData(salesDataResult);
      setTopProducts(topProductsResult);
      setStats(statsResult);
      setPaymentMethodData(paymentData);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)} JT`;
    if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}K`;
    return `Rp ${value.toFixed(0)}`;
  };

  const salesChartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: "Penjualan (Juta Rp)",
        data: salesData.sales,
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const topProductsData = {
    labels: topProducts.map((p) => p.name),
    datasets: [
      {
        label: "Jumlah Terjual",
        data: topProducts.map((p) => p.quantity),
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderRadius: 8,
      },
    ],
  };

  // Real data for payment method doughnut
  const paymentDoughnutData = {
    labels:
      paymentMethodData.labels.length > 0
        ? paymentMethodData.labels
        : ["Tunai", "QRIS", "Kartu Debit", "Transfer"],
    datasets: [
      {
        data:
          paymentMethodData.data.length > 0
            ? paymentMethodData.data
            : [0, 0, 0, 0],
        backgroundColor: [
          "rgba(139, 92, 246, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0, 0, 0, 0.05)" } },
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

  const statsCards = [
    {
      title: "Total Penjualan",
      value: loading ? "..." : formatCurrency(stats.totalSales),
      change: "Total",
      icon: <LucideDollarSign size={18} />,
      gradient: "from-violet-600 to-purple-700",
    },
    {
      title: "Transaksi",
      value: loading ? "..." : stats.totalOrders.toString(),
      change: "Pesanan",
      icon: <LucideShoppingCart size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Rata-rata Transaksi",
      value: loading ? "..." : formatCurrency(stats.averageOrder),
      change: "Per pesanan",
      icon: <LucideTrendingUp size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Total Pelanggan",
      value: loading ? "..." : stats.uniqueCustomers.toString(),
      change: "Pelanggan",
      icon: <LucideUsers size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <DashboardLayout
      config={{
        title: "Analitik Kasir",
        moduleItems: [
          { label: "Kasir", href: "/admin/pos" },
          { label: "Analitik", href: "/admin/pos/analytics" },
          { label: "Pengaturan", href: "/admin/pos/settings" },
        ],
      }}
    >
      <div className="p-4 mb-15 md:my-0 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-mono">
              Analitik Kasir
            </h1>
            <p className="text-gray-500">Metrik kinerja untuk kasir</p>
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
          {statsCards.map((stat, idx) => (
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

        {/* Sales Chart */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-purple-200 p-4 h-80 flex items-center justify-center">
            <LucideLoader2 className="animate-spin text-purple-600" size={32} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Tren Penjualan</h3>
              <LucideCalendar size={18} className="text-gray-400" />
            </div>
            <div className="h-80">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Top Products & Payment Methods */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">Produk Terlaris</h3>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <LucideLoader2
                  className="animate-spin text-purple-600"
                  size={32}
                />
              </div>
            ) : topProducts.length > 0 ? (
              <div className="h-72">
                <Bar data={topProductsData} options={barOptions} />
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-400">
                Belum ada data produk
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">Metode Pembayaran</h3>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <LucideLoader2
                  className="animate-spin text-purple-600"
                  size={32}
                />
              </div>
            ) : paymentMethodData.data.length > 0 ? (
              <div className="h-72">
                <Doughnut
                  data={paymentDoughnutData}
                  options={doughnutOptions}
                />
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-400">
                Belum ada data pembayaran
              </div>
            )}
          </div>
        </div>

        {/* Hourly Breakdown (if daily) */}
        {period === "daily" && !loading && salesData.sales.length > 0 && (
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">
              Volume Transaksi per Hari
            </h3>
            <div className="space-y-3">
              {salesData.labels.map((label, i) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="w-16 text-sm text-gray-600">{label}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((salesData.sales[i] / Math.max(...salesData.sales)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Rp {(salesData.sales[i] * 1000000).toLocaleString("id-ID")}
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
