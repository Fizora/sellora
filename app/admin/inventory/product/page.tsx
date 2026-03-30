"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect } from "react";
import {
  LucideTag,
  LucidePlus,
  LucideSearch,
  LucideEdit2,
  LucideTrash2,
  LucidePackage,
  LucideX,
  LucideSave,
  LucideAlertCircle,
} from "lucide-react";
import {
  ProductWithStock,
  ProductCode,
  Category,
  Unit,
  getProducts,
  getCategories,
  getUnits,
  getProductCodes,
  createProduct,
  createProductCode,
  updateProduct,
  deleteProduct,
} from "@/lib/inventory";

export default function ProductPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [codeProducts, setCodeProducts] = useState<ProductCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithStock | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category_id: "",
    unit_id: "",
    price: 0,
    cost_price: 0,
    description: "",
    min_quantity: 10,
    critical_quantity: 5,
    code_product_id: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  // Update loadData to also fetch code products
  const loadCodeProducts = async () => {
    try {
      const codes = await getProductCodes();
      setCodeProducts(codes);
    } catch (error) {
      console.error("Error loading code products:", error);
    }
  };

  async function loadData() {
    try {
      setLoading(true);
      const [productsData, categoriesData, unitsData, codeProductsData] =
        await Promise.all([
          getProducts(),
          getCategories(),
          getUnits(),
          getProductCodes(),
        ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setUnits(unitsData);
      setCodeProducts(codeProductsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false),
  );

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.stock_quantity,
    0,
  );
  const totalCategories = categories.length;

  const stats = [
    {
      title: "Total Produk",
      value: totalProducts,
      change: "Produk",
      icon: <LucideTag size={18} />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Total Nilai",
      value: `Rp ${totalValue.toLocaleString("id-ID")}`,
      change: "Nilai Stok",
      icon: <LucidePackage size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Kategori",
      value: totalCategories,
      change: "Kategori",
      icon: <LucideTag size={18} />,
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  function openCreateModal() {
    // Generate new code
    const prefix = "PRD";
    const num = products.length + 1;
    const newCode = `${prefix}-${String(num).padStart(4, "0")}`;

    setFormData({
      code: newCode,
      name: "",
      category_id: "",
      unit_id: units[0]?.id || "",
      price: 0,
      cost_price: 0,
      description: "",
      min_quantity: 10,
      critical_quantity: 5,
      code_product_id: "",
    });
    setEditingProduct(null);
    setShowModal(true);
  }

  function openEditModal(product: ProductWithStock) {
    // Find the linked product code
    const linkedCode = codeProducts.find((pc) => pc.product_id === product.id);
    setFormData({
      code: product.code,
      name: product.name,
      category_id: product.category_id || "",
      unit_id: product.unit_id || "",
      price: product.price,
      cost_price: product.cost_price || 0,
      description: product.description || "",
      min_quantity: product.min_quantity,
      critical_quantity: product.critical_quantity,
      code_product_id: linkedCode?.id || "",
    });
    setEditingProduct(product);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      let productId: string;

      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          code: formData.code,
          name: formData.name,
          category_id: formData.category_id || undefined,
          unit_id: formData.unit_id || undefined,
          price: formData.price,
          cost_price: formData.cost_price,
          description: formData.description || undefined,
        });
        productId = editingProduct.id;
      } else {
        const newProduct = await createProduct({
          code: formData.code,
          name: formData.name,
          category_id: formData.category_id || undefined,
          unit_id: formData.unit_id || undefined,
          price: formData.price,
          cost_price: formData.cost_price,
          description: formData.description || undefined,
          stock_quantity: 0,
          min_quantity: formData.min_quantity,
          critical_quantity: formData.critical_quantity,
        });
        productId = newProduct.id;
      }

      // Update the product code to link to this product
      if (formData.code_product_id) {
        const { updateProductCode } = await import("@/lib/inventory");
        await updateProductCode(formData.code_product_id, {
          product_id: productId,
        });
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Gagal menyimpan produk");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id);
      setShowDeleteConfirm(null);
      loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk");
    }
  }

  const getStockStatusStyle = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-700";
      case "low":
        return "bg-amber-100 text-amber-700";
      case "critical":
        return "bg-red-100 text-red-700";
      case "out":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Tersedia";
      case "low":
        return "Stok Rendah";
      case "critical":
        return "Kritis";
      case "out":
        return "Habis";
      default:
        return status;
    }
  };

  return (
    <DashboardLayout
      config={{
        title: "Inventory | Product",
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
                <p className="text-sm text-emerald-200">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Product Table */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-purple-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 font-mono">
              Data Produk
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <LucideSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={openCreateModal}
                className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-md transition-all hover:opacity-90"
              >
                <LucidePlus size={18} />
                Tambah Produk
              </button>
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
                      Kode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nama Produk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stok
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Harga
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.code}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          {product.category_name || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {product.stock_quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        Rp {product.price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.unit_name || "pcs"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatusStyle(product.stock_status)}`}
                        >
                          {getStockStatusLabel(product.stock_status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 hover:bg-purple-100 text-purple-600 rounded-lg transition"
                            title="Edit"
                          >
                            <LucideEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(product.id)}
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
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? "Tidak ada produk yang cocok"
                    : "Belum ada produk"}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProduct ? "Edit Produk" : "Tambah Produk"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <LucideX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Produk (Barcode/SKU)
                  </label>
                  <select
                    value={formData.code_product_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code_product_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Tidak ada</option>
                    {codeProducts
                      .filter((pc) => !pc.product_id) // Only available codes
                      .map((pc) => (
                        <option key={pc.id} value={pc.id}>
                          {pc.code} {pc.barcode ? `(${pc.barcode})` : ""}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit_id}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Pilih Unit</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Jual
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Pokok
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cost_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cost_price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min. Stok
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.min_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_quantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok Kritis
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.critical_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        critical_quantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                  <LucideSave size={18} />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <LucideAlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Hapus Produk?
                </h3>
                <p className="text-sm text-gray-500">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
