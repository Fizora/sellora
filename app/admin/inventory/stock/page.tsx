"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect } from "react";
import {
  LucidePackage,
  LucidePlus,
  LucideSearch,
  LucideEdit2,
  LucideTrash2,
  LucideArrowDownLeft,
  LucideArrowUpRight,
  LucideX,
  LucideSave,
  LucideAlertCircle,
} from "lucide-react";
import {
  Stock,
  StockHistory,
  Product,
  getStock,
  getProducts,
  getStockHistory,
  addStockIn,
  addStockOut,
} from "@/lib/inventory";

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [historyData, setHistoryData] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"in" | "out">("in");

  // Form state
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: 0,
    reference: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [stock, productsData, history] = await Promise.all([
        getStock(),
        getProducts(),
        getStockHistory(),
      ]);
      setStockData(stock);
      setProducts(productsData);
      setHistoryData(history);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredStock = stockData.filter(
    (item) =>
      item.product_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalStock = stockData.reduce((sum, item) => sum + item.quantity, 0);
  const stockIn = historyData
    .filter((h) => h.type === "in")
    .reduce((sum, h) => sum + h.quantity, 0);
  const stockOut = historyData
    .filter((h) => h.type === "out")
    .reduce((sum, h) => sum + Math.abs(h.quantity), 0);

  const stats = [
    {
      title: "Total Stok",
      value: totalStock,
      change: "Units",
      icon: <LucidePackage size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Masuk",
      value: stockIn,
      change: "Total In",
      icon: <LucideArrowDownLeft size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Keluar",
      value: stockOut,
      change: "Total Out",
      icon: <LucideArrowUpRight size={18} />,
      gradient: "from-red-500 to-rose-600",
    },
  ];

  function openStockInModal() {
    setModalType("in");
    setFormData({ product_id: "", quantity: 0, reference: "", notes: "" });
    setShowModal(true);
  }

  function openStockOutModal() {
    setModalType("out");
    setFormData({ product_id: "", quantity: 0, reference: "", notes: "" });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (modalType === "in") {
        await addStockIn(
          formData.product_id,
          formData.quantity,
          formData.reference,
          formData.notes,
        );
      } else {
        await addStockOut(
          formData.product_id,
          formData.quantity,
          formData.reference,
          formData.notes,
        );
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Error saving stock:", error);
      alert("Gagal menyimpan data stock");
    }
  }

  const getStockStatusStyle = (
    quantity: number,
    minQty?: number,
    criticalQty?: number,
  ) => {
    if (quantity === 0) return "bg-gray-100 text-gray-700";
    if (criticalQty && quantity <= criticalQty)
      return "bg-red-100 text-red-700";
    if (minQty && quantity <= minQty) return "bg-amber-100 text-amber-700";
    return "bg-emerald-100 text-emerald-700";
  };

  const getStockStatusLabel = (
    quantity: number,
    minQty?: number,
    criticalQty?: number,
  ) => {
    if (quantity === 0) return "Habis";
    if (criticalQty && quantity <= criticalQty) return "Kritis";
    if (minQty && quantity <= minQty) return "Rendah";
    return "Tersedia";
  };

  return (
    <DashboardLayout
      config={{
        title: "Inventory | Stock",
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
                <p className="text-sm text-white/70">{stat.change}</p>
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
              <div className="flex gap-2">
                <button
                  onClick={openStockInModal}
                  className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md transition-all hover:opacity-90"
                >
                  <LucideArrowDownLeft size={18} />
                  Stock In
                </button>
                <button
                  onClick={openStockOutModal}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md transition-all hover:opacity-90"
                >
                  <LucideArrowUpRight size={18} />
                  Stock Out
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Kode Produk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nama Produk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Lokasi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Min. Stok
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stok Kritis
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Sisa Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStock.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.product_code || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.product_name || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.location || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.min_quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.critical_quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatusStyle(item.quantity, item.min_quantity, item.critical_quantity)}`}
                        >
                          {getStockStatusLabel(
                            item.quantity,
                            item.min_quantity,
                            item.critical_quantity,
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStock.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? "Tidak ada data yang cocok"
                    : "Belum ada data stock"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent History */}
        {historyData.length > 0 && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-purple-200">
            <h2 className="text-xl font-semibold text-gray-800 font-mono mb-4">
              Riwayat Terbaru
            </h2>
            <div className="space-y-3">
              {historyData.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${item.type === "in" ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      {item.type === "in" ? (
                        <LucideArrowDownLeft
                          className="text-emerald-600"
                          size={16}
                        />
                      ) : (
                        <LucideArrowUpRight
                          className="text-red-600"
                          size={16}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product_name || "Produk"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.reference_number &&
                          `Ref: ${item.reference_number} • `}
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-bold ${item.type === "in" ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {item.type === "in" ? "+" : "-"}
                    {Math.abs(item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Stock In/Out Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalType === "in"
                  ? "Tambah Stock (In)"
                  : "Kurangi Stock (Out)"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <LucideX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produk
                </label>
                <select
                  required
                  value={formData.product_id}
                  onChange={(e) =>
                    setFormData({ ...formData, product_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Pilih Produk</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.code} - {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Referensi (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  placeholder="Contoh: PO-001, Faktur-123"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md transition ${
                    modalType === "in"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  <LucideSave size={18} />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
