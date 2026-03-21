"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideTag,
  LucidePlus,
  LucideSearch,
  LucideEdit2,
  LucideTrash2,
  LucidePackage,
} from "lucide-react";

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  createdAt: string;
}

const initialProducts: Product[] = [
  {
    id: "1",
    code: "HJF",
    name: "Hijab Rifa",
    category: "Hijab",
    price: 85000,
    unit: "pcs",
    description: "Hijab berkualitas tinggi",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    code: "MKN",
    name: "Ori Mukenah",
    category: "Mukenah",
    price: 150000,
    unit: "pcs",
    description: "Mukenah original",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    code: "CPG",
    name: "Cargo Loos Pants",
    category: "Pants",
    price: 200000,
    unit: "pcs",
    description: "Celana cargo kekinian",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    code: "SDL",
    name: "Sandal Wanita",
    category: "Footwear",
    price: 75000,
    unit: "pair",
    description: "Sandal nyaman untuk sehari-hari",
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    code: "TSR",
    name: "Tas Ransel",
    category: "Bags",
    price: 250000,
    unit: "pcs",
    description: "Tas ransel berkualitas",
    createdAt: "2024-02-15",
  },
];

export default function ProductPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products] = useState<Product[]>(initialProducts);

  const filteredProducts = products.filter(
    (product) =>
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  const stats = [
    {
      title: "Total Product",
      value: totalProducts,
      change: "Products",
      icon: <LucideTag size={18} />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Total Nilai",
      value: `Rp ${totalValue.toLocaleString("id-ID")}`,
      change: "+5%",
      icon: <LucidePackage size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Categories",
      value: "5",
      change: "+1",
      icon: <LucideTag size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <DashboardLayout
      config={{
        title: "Inventory | Product",
        moduleItems: [
          { label: "Dashboard", href: "/admin/inventory" },
          { label: "Stock", href: "/admin/inventory/stock" },
          { label: "Product", href: "/admin/inventory/product" },
          { label: "Code Product", href: "/admin/inventory/code-product" },
          { label: "Report", href: "/admin/inventory/report" },
        ],
      }}
    >
      <main className="min-h-screen p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
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

        {/* Product Table */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-purple-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Data Product
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <LucideSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari product..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-md transition-all">
                <LucidePlus size={18} />
                Tambah Product
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
                    Nama Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Deskripsi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.code}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.unit}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {product.description}
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
