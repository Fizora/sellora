"use client";

// app/dashboard/page.tsx
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
  LucideTrendingUp,
  LucideShoppingCart,
  LucideUsers,
  LucideDollarSign,
  LucidePackage,
  LucideAlertTriangle,
} from "lucide-react";
import { getInventoryStats, getCategoryDistribution } from "@/lib/inventory";
import { getSalesStats, getOrders, getMonthlySales } from "@/lib/sales";

// Register ChartJS components
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

export default function Dashboard() {
  const [inventoryStats, setInventoryStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalValue: 0,
    lowStock: 0,
    criticalStock: 0,
    outOfStock: 0,
  });
  const [salesStats, setSalesStats] = useState({
    totalOrders: 0,
    todaySales: 0,
    monthSales: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [monthlySalesData, setMonthlySalesData] = useState<number[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<
    { name: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Fetch all data with error handling for each
      const [invStats, sales, orders, monthly, categories] = await Promise.all([
        getInventoryStats().catch((err) => {
          console.error("Error fetching inventory stats:", err);
          return {
            totalProducts: 0,
            totalCategories: 0,
            totalValue: 0,
            lowStock: 0,
            criticalStock: 0,
            outOfStock: 0,
          };
        }),
        getSalesStats().catch((err) => {
          console.error("Error fetching sales stats:", err);
          return {
            totalOrders: 0,
            todaySales: 0,
            monthSales: 0,
            totalRevenue: 0,
          };
        }),
        getOrders().catch((err) => {
          console.error("Error fetching orders:", err);
          return [];
        }),
        getMonthlySales().catch((err) => {
          console.error("Error fetching monthly sales:", err);
          return [];
        }),
        getCategoryDistribution().catch((err) => {
          console.error("Error fetching category distribution:", err);
          return [];
        }),
      ]);

      setInventoryStats(invStats);
      setSalesStats(sales);
      setRecentOrders(orders.slice(0, 5));
      setMonthlySalesData(monthly);
      setCategoryDistribution(categories);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
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

  const monthlySalesChartData = {
    labels: [
      getMonthName(new Date().getMonth() - 5),
      getMonthName(new Date().getMonth() - 4),
      getMonthName(new Date().getMonth() - 3),
      getMonthName(new Date().getMonth() - 2),
      getMonthName(new Date().getMonth() - 1),
      getMonthName(new Date().getMonth()),
    ],
    datasets: [
      {
        label: "Sales",
        data:
          monthlySalesData.length > 0
            ? monthlySalesData
            : [65, 78, 90, 85, 92, 88],
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
        : ["Hijab", "Mukenah", "Pants", "Footwear", "Bags"],
    datasets: [
      {
        data:
          categoryDistribution.length > 0
            ? categoryDistribution.map((c) => c.count)
            : [35, 25, 20, 12, 8],
        backgroundColor: [
          "rgba(139, 92, 246, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(244, 63, 94, 0.8)",
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Penjualan",
      value: loading ? "..." : formatCurrency(salesStats.totalRevenue),
      change: salesStats.totalOrders + " pesanan",
      icon: <LucideDollarSign size={18} />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Penjualan Hari Ini",
      value: loading ? "..." : formatCurrency(salesStats.todaySales),
      change: "Hari ini",
      icon: <LucideShoppingCart size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Bulan Ini",
      value: loading ? "..." : formatCurrency(salesStats.monthSales),
      change: "Total bulan ini",
      icon: <LucideUsers size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Produk",
      value: loading ? "..." : inventoryStats.totalProducts.toString(),
      change: inventoryStats.totalCategories + " kategori",
      icon: <LucidePackage size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Nilai Stok",
      value: loading ? "..." : formatCurrency(inventoryStats.totalValue),
      change: "Total nilai inventori",
      icon: <LucideTrendingUp size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Stok Rendah",
      value: loading
        ? "..."
        : (inventoryStats.lowStock + inventoryStats.criticalStock).toString(),
      change: inventoryStats.outOfStock + " habis",
      icon: <LucideAlertTriangle size={18} />,
      gradient: "from-amber-500 to-orange-600",
      warning: true,
    },
  ];

  const statusStyles: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
  };

  return (
    <DashboardLayout
      config={{
        title: "Dashboard",
        moduleItems: [
          { label: "Ringkasan", href: "/admin/dashboard" },
          { label: "Analitik", href: "/admin/dashboard/analytics" },
          { label: "Laporan", href: "/admin/dashboard/all-report" },
        ],
      }}
    >
      <div className="p-4 mb-15 md:my-0 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">
            Dashboard
          </h1>
          <p className="text-gray-500">Ringkasan bisnis Anda</p>
        </div>

        {/* Stats Cards - Grid */}
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
                <p
                  className={`text-sm ${stat.warning ? "text-amber-200" : "text-emerald-200"}`}
                >
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts - Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl  border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">Tren Penjualan</h3>
            <div className="h-64">
              <Line data={monthlySalesChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">Kategori</h3>
            <div className="h-64">
              {categoryDistribution.length > 0 ? (
                <Doughnut data={categoryData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Tidak ada data kategori
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl  border border-purple-200 overflow-hidden">
          <div className="p-4 border-b border-purple-200">
            <h3 className="font-bold text-gray-900">Pesanan Terbaru</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {(
                        order.customer_name ||
                        order.order_number ||
                        "O"
                      ).charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.customer_name || "Umum"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.order_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        order.payment_status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.payment_status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.payment_status === "paid"
                        ? "Lunas"
                        : order.payment_status === "pending"
                          ? "Pending"
                          : "Belum Bayar"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Belum ada pesanan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
