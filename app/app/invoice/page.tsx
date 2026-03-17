// app/dashboard/invoice/page.tsx
"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucideEye,
  LucideFilter,
  LucidePlus,
  LucideSearch,
} from "lucide-react";

// Data dummy invoice dengan produk yang konsisten dari inventory
const invoices = [
  {
    id: "INV-001",
    date: "2024-03-15",
    customer: "John Doe",
    items: [
      { name: "Hijab Rifa", qty: 2, price: 85000 },
      { name: "Tas Ransel", qty: 1, price: 250000 },
    ],
    total: 420000,
    status: "paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV-002",
    date: "2024-03-14",
    customer: "Jane Smith",
    items: [
      { name: "Ori Mukenah", qty: 1, price: 150000 },
      { name: "Sandal Wanita", qty: 3, price: 75000 },
    ],
    total: 375000,
    status: "pending",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "INV-003",
    date: "2024-03-13",
    customer: "Bob Johnson",
    items: [{ name: "Cargo Loos Pants", qty: 2, price: 200000 }],
    total: 400000,
    status: "overdue",
    paymentMethod: "Cash",
  },
  {
    id: "INV-004",
    date: "2024-03-12",
    customer: "Alice Brown",
    items: [
      { name: "Hijab Rifa", qty: 3, price: 85000 },
      { name: "Ori Mukenah", qty: 2, price: 150000 },
    ],
    total: 555000,
    status: "paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV-005",
    date: "2024-03-11",
    customer: "Charlie Wilson",
    items: [
      { name: "Tas Ransel", qty: 2, price: 250000 },
      { name: "Sandal Wanita", qty: 1, price: 75000 },
    ],
    total: 575000,
    status: "pending",
    paymentMethod: "Bank Transfer",
  },
];

const statusColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
};

export default function InvoicePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Statistik
  const totalInvoices = invoices.length;
  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const totalPending = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.total, 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <DashboardLayout
      config={{
        title: "Invoice",
        moduleItems: [
          { label: "Overview", href: "/dashboard/invoice" },
          { label: "Analytics", href: "/dashboard/invoice/analytics" },
          { label: "Settings", href: "/dashboard/invoice/settings" },
        ],
      }}
    >
      <main className="min-h-screen p-4 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Invoices
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalInvoices}</p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Paid</h3>
            <p className="text-3xl font-bold text-green-600">
              Rp {totalPaid.toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {invoices.filter((i) => i.status === "paid").length} invoices
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pending
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              Rp {totalPending.toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {invoices.filter((i) => i.status === "pending").length} invoices
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Overdue
            </h3>
            <p className="text-3xl font-bold text-red-600">
              Rp {totalOverdue.toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {invoices.filter((i) => i.status === "overdue").length} invoices
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Daftar Invoice
            </h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <LucideSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari invoice..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                <LucidePlus size={18} /> Invoice Baru
              </button>
            </div>
          </div>

          {/* Tabel Invoice */}
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      Rp {invoice.total.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[invoice.status]
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                          title="Lihat"
                        >
                          <LucideEye size={18} />
                        </button>
                        <button
                          className="p-1 hover:bg-green-100 text-green-600 rounded"
                          title="Download"
                        >
                          <LucideDownload size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Tidak ada invoice yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ringkasan Bulanan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Top Pelanggan
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Jane Smith</span>
                <span className="font-semibold">Rp 375K</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bob Johnson</span>
                <span className="font-semibold">Rp 400K</span>
              </div>
              <div className="flex justify-between items-center">
                <span>John Doe</span>
                <span className="font-semibold">Rp 420K</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Metode Pembayaran
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>💳 Credit Card</span>
                <span className="font-semibold">2 invoices</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🏦 Bank Transfer</span>
                <span className="font-semibold">2 invoices</span>
              </div>
              <div className="flex justify-between items-center">
                <span>💵 Cash</span>
                <span className="font-semibold">1 invoice</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tren Pembayaran
            </h3>
            <div className="flex items-end gap-2 h-20">
              <div className="flex-1 bg-blue-200 h-12 rounded-t-lg"></div>
              <div className="flex-1 bg-blue-300 h-16 rounded-t-lg"></div>
              <div className="flex-1 bg-blue-400 h-8 rounded-t-lg"></div>
              <div className="flex-1 bg-blue-500 h-20 rounded-t-lg"></div>
              <div className="flex-1 bg-blue-600 h-14 rounded-t-lg"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Minggu 1-5 Maret
            </p>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
