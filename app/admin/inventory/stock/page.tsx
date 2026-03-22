"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucidePackage,
  LucidePlus,
  LucideSearch,
  LucideEdit2,
  LucideTrash2,
  LucideArrowDownLeft,
  LucideArrowUpRight,
} from "lucide-react";

interface StockItem {
  id: string;
  codeProduct: string;
  productName: string;
  category: string;
  stockIn: number;
  stockOut: number;
  currentStock: number;
  date: string;
  type: "in" | "out";
}

const initialStockData: StockItem[] = [
  {
    id: "1",
    codeProduct: "HJF-001",
    productName: "Hijab Rifa",
    category: "Hijab",
    stockIn: 50,
    stockOut: 10,
    currentStock: 120,
    date: "2024-03-15",
    type: "in",
  },
  {
    id: "2",
    codeProduct: "MKN-001",
    productName: "Ori Mukenah",
    category: "Mukenah",
    stockIn: 30,
    stockOut: 5,
    currentStock: 95,
    date: "2024-03-14",
    type: "in",
  },
  {
    id: "3",
    codeProduct: "CPG-001",
    productName: "Cargo Loos Pants",
    category: "Pants",
    stockIn: 0,
    stockOut: 20,
    currentStock: 80,
    date: "2024-03-13",
    type: "out",
  },
  {
    id: "4",
    codeProduct: "SDL-001",
    productName: "Sandal Wanita",
    category: "Footwear",
    stockIn: 25,
    stockOut: 0,
    currentStock: 65,
    date: "2024-03-12",
    type: "in",
  },
  {
    id: "5",
    codeProduct: "TSR-001",
    productName: "Tas Ransel",
    category: "Bags",
    stockIn: 15,
    stockOut: 5,
    currentStock: 45,
    date: "2024-03-11",
    type: "in",
  },
];

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockData] = useState<StockItem[]>(initialStockData);

  const filteredStock = stockData.filter(
    (item) =>
      item.codeProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalStockIn = stockData.reduce((sum, item) => sum + item.stockIn, 0);
  const totalStockOut = stockData.reduce((sum, item) => sum + item.stockOut, 0);

  const stats = [
    {
      title: "Total Stock",
      value: "405",
      change: "Units",
      icon: <LucidePackage size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Stock In",
      value: totalStockIn,
      change: "+120",
      icon: <LucideArrowDownLeft size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Stock Out",
      value: totalStockOut,
      change: "-40",
      icon: <LucideArrowUpRight size={18} />,
      gradient: "from-red-500 to-rose-600",
    },
  ];

  return (
    <DashboardLayout
      config={{
        title: "Inventory | Stock",
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

        {/* Stock Table */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-purple-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 font-mono">
              Riwayat Stock
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <LucideSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari stock..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-md transition-all">
                <LucidePlus size={18} />
                Tambah Stock
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kode Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nama Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock In
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock Out
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sisa Stock
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
                {filteredStock.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.codeProduct}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      +{item.stockIn}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                      -{item.stockOut}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {item.currentStock}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString("id-ID")}
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
