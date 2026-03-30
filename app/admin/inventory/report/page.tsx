"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect, useRef } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucidePackage,
  LucideSearch,
  LucideX,
  LucidePrinter,
} from "lucide-react";
import {
  ProductWithStock,
  getProducts,
  getStockHistory,
  StockHistory,
} from "@/lib/inventory";
import * as XLSX from "xlsx";

export default function InventoryReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [productsData, stockData] = await Promise.all([
        getProducts(),
        getStockHistory(),
      ]);
      setProducts(productsData);
      setStockHistory(stockData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filter stock history
  const stockInData = stockHistory.filter((item) => item.type === "in");
  const stockOutData = stockHistory.filter((item) => item.type === "out");

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(products.map((item) => item.category_name).filter(Boolean)),
  ];

  // Filter data based on search, category, and status
  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category_name === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.stock_status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stock values for each product
  const getProductStockData = (productId: string) => {
    const qtyOut = stockOutData
      .filter((s) => s.product_id === productId)
      .reduce((sum, s) => sum + s.quantity, 0);
    const qtyIn = stockInData
      .filter((s) => s.product_id === productId)
      .reduce((sum, s) => sum + s.quantity, 0);
    const currentStock =
      products.find((p) => p.id === productId)?.stock_quantity || 0;
    const initialStock = currentStock - qtyIn + qtyOut;
    return { qtyOut, qtyIn, initialStock, currentStock };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-orange-100 text-orange-800";
      case "out":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Tersedia";
      case "low":
        return "Rendah";
      case "critical":
        return "Kritis";
      case "out":
        return "Habis";
      default:
        return status;
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const data = filteredProducts.map((product, index) => {
      const { qtyOut, initialStock, currentStock } = getProductStockData(
        product.id,
      );

      return {
        No: index + 1,
        "Kode Produk": product.code,
        Produk: product.name,
        "Qty Awal": initialStock,
        "Qty Keluar": qtyOut,
        "Stok Saat Ini": currentStock,
        HPP: product.cost_price || 0,
        "Harga Jual": product.price || 0,
        "Minimum Stock": product.min_quantity || 0,
        Status: getStatusLabel(product.stock_status),
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "laporan-inventory.xlsx");
  };

  // Print functions
  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const confirmPrint = () => {
    setShowPrintModal(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <DashboardLayout
      config={{
        title: "Inventory Report",
        moduleItems: [
          { label: "Ringkasan", href: "/admin/inventory" },
          { label: "Stok", href: "/admin/inventory/stock" },
          { label: "Produk", href: "/admin/inventory/product" },
          { label: "Kode Produk", href: "/admin/inventory/code-product" },
          { label: "Laporan", href: "/admin/inventory/report" },
          { label: "Pengaturan", href: "/admin/inventory/settings" },
        ],
      }}
    >
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          table {
            font-size: 10px;
          }
          th {
            color: #dc2626 !important;
            background-color: #fef2f2 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="p-4 mb-15 md:my-0 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-mono">
              Laporan Inventory
            </h1>
            <p className="text-gray-500">
              Data stok barang dan status ketersediaan
            </p>
          </div>
          <div className="flex gap-2 no-print">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50 transition"
            >
              <LucidePrinter size={16} />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50 transition"
            >
              <LucideDownload size={16} />
              Excel
            </button>
          </div>
        </div>

        {/* Filter dan Pencarian */}
        <div className="bg-white rounded-2xl border border-purple-200 p-4 space-y-4 no-print">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cari
              </label>
              <div className="relative">
                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ID atau nama barang..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Kategori */}
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "Semua" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Stok
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Semua</option>
                <option value="available">Tersedia</option>
                <option value="low">Stok Rendah</option>
                <option value="critical">Kritis</option>
                <option value="out">Habis</option>
              </select>
            </div>

            {/* Tombol Reset */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition"
            >
              <LucideX size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Tabel Inventory */}
        <div
          ref={reportRef}
          className="bg-white rounded-2xl border border-purple-200 p-6 print-area"
        >
          <div className="flex items-center gap-3 mb-4 no-print">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LucidePackage size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Ringkasan Inventory
            </h2>
            <span className="ml-auto text-sm text-gray-500">
              {filteredProducts.length} item
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                      No
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                      Kode Produk
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                      Produk
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                      Qty Awal
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                      Qty Keluar
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                      Stok Saat Ini
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                      HPP
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                      Harga Jual
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                      Min Stock
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product, index) => {
                    const { qtyOut, initialStock, currentStock } =
                      getProductStockData(product.id);

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.code}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                          {initialStock}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                          {qtyOut}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                          {currentStock}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(product.cost_price || 0)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(product.price || 0)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                          {product.min_quantity || 0}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(product.stock_status)}`}
                          >
                            {getStatusLabel(product.stock_status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada data yang sesuai dengan filter.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Print Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Konfirmasi Print
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda ingin print laporan ini?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmPrint}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-white font-medium"
                >
                  Ya, Print
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-gray-700"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
