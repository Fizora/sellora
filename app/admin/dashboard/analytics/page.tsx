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
  LucideDollarSign,
  LucideShoppingCart,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideCalendar,
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

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "monthly",
  );

  // Data dummy berdasarkan periode
  const getSalesData = () => {
    if (period === "daily") {
      return {
        labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
        data: [12, 19, 15, 17, 24, 28, 22],
      };
    } else if (period === "weekly") {
      return {
        labels: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"],
        data: [85, 92, 110, 125],
      };
    } else {
      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ],
        data: [65, 78, 90, 85, 92, 88, 95, 102, 110, 105, 115, 125],
      };
    }
  };

  const salesData = getSalesData();

  const salesChartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: "Penjualan",
        data: salesData.data,
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryData = {
    labels: ["Hijab", "Mukenah", "Pants", "Footwear", "Bags"],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
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
    labels: [
      "Hijab Rifa",
      "Ori Mukenah",
      "Cargo Loos Pants",
      "Sandal Wanita",
      "Tas Ransel",
    ],
    datasets: [
      {
        label: "Terjual (unit)",
        data: [125, 98, 76, 54, 32],
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

  const stats = [
    {
      title: "Total Sales",
      value: "Rp 50.4M",
      change: "+12.5%",
      icon: <LucideDollarSign size={18} />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Orders",
      value: "1,245",
      change: "+8.2%",
      icon: <LucideShoppingCart size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "AOV",
      value: "Rp 40,500",
      change: "+4.1%",
      icon: <LucideTrendingUp size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.5%",
      icon: <LucideTrendingUp size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <DashboardLayout
      config={{
        title: "Analytics",
        moduleItems: [
          { label: "Overview", href: "/admin/dashboard" },
          { label: "Analytics", href: "/admin/dashboard/analytics" },
          { label: "Reports", href: "/admin/dashboard/all-report" },
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
              Deep dive into your business performance
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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

        {/* Main Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Sales Trend</h3>
              <LucideCalendar size={18} className="text-gray-400" />
            </div>
            <div className="h-64">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">Sales by Category</h3>
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

        {/* Additional Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">
              Customer Acquisition
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Customers</span>
                <span className="font-bold text-gray-900">+156</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-3/4"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Returning Customers</span>
                <span className="font-bold text-gray-900">+89</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">Revenue by Device</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile</span>
                <span className="font-bold text-gray-900">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-[65%]"></div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Desktop</span>
                <span className="font-bold text-gray-900">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-[30%]"></div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tablet</span>
                <span className="font-bold text-gray-900">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-[5%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
