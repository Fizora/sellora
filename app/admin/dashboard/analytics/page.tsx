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
  LucideTrendingDown,
  LucideCalendar,
} from "lucide-react";
import {
  getSalesStats,
  getMonthlySales,
  getOrders,
  getTopSellingProducts,
  getSalesByPeriod,
  getOrderCountByStatus,
} from "@/lib/sales";
import { getInventoryStats, getCategoryDistribution } from "@/lib/inventory";

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

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "monthly",
  );
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<
    { name: string; totalSold: number }[]
  >([]);
  const [categoryDistribution, setCategoryDistribution] = useState<
    { name: string; count: number }[]
  >([]);
  const [orderStatus, setOrderStatus] = useState({
    completed: 0,
    pending: 0,
    processing: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Reload sales data when period changes
    loadSalesByPeriod();
  }, [period]);

  async function loadData() {
    try {
      setLoading(true);
      const [salesStats, monthly, orders, topProd, categories, orderCounts] =
        await Promise.all([
          getSalesStats(),
          getMonthlySales(),
          getOrders(),
          getTopSellingProducts(5),
          getCategoryDistribution(),
          getOrderCountByStatus(),
        ]);

      setStats({
        totalRevenue: salesStats.totalRevenue,
        totalOrders: salesStats.totalOrders,
        avgOrderValue:
          salesStats.totalOrders > 0
            ? Math.round(salesStats.totalRevenue / salesStats.totalOrders)
            : 0,
        conversionRate:
          orderCounts.completed > 0
            ? Math.round(
                (orderCounts.completed /
                  (orderCounts.completed +
                    orderCounts.pending +
                    orderCounts.processing)) *
                  100 *
                  10,
              ) / 10
            : 0,
      });
      setSalesData(monthly);
      setRecentOrders(orders.slice(0, 10));
      setTopProducts(topProd);
      setCategoryDistribution(categories);
      setOrderStatus(orderCounts);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSalesByPeriod() {
    try {
      const periodData = await getSalesByPeriod(period);
      setSalesData(periodData.data);
    } catch (error) {
      console.error("Error loading sales by period:", error);
    }
  }

  // Helper function to get month name
  const getMonthName = (monthIndex: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[(monthIndex + 12) % 12];
  };

  // Helper function to get day name for the last 7 days
  const getLast7DaysLabels = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
      days.push(dayName);
    }
    return days;
  };

  const salesChartData = {
    labels:
      period === "daily"
        ? getLast7DaysLabels()
        : period === "weekly"
          ? ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"]
          : [
              getMonthName(new Date().getMonth() - 5),
              getMonthName(new Date().getMonth() - 4),
              getMonthName(new Date().getMonth() - 3),
              getMonthName(new Date().getMonth() - 2),
              getMonthName(new Date().getMonth() - 1),
              getMonthName(new Date().getMonth()),
            ],
    datasets: [
      {
        label: "Penjualan",
        data: salesData.length > 0 ? salesData : [0, 0, 0, 0, 0, 0],
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryData = {
    labels:
      categoryDistribution.length > 0
        ? categoryDistribution.map((c) => c.name)
        : ["Tidak ada data"],
    datasets: [
      {
        data:
          categoryDistribution.length > 0
            ? categoryDistribution.map((c) => c.count)
            : [1],
        backgroundColor: [
          "rgba(139, 92, 246, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const topProductsData = {
    labels:
      topProducts.length > 0
        ? topProducts.map((p) => p.name)
        : ["Tidak ada produk"],
    datasets: [
      {
        label: "Terjual (unit)",
        data:
          topProducts.length > 0 ? topProducts.map((p) => p.totalSold) : [0],
        backgroundColor: "rgba(139, 92, 246, 0.6)",
        borderRadius: 8,
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

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0, 0, 0, 0.05)" } },
      x: { grid: { display: false } },
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout
      config={{
        title: "Analytics",
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
              Analytics
            </h1>
            <p className="text-gray-500">
              Analisis mendalam kinerja bisnis Anda
            </p>
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
              Daily
            </button>
            <button
              onClick={() => setPeriod("weekly")}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                period === "weekly"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                period === "monthly"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          <div
            className={`relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 p-6 text-white`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <LucideDollarSign size={18} />
                </div>
                <span className="text-white/80 text-sm font-medium">
                  Total Penjualan
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1">
                {loading ? "..." : formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-sm text-emerald-200">+12.5%</p>
            </div>
          </div>
          <div
            className={`relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 p-6 text-white`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <LucideShoppingCart size={18} />
                </div>
                <span className="text-white/80 text-sm font-medium">
                  Pesanan
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1">
                {loading ? "..." : stats.totalOrders.toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-emerald-200">+8.2%</p>
            </div>
          </div>
          <div
            className={`relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 p-6 text-white`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <LucideTrendingUp size={18} />
                </div>
                <span className="text-white/80 text-sm font-medium">
                  Nilai Pesanan Rata-rata
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1">
                {loading ? "..." : formatCurrency(stats.avgOrderValue)}
              </p>
              <p className="text-sm text-emerald-200">+4.1%</p>
            </div>
          </div>
          <div
            className={`relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 p-6 text-white`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <LucideTrendingUp size={18} />
                </div>
                <span className="text-white/80 text-sm font-medium">
                  Tingkat Konversi
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1">
                {loading ? "..." : stats.conversionRate + "%"}
              </p>
              <p className="text-sm text-emerald-200">+0.5%</p>
            </div>
          </div>
        </div>

        {/* Main Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Tren Penjualan</h3>
              <LucideCalendar size={18} className="text-gray-400" />
            </div>
            <div className="h-64">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">
              Penjualan per Kategori
            </h3>
            <div className="h-64">
              <Doughnut data={categoryData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-purple-200 p-4">
          <h3 className="font-bold text-gray-900 mb-4">
            Top 5 Best Selling Products
          </h3>
          <div className="h-80">
            <Bar data={topProductsData} options={barOptions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
