// app/dashboard/pos/page.tsx
"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
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
} from "lucide-react";

// Data produk dummy (sama dengan inventory)
const products = [
  {
    id: 1,
    name: "Hijab Rifa",
    price: 85000,
    stock: 120,
    category: "Hijab",
    emoji: "🧕",
  },
  {
    id: 2,
    name: "Ori Mukenah",
    price: 150000,
    stock: 95,
    category: "Mukenah",
    emoji: "🧕",
  },
  {
    id: 3,
    name: "Cargo Loos Pants",
    price: 200000,
    stock: 80,
    category: "Pants",
    emoji: "👖",
  },
  {
    id: 4,
    name: "Sandal Wanita",
    price: 75000,
    stock: 65,
    category: "Footwear",
    emoji: "👡",
  },
  {
    id: 5,
    name: "Tas Ransel",
    price: 250000,
    stock: 45,
    category: "Bags",
    emoji: "🎒",
  },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function PosPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter produk berdasarkan pencarian
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Tambah ke keranjang
  const addToCart = (product: (typeof products)[0]) => {
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
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  // Update quantity
  const updateQuantity = (id: number, delta: number) => {
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
  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Hitung total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // Pajak 10%
  const total = subtotal + tax;

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Pembayaran berhasil! Transaksi telah dicetak.");
      setCart([]);
    }, 1500);
  };

  return (
    <DashboardLayout
      config={{
        title: "Point of Sale",
        moduleItems: [
          { label: "Point of Sale", href: "/admin/pos" },
          { label: "Analytics", href: "/admin/pos/analytics" },
          { label: "Settings", href: "/admin/pos/settings" },
        ],
      }}
    >
      <main className="min-h-screen mb-15 md:my-0 p-4 sm:p-6 space-y-6">
        {/* Statistik Cepat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                  Pendapatan
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1">Rp 2.4JT</p>
              <p className="text-violet-200 text-sm">12 transaksi hari ini</p>
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
                Rp {subtotal.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Customers */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 p-6 text-white sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <LucideUsers size={20} />
                </div>
                6
                <span className="text-amber-100 text-sm font-medium">
                  Pelanggan
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1">8</p>
              <p className="text-amber-200 text-sm">Menunggu layanan</p>
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
              {["All", "Hijab", "Mukenah", "Pants", "Footwear", "Bags"].map(
                (cat, i) => (
                  <button
                    key={cat}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      i === 0
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-600"
                    }`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-gray-50/50 p-4 rounded-2xl hover:transition-all duration-300 cursor-pointer border border-gray-200 hover:border-violet-300 hover:bg-white"
                  onClick={() => addToCart(product)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative">
                    <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {product.emoji}
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
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {product.stock} stok
                    </span>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-500 font-medium">
                    Produk tidak ditemukan
                  </p>
                  <p className="text-gray-400 text-sm">Coba kata kunci lain</p>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Keranjang (1/3) */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-purple-200 flex flex-col h-fit lg:sticky lg:top-6">
            {/* Header Keranjang */}
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
                      {products.find((p) => p.id === item.id)?.emoji || "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Rp {item.price.toLocaleString("id-ID")}
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

            {/* Ringkasan Harga */}
            {cart.length > 0 && (
              <div className="border-t border-purple-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    Subtotal
                  </span>
                  <span className="font-medium">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                    PPN(11%)
                  </span>
                  <span className="font-medium">
                    Rp {tax.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-dashed border-gray-200">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-violet-500 rounded-full" />
                    Total
                  </span>
                  <span className="text-violet-600">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="flex gap-3 mt-4">
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
