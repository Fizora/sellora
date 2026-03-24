"use client";

// app/dashboard/page.tsx
import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
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
} from "lucide-react";

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
  // Data dummy untuk chart
  const monthlySalesData = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Sales",
        data: [65, 78, 90, 85, 92, 88, 95, 102, 110, 105, 115, 125],
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
      value: "Rp 50.4M",
      change: "+12.5%",
      icon: <LucideDollarSign size={18} />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Pesanan",
      value: "1,245",
      change: "+8.2%",
      icon: <LucideShoppingCart size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Pelanggan",
      value: "892",
      change: "+5.3%",
      icon: <LucideUsers size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Produk",
      value: "3,847",
      change: "-2.1%",
      icon: <LucideTrendingUp size={18} />,
      gradient: "from-blue-500 to-indigo-600",
      negative: true,
    },
  ];

  const recentOrders = [
    {
      id: "#INV-001",
      customer: "John Doe",
      amount: "Rp 420,000",
      status: "completed",
    },
    {
      id: "#INV-002",
      customer: "Jane Smith",
      amount: "Rp 200,000",
      status: "pending",
    },
    {
      id: "#INV-003",
      customer: "Bob Johnson",
      amount: "Rp 75,000",
      status: "processing",
    },
    {
      id: "#INV-004",
      customer: "Alice Brown",
      amount: "Rp 250,000",
      status: "completed",
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
                  className={`text-sm ${stat.negative ? "text-red-200" : "text-emerald-200"}`}
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
              <Line data={monthlySalesData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl  border border-purple-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">Kategori</h3>
            <div className="h-64">
              <Doughnut data={categoryData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl  border border-purple-200 overflow-hidden">
          <div className="p-4 border-b border-purple-200">
            <h3 className="font-bold text-gray-900">Pesanan Terbaru</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {order.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.customer}
                    </p>
                    <p className="text-xs text-gray-500">{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">
                    {order.amount}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
