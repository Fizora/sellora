"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideCode,
  LucidePlus,
  LucideSearch,
  LucideEdit2,
  LucideTrash2,
  LucideHash,
} from "lucide-react";

interface CodeProduct {
  id: string;
  code: string;
  productId: string;
  productName: string;
  barcode: string;
  sku: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialCodeProducts: CodeProduct[] = [
  {
    id: "1",
    code: "HJF-001",
    productId: "1",
    productName: "Hijab Rifa",
    barcode: "899999900001",
    sku: "HJF-RIFA-001",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    code: "HJF-002",
    productId: "1",
    productName: "Hijab Rifa",
    barcode: "899999900002",
    sku: "HJF-RIFA-002",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    code: "MKN-001",
    productId: "2",
    productName: "Ori Mukenah",
    barcode: "899999900003",
    sku: "MKN-ORI-001",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    code: "CPG-001",
    productId: "3",
    productName: "Cargo Loos Pants",
    barcode: "899999900004",
    sku: "CPG-CARGO-001",
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "5",
    code: "SDL-001",
    productId: "4",
    productName: "Sandal Wanita",
    barcode: "899999900005",
    sku: "SDL-WANITA-001",
    status: "inactive",
    createdAt: "2024-02-10",
  },
  {
    id: "6",
    code: "TSR-001",
    productId: "5",
    productName: "Tas Ransel",
    barcode: "899999900006",
    sku: "TSR-RANSEL-001",
    status: "active",
    createdAt: "2024-02-15",
  },
];

export default function CodeProductPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [codeProducts] = useState<CodeProduct[]>(initialCodeProducts);

  const filteredCodeProducts = codeProducts.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.includes(searchTerm) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalCodes = codeProducts.length;
  const activeCodes = codeProducts.filter((c) => c.status === "active").length;

  const stats = [
    {
      title: "Total Kode",
      value: totalCodes,
      change: "Codes",
      icon: <LucideCode size={18} />,
      gradient: "from-indigo-500 to-blue-600",
    },
    {
      title: "Kode Aktif",
      value: activeCodes,
      change: "+2",
      icon: <LucideHash size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Kode Nonaktif",
      value: totalCodes - activeCodes,
      change: "-1",
      icon: <LucideCode size={18} />,
      gradient: "from-red-500 to-rose-600",
    },
  ];

  return (
    <DashboardLayout
      config={{
        title: "Inventory | Code",
        moduleItems: [
          { label: "Dashboard", href: "/admin/inventory" },
          { label: "Stock", href: "/admin/inventory/stock" },
          { label: "Product", href: "/admin/inventory/product" },
          { label: "Code Product", href: "/admin/inventory/code-product" },
          { label: "Report", href: "/admin/inventory/report" },
        ],
      }}
    >
      <main className="min-h-screen mb-15 md:my-0 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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

        {/* Code Product Table */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-purple-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 font-mono">
              Data Kode Product
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <LucideSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari kode produk..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-md transition-all">
                <LucidePlus size={18} />
                Tambah Kode
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kode
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Barcode
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCodeProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                      {item.code}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {item.barcode}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 hover:bg-purple-100 text-purple-600 rounded-lg transition"
                          title="Edit"
                        >
                          <LucideEdit2 size={16} />
                        </button>
                        <button
                          className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition"
                          title="Hapus"
                        >
                          <LucideTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
