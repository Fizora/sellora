"use client";

// app/admin/invoice/page.tsx
import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucideEye,
  LucideSearch,
  LucideDollarSign,
  LucideClock,
  LucideCheckCircle,
} from "lucide-react";

type InvoiceStatus = "paid" | "pending" | "overdue";

interface Invoice {
  id: string;
  customer: string;
  total: number;
  status: InvoiceStatus;
}

const invoices: Invoice[] = [
  { id: "INV-001", customer: "John Doe", total: 420000, status: "paid" },
  { id: "INV-002", customer: "Jane Smith", total: 200000, status: "pending" },
  { id: "INV-003", customer: "Ahmad Fauzi", total: 370000, status: "overdue" },
  { id: "INV-004", customer: "Siti Aminah", total: 300000, status: "paid" },
  { id: "INV-005", customer: "Budi Santoso", total: 200000, status: "pending" },
];

const statusConfig: Record<InvoiceStatus, { label: string; class: string }> = {
  paid: { label: "Paid", class: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pending", class: "bg-amber-100 text-amber-700" },
  overdue: { label: "Overdue", class: "bg-red-100 text-red-700" },
};

export default function InvoicePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | "all">(
    "all",
  );

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total",
      value: invoices.length,
      change: "Invoices",
      icon: <LucideFileText size={18} />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Paid",
      value: invoices.filter((i) => i.status === "paid").length,
      change: "+3",
      icon: <LucideCheckCircle size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Pending",
      value: invoices.filter((i) => i.status === "pending").length,
      change: "-1",
      icon: <LucideClock size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Revenue",
      value: formatCurrency(
        invoices
          .filter((i) => i.status === "paid")
          .reduce((sum, i) => sum + i.total, 0),
      ),
      change: "+18%",
      icon: <LucideDollarSign size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <DashboardLayout
      config={{
        title: "Invoice",
        moduleItems: [
          { label: "Invoices", href: "/admin/invoice" },
          { label: "Settings", href: "/admin/invoice/settings" },
        ],
      }}
    >
      <div className="p-4 mb-15 md:my-0 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">
            Invoice
          </h1>
          <p className="text-gray-500">Manage customer invoices</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-purple-200 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <LucideSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search invoices..."
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as InvoiceStatus | "all")
              }
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Invoice List */}
          <div className="space-y-2">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {invoice.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{invoice.id}</p>
                    <p className="text-xs text-gray-500">{invoice.customer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">
                    {formatCurrency(invoice.total)}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${statusConfig[invoice.status].class}`}
                  >
                    {statusConfig[invoice.status].label}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-violet-100 text-violet-600 rounded-lg">
                      <LucideEye size={16} />
                    </button>
                    <button className="p-2 hover:bg-emerald-100 text-emerald-600 rounded-lg">
                      <LucideDownload size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredInvoices.length === 0 && (
              <p className="text-center py-8 text-gray-400">
                No invoices found
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
