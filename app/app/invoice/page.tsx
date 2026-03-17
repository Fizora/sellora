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

// Definisikan tipe status yang mungkin
type InvoiceStatus = "paid" | "pending" | "overdue";

interface Invoice {
  id: string;
  date: string;
  customer: string;
  items: Array<{ name: string; qty: number; price: number }>;
  total: number;
  status: InvoiceStatus; // gunakan tipe union
  paymentMethod: string;
}

// Data dummy dengan tipe eksplisit
const invoices: Invoice[] = [
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
  // ... (data lainnya)
];

const statusColors: Record<InvoiceStatus, string> = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
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

  // Statistik (sama seperti sebelumnya)
  // ...

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{/* ... */}</div>

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
                onChange={(e) =>
                  setFilterStatus(e.target.value as InvoiceStatus | "all")
                }
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
                          statusColors[invoice.status] // sekarang aman karena invoice.status bertipe InvoiceStatus
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Ringkasan Bulanan */}
        {/* ... */}
      </main>
    </DashboardLayout>
  );
}
