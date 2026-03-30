"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect, useRef } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucidePackage,
  LucideShoppingCart,
  LucideReceipt,
  LucideLoader2,
  LucidePrinter,
} from "lucide-react";
import { getOrders, Order, OrderItem } from "@/lib/sales";
import {
  getProducts,
  getStockHistory,
  ProductWithStock,
  StockHistory,
} from "@/lib/inventory";
import { getInvoices } from "@/lib/invoice";
import * as XLSX from "xlsx";

export default function AllReportDashboard() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printTarget, setPrintTarget] = useState<string>("");

  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "custom"
  >("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const inventoryRef = useRef<HTMLDivElement>(null);
  const salesRef = useRef<HTMLDivElement>(null);
  const stockInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [productsData, stockData, ordersData, invoicesData] =
        await Promise.all([
          getProducts(),
          getStockHistory(),
          getOrders(),
          getInvoices(),
        ]);

      // Get order items from orders
      const allOrderItems: any[] = [];
      for (const order of ordersData) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: items } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);

        if (items && items.length > 0) {
          items.forEach((item: OrderItem) => {
            allOrderItems.push({
              ...item,
              order_date: order.created_at,
              order_number: order.order_number,
              customer_name: order.customer_name,
              tax_amount: order.tax_amount,
              notes: order.notes,
            });
          });
        }
      }

      setProducts(productsData);
      setStockHistory(stockData);
      setOrders(ordersData);
      setOrderItems(allOrderItems);
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filter stock history
  const stockInData = stockHistory.filter((item) => item.type === "in");
  const stockOutData = stockHistory.filter((item) => item.type === "out");

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Get status label
  const getStockStatusLabel = (status: string) => {
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

  // Get status class
  const getStatusClass = (status: string) => {
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

  // Export to Excel functions
  const exportInventoryExcel = () => {
    const data = products.map((product, index) => {
      const qtyOut = stockOutData
        .filter((s) => s.product_id === product.id)
        .reduce((sum, s) => sum + s.quantity, 0);
      const qtyIn = stockInData
        .filter((s) => s.product_id === product.id)
        .reduce((sum, s) => sum + s.quantity, 0);
      const initialStock = (product.stock_quantity || 0) - qtyIn + qtyOut;

      return {
        No: index + 1,
        "Kode Produk": product.code,
        Produk: product.name,
        "Qty Awal": initialStock,
        "Qty Keluar": qtyOut,
        "Stok Saat Ini": product.stock_quantity || 0,
        HPP: product.cost_price || 0,
        "Harga Jual": product.price || 0,
        "Minimum Stock": product.min_quantity || 0,
        Status: getStockStatusLabel(product.stock_status),
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "laporan-inventory.xlsx");
  };

  const exportSalesExcel = () => {
    const data = orderItems.map((item) => ({
      Tanggal: new Date(item.order_date).toLocaleDateString("id-ID"),
      "No Invoice": item.order_number || "-",
      "Kode Produk": item.product_code || "-",
      Produk: item.product_name || "-",
      Qty: item.quantity,
      Harga: item.unit_price,
      Total: item.subtotal,
      Pajak: 0,
      "Nama Pelanggan": item.customer_name || "Umum",
      Keterangan: item.notes || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Penjualan");
    XLSX.writeFile(wb, "laporan-penjualan.xlsx");
  };

  const exportStockInExcel = () => {
    const data = stockInData.map((item, index) => {
      const product = products.find((p) => p.id === item.product_id);
      const totalValue = (product?.cost_price || 0) * item.quantity;

      return {
        No: index + 1,
        Produk: item.product_name || "-",
        "Kode Produk": item.product_code || "-",
        "Qty Masuk": item.quantity,
        Total: totalValue,
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stok Masuk");
    XLSX.writeFile(wb, "laporan-stok-masuk.xlsx");
  };

  // Print functions
  const handlePrint = (target: string) => {
    setPrintTarget(target);
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
        title: "All Reports",
        moduleItems: [
          { label: "Ringkasan", href: "/admin/dashboard" },
          { label: "Analitik", href: "/admin/dashboard/analytics" },
          { label: "Laporan", href: "/admin/dashboard/all-report" },
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
              Laporan Lengkap
            </h1>
            <p className="text-gray-500">
              {loading
                ? "Memuat data..."
                : "Laporan komprehensif di seluruh modul"}
            </p>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-2xl border border-purple-200 p-4">
          <div className="flex flex-wrap gap-2">
            {["today", "week", "month", "custom"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range as any)}
                className={`px-3 py-1.5 text-sm rounded-md transition ${
                  dateRange === range
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {range === "today"
                  ? "Hari Ini"
                  : range === "week"
                    ? "Minggu Ini"
                    : range === "month"
                      ? "Bulan Ini"
                      : "Kustom"}
              </button>
            ))}
            {dateRange === "custom" && (
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                />
                <span className="text-gray-500">s/d</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LucideLoader2 className="animate-spin text-purple-600" size={32} />
          </div>
        ) : (
          <>
            {/* 1. Inventory Summary */}
            <div
              ref={inventoryRef}
              className={`bg-white rounded-2xl border border-purple-200 p-6 ${printTarget === "inventory" ? "print-area" : ""}`}
            >
              <div className="flex items-center justify-between mb-4 no-print">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <LucidePackage size={20} className="text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Ringkasan Inventory
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrint("inventory")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50 transition text-sm"
                  >
                    <LucidePrinter size={14} /> PDF
                  </button>
                  <button
                    onClick={exportInventoryExcel}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50 transition text-sm"
                  >
                    <LucideDownload size={14} /> Excel
                  </button>
                </div>
              </div>
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
                    {products.length > 0 ? (
                      products.map((product, index) => {
                        const qtyOut = stockOutData
                          .filter((s) => s.product_id === product.id)
                          .reduce((sum, s) => sum + s.quantity, 0);
                        const qtyIn = stockInData
                          .filter((s) => s.product_id === product.id)
                          .reduce((sum, s) => sum + s.quantity, 0);
                        const initialStock =
                          (product.stock_quantity || 0) - qtyIn + qtyOut;

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
                              {product.stock_quantity || 0}
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
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(product.stock_status)}`}
                              >
                                {getStockStatusLabel(product.stock_status)}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={10}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          Tidak ada data produk
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Sales Report */}
            <div
              ref={salesRef}
              className={`bg-white rounded-2xl border border-purple-200 p-6 ${printTarget === "sales" ? "print-area" : ""}`}
            >
              <div className="flex items-center justify-between mb-4 no-print">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <LucideShoppingCart size={20} className="text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Laporan Daftar Penjualan
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrint("sales")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50 transition text-sm"
                  >
                    <LucidePrinter size={14} /> PDF
                  </button>
                  <button
                    onClick={exportSalesExcel}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50 transition text-sm"
                  >
                    <LucideDownload size={14} /> Excel
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                        Tanggal
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                        No Invoice
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                        Kode Produk
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                        Produk
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                        Qty
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                        Harga
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                        Total
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                        Pajak
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                        Nama Pelanggan
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                        Keterangan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderItems.length > 0 ? (
                      orderItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.order_date).toLocaleDateString(
                              "id-ID",
                            )}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.order_number || "-"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.product_code || "-"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {item.product_name || "-"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                            {formatCurrency(item.subtotal)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatCurrency(0)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.customer_name || "Umum"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.notes || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={10}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          Tidak ada data penjualan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Stock In */}
            <div
              ref={stockInRef}
              className={`bg-white rounded-2xl border border-purple-200 p-6 ${printTarget === "stockin" ? "print-area" : ""}`}
            >
              <div className="flex items-center justify-between mb-4 no-print">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <LucideReceipt size={20} className="text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Stok Barang Masuk
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrint("stockin")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50 transition text-sm"
                  >
                    <LucidePrinter size={14} /> PDF
                  </button>
                  <button
                    onClick={exportStockInExcel}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 rounded-md text-purple-600 hover:bg-purple-50 transition text-sm"
                  >
                    <LucideDownload size={14} /> Excel
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                        No
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                        Produk
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-red-700 uppercase">
                        Kode Produk
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                        Qty Masuk
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-bold text-red-700 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockInData.length > 0 ? (
                      stockInData.map((item, index) => {
                        const product = products.find(
                          (p) => p.id === item.product_id,
                        );
                        const totalValue =
                          (product?.cost_price || 0) * item.quantity;

                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.product_name || "-"}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {item.product_code || "-"}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                              +{item.quantity}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                              {formatCurrency(totalValue)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          Tidak ada data stok masuk
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Print Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Konfirmasi Print
              </h3>
              <p className="text-gray-600 mb-6">
                Pilih laporan yang akan diprint:
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setPrintTarget("inventory");
                    confirmPrint();
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition border border-gray-200"
                >
                  Ringkasan Inventory
                </button>
                <button
                  onClick={() => {
                    setPrintTarget("sales");
                    confirmPrint();
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition border border-gray-200"
                >
                  Laporan Daftar Penjualan
                </button>
                <button
                  onClick={() => {
                    setPrintTarget("stockin");
                    confirmPrint();
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition border border-gray-200"
                >
                  Stok Barang Masuk
                </button>
                <button
                  onClick={() => {
                    setPrintTarget("all");
                    confirmPrint();
                  }}
                  className="w-full text-left px-4 py-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition border border-purple-300 text-purple-700 font-medium"
                >
                  Semua Laporan
                </button>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-gray-700"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
