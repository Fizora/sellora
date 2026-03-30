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
  LucideFileText,
  LucideDollarSign,
  LucideTrendingUp,
  LucideCalendar,
  LucideUsers,
  LucideClock,
  LucideAlertTriangle,
  LucideLoader2,
  LucideCheckCircle,
} from "lucide-react";
import {
  getInvoiceSalesByPeriod,
  getInvoiceTopCustomers,
  getInvoiceStatusDistribution,
  getInvoiceStats,
  SalesByPeriod,
  TopCustomer,
} from "@/lib/invoice-settings";

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
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesByPeriod>({
    labels: [],
    sales: [],
    orders: [],
  });
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [statusDistribution, setStatusDistribution] = useState({
    paid: 0,
    pending: 0,
    partial: 0,
    overdue: 0,
    debt: 0,
  });
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    partialInvoices: 0,
    debtInvoices: 0,
    totalRevenue: 0,
    paidRevenue: 0,
    pendingRevenue: 0,
    partialRevenue: 0,
    debtRevenue: 0,
    averageInvoiceValue: 0,
  });

  useEffect(() => {
    loadData();
  }, [period]);

  async function loadData() {
    try {
      setLoading(true);
      const [sales, customers, status, invoiceStats] = await Promise.all([
        getInvoiceSalesByPeriod(period),
        getInvoiceTopCustomers(5),
        getInvoiceStatusDistribution(),
        getInvoiceStats(),
      ]);
      setSalesData(sales);
      setTopCustomers(customers);
      setStatusDistribution(status);
      setStats(invoiceStats);
    } catch (error) {
      console.error("Error loading invoice analytics:", error);
      // Use empty defaults on error
      setSalesData({ labels: [], sales: [], orders: [] });
      setTopCustomers([]);
      setStatusDistribution({
        paid: 0,
        pending: 0,
        partial: 0,
        overdue: 0,
        debt: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const invoiceTrendData = {
    labels: salesData.labels,
    datasets: [
      {
        label: "Jumlah Invoice",
        data: salesData.orders,
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Revenue (Juta Rp)",
        data: salesData.sales,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
      },
    ],
  };

  const statusDistributionData = {
    labels: ["Lunas", "Tertunda", "Dibayar Sebagian", "Jatuh Tempo", "Ngutang"],
    datasets: [
      {
        data: [
          statusDistribution.paid,
          statusDistribution.pending,
          statusDistribution.partial,
          statusDistribution.overdue,
          statusDistribution.debt,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const topCustomersData = {
    labels: topCustomers.map((c) => c.name),
    datasets: [
      {
        label: "Total Belanja (Juta Rp)",
        data: topCustomers.map((c) => c.total),
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

  const statsCards = [
    {
      title: "Total Faktur",
      value: loading ? "..." : stats.totalInvoices,
      change: "Invoices",
      icon: <LucideFileText size={18} />,
      gradient: "from-violet-600 to-purple-700",
    },
    {
      title: "Faktur Lunas",
      value: loading ? "..." : stats.paidInvoices,
      change: "Lunas",
      icon: <LucideCheckCircle size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Faktur Tertunda",
      value: loading ? "..." : stats.pendingInvoices,
      change: "Tertunda",
      icon: <LucideClock size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Faktur Dibayar Sebagian",
      value: loading ? "..." : stats.partialInvoices,
      change: "Sebagian",
      icon: <LucideAlertTriangle size={18} />,
      gradient: "from-blue-500 to-blue-600",
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
                <p className="text-sm text-white/70">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LucideLoader2 className="animate-spin text-purple-600" size={32} />
          </div>
        ) : (
          <>
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
                  {topCustomers.length > 0 ? (
                    <Bar data={topCustomersData} options={barOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Data tidak tersedia
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
