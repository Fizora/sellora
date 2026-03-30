"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect } from "react";
import {
  LucideShoppingCart,
  LucidePlus,
  LucideMinus,
  LucideTrash2,
  LucideCreditCard,
  LucidePrinter,
  LucideSearch,
  LucideDollarSign,
  LucideUsers,
  LucideTrendingUp,
  LucideCheck,
} from "lucide-react";
import { ProductWithStock, getProducts } from "@/lib/inventory";
import { createOrder, getTodaySales } from "@/lib/sales";
import {
  getPosSettings,
  PosSettings,
  getPaymentMethods,
  PaymentMethod,
} from "@/lib/pos-settings";
import { useToast } from "@/app/components/toast";

interface CartItem {
  id: string;
  code: string;
  name: string;
  price: number;
  quantity: number;
}

export default function PosPage() {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isProcessing, setIsProcessing] = useState(false);
  const [todaySales, setTodaySales] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [posSettings, setPosSettings] = useState<PosSettings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Fetch all data with error handling
      const [productsData, salesData, settingsData, methodsData] =
        await Promise.all([
          getProducts().catch((err) => {
            console.error("Error fetching products:", err);
            return [];
          }),
          getTodaySales().catch((err) => {
            console.error("Error fetching today sales:", err);
            return 0;
          }),
          getPosSettings().catch((err) => {
            console.error("Error fetching POS settings:", err);
            return null;
          }),
          getPaymentMethods().catch((err) => {
            console.error("Error fetching payment methods:", err);
            return [];
          }),
        ]);

      setProducts(productsData);
      setTodaySales(salesData);
      setPosSettings(settingsData);
      setPaymentMethods(methodsData);

      // Set default payment method from settings
      if (settingsData?.default_payment_method) {
        setSelectedPaymentMethod(settingsData.default_payment_method);
      } else if (methodsData.length > 0) {
        // Fallback to first active payment method
        const activeMethod = methodsData.find((m) => m.is_active);
        if (activeMethod) {
          setSelectedPaymentMethod(activeMethod.name.toLowerCase());
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Get unique categories
  const categories: string[] = [
    "All",
    ...new Set(
      products.map((p) => p.category_name).filter((c): c is string => !!c),
    ),
  ];

  // Filter produk
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category_name === selectedCategory;
    return matchesSearch && matchesCategory && p.stock_quantity > 0;
  });

  // Tambah ke keranjang
  const addToCart = (product: ProductWithStock) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          code: product.code,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  // Update quantity
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  // Hapus item
  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Hitung total (harga produk sudah termasuk PPN)
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  // Get tax rate from settings (default 11%)
  const taxRate = posSettings?.tax_rate
    ? parseFloat(posSettings.tax_rate) / 100
    : 0.11;
  // DPP = Subtotal / (1 + taxRate)
  const dpp = subtotal / (1 + taxRate);
  // PPN = Subtotal - DPP
  const ppn = subtotal - dpp;
  const total = subtotal;

  // Handle checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      // Get tax rate from settings (default 11%)
      const taxRate = posSettings?.tax_rate
        ? parseFloat(posSettings.tax_rate) / 100
        : 0.11;

      // Create order in database
      await createOrder({
        customer_name: "Walk-in Customer",
        subtotal: dpp,
        tax_amount: ppn,
        discount_amount: 0,
        total_amount: total,
        payment_method: selectedPaymentMethod,
        payment_status: "paid",
        status: "completed",
        items: cart.map((item) => ({
          product_id: item.id,
          product_code: item.code,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
        })),
      });

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Clear cart
      setCart([]);

      // Refresh data
      loadData();
    } catch (error) {
      console.error("Error processing order:", error);
      alert("Gagal memproses pesanan");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format mata uang Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout
      config={{
        title: "Point of Sale",
        moduleItems: [
          { label: "Kasir", href: "/admin/pos" },
          { label: "Analitik", href: "/admin/pos/analytics" },
          { label: "Pengaturan", href: "/admin/pos/settings" },
        ],
      }}
    >
      <main className="min-h-screen mb-15 md:my-0 p-4 sm:p-6 space-y-6">
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            <LucideCheck size={20} />
            <span className="font-medium">Transaksi berhasil!</span>
          </div>
        )}

        {/* Header */}
        <div className="">
          <h1 className="text-2xl font-bold text-gray-900 font-mono">
            Point of Sale
          </h1>
          <p className="text-gray-500">Kelola dan manajemen kasir Anda</p>
        </div>

        {/* Stats Cards - Real-time data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Today's Sales */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 to-purple-700 p-6 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <LucideDollarSign size={20} />
                </div>
                <span className="text-violet-100 text-sm font-medium">
                  Pendapatan Hari Ini
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1">
                {formatRupiah(todaySales)}
              </p>
              <p className="text-violet-200 text-sm">
                {loading ? "..." : products.length} produk tersedia
              </p>
            </div>
          </div>

          {/* Active Cart */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 p-6 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <LucideShoppingCart size={20} />
                </div>
                <span className="text-emerald-100 text-sm font-medium">
                  Keranjang Aktif
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1">
                {cart.length} items
              </p>
              <p className="text-emerald-200 text-sm">
                {formatRupiah(subtotal)}
              </p>
            </div>
          </div>

          {/* Products Available */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 p-6 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <LucideTrendingUp size={20} />
                </div>
                <span className="text-amber-100 text-sm font-medium">
                  Produk Tersedia
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1">
                {loading
                  ? "..."
                  : products.filter((p) => p.stock_quantity > 0).length}
              </p>
              <p className="text-amber-200 text-sm">
                dari {products.length} total produk
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 p-6 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <LucideCreditCard size={20} />
                </div>
                <span className="text-blue-100 text-sm font-medium">
                  Metode Pembayaran
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1">
                {selectedPaymentMethod === "cash"
                  ? "Tunai"
                  : selectedPaymentMethod === "card"
                    ? "Kartu"
                    : "Transfer"}
              </p>
              <p className="text-blue-200 text-sm">Default dari settings</p>
            </div>
          </div>
        </div>

        {/* Area POS: Produk + Keranjang */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Kolom Kiri: Daftar Produk (2/3) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 border border-purple-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <LucideTrendingUp className="text-violet-600" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Produk</h2>
              </div>
              <div className="relative w-full sm:w-72">
                <LucideSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat || "all"}
                  onClick={() => cat && setSelectedCategory(cat)}
                  disabled={!cat}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-violet-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Memuat produk...
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group bg-gray-50/50 p-4 rounded-2xl hover:transition-all duration-300 cursor-pointer border border-gray-200 hover:border-violet-300 hover:bg-white"
                    onClick={() => addToCart(product)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <div className="w-full h-32 mb-3 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                        <span className="text-5xl">📦</span>
                      </div>
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-violet-600 text-white p-1.5 rounded-full">
                          <LucidePlus size={14} />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-violet-600 font-bold">
                        {formatRupiah(product.price)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          product.stock_quantity > 10
                            ? "bg-emerald-100 text-emerald-700"
                            : product.stock_quantity > 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock_quantity} stok
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 font-medium">
                  {products.length === 0
                    ? "Belum ada produk"
                    : "Produk tidak ditemukan"}
                </p>
                <p className="text-gray-400 text-sm">
                  {products.length === 0
                    ? "Tambahkan produk di menu Inventory"
                    : "Coba kata kunci lain"}
                </p>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Keranjang */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-purple-200 flex flex-col h-fit lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="p-1.5 bg-violet-100 rounded-lg">
                  <LucideShoppingCart size={18} className="text-violet-600" />
                </div>
                Keranjang
              </h2>
              {cart.length > 0 && (
                <span className="bg-violet-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  {cart.length}
                </span>
              )}
            </div>

            {/* Daftar Item */}
            <div className="flex-1 max-h-[400px] overflow-y-auto space-y-3 pr-1 mb-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <LucideShoppingCart size={32} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Keranjang kosong</p>
                  <p className="text-gray-400 text-sm">
                    Klik produk untuk menambahkan
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-gray-50 p-3 rounded-md hover:bg-violet-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatRupiah(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all"
                      >
                        <LucideMinus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all"
                      >
                        <LucidePlus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-all ml-1"
                      >
                        <LucideTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Ringkasan Harga dengan DPP dan PPN */}
            {cart.length > 0 && (
              <div className="border-t border-purple-200 pt-4 space-y-3">
                {/* Subtotal (sudah termasuk PPN) */}
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    Subtotal
                  </span>
                  <span className="font-medium">{formatRupiah(subtotal)}</span>
                </div>

                {/* Dasar Pengenaan Pajak (DPP) */}
                <div className="flex justify-between text-gray-600 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    Dasar Pengenaan Pajak
                  </span>
                  <span className="font-medium">{formatRupiah(dpp)}</span>
                </div>

                {/* PPN dynamic based on settings */}
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                    PPN ({posSettings?.tax_rate || 11}%)
                  </span>
                  <span className="font-medium">{formatRupiah(ppn)}</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-dashed border-gray-200">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-violet-500 rounded-full" />
                    Total
                  </span>
                  <span className="text-violet-600">{formatRupiah(total)}</span>
                </div>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="mt-4 space-y-3">
              {/* Payment Method Selection */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Metode Pembayaran
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.filter((m) => m.is_active).length > 0 ? (
                    paymentMethods
                      .filter((m) => m.is_active)
                      .map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setSelectedPaymentMethod(method.name.toLowerCase())
                          }
                          className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                            selectedPaymentMethod === method.name.toLowerCase()
                              ? "border-violet-600 bg-violet-50 text-violet-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <span className="text-xl">
                            {method.name.toLowerCase().includes("tunai") ||
                            method.name.toLowerCase().includes("cash")
                              ? "💵"
                              : method.name.toLowerCase().includes("kartu") ||
                                  method.name.toLowerCase().includes("card")
                                ? "💳"
                                : method.name
                                      .toLowerCase()
                                      .includes("transfer") ||
                                    method.name.toLowerCase().includes("bank")
                                  ? "🏦"
                                  : method.name.toLowerCase().includes("qris")
                                    ? "📱"
                                    : "💰"}
                          </span>
                          <span className="text-xs font-medium">
                            {method.name}
                          </span>
                        </button>
                      ))
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod("cash")}
                        className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          selectedPaymentMethod === "cash"
                            ? "border-violet-600 bg-violet-50 text-violet-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-xl">💵</span>
                        <span className="text-xs font-medium">Tunai</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod("card")}
                        className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          selectedPaymentMethod === "card"
                            ? "border-violet-600 bg-violet-50 text-violet-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-xl">💳</span>
                        <span className="text-xs font-medium">Kartu</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod("transfer")}
                        className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          selectedPaymentMethod === "transfer"
                            ? "border-violet-600 bg-violet-50 text-violet-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-xl">🏦</span>
                        <span className="text-xs font-medium">Transfer</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isProcessing}
                  className={`flex-1 py-3.5 px-4 rounded-md font-semibold flex items-center justify-center gap-2 transition-all ${
                    cart.length === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isProcessing
                        ? "bg-violet-400 text-white cursor-wait"
                        : "bg-linear-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <LucideCreditCard size={20} />
                      Bayar
                    </>
                  )}
                </button>
                <button className="p-3.5 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-md transition-all flex items-center justify-center">
                  <LucidePrinter size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a3a3a3;
        }
      `}</style>
    </DashboardLayout>
  );
}
