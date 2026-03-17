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

  return (
    <DashboardLayout
      config={{
        title: "Point of Sale",
        moduleItems: [
          { label: "Overview", href: "/dashboard/pos" },
          { label: "Analytics", href: "/dashboard/pos/analytics" },
          { label: "Settings", href: "/dashboard/pos/settings" },
        ],
      }}
    >
      <main className="min-h-screen p-4 space-y-6">
        {/* Statistik Cepat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Today's Sales
            </h3>
            <p className="text-3xl font-bold text-blue-600">Rp 2.4M</p>
            <p className="text-sm text-gray-500 mt-2">12 transactions</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Active Cart
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {cart.length} items
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Rp {subtotal.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Customers
            </h3>
            <p className="text-3xl font-bold text-purple-600">8</p>
            <p className="text-sm text-gray-500 mt-2">Waiting</p>
          </div>
        </div>

        {/* Area POS: Produk + Keranjang */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Daftar Produk (2/3) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Produk</h2>
              <div className="relative w-full sm:w-64">
                <LucideSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 p-4 rounded-xl hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-300 group"
                  onClick={() => addToCart(product)}
                >
                  <div className="text-4xl mb-2">{product.emoji}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <p className="text-blue-600 font-bold mt-1">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Stok: {product.stock}
                  </p>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <p className="col-span-full text-center py-8 text-gray-500">
                  Produk tidak ditemukan
                </p>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Keranjang (1/3) */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col h-[calc(100vh-12rem)] lg:h-auto lg:max-h-[calc(100vh-200px)]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <LucideShoppingCart size={24} /> Keranjang
            </h2>

            {/* Daftar Item */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Keranjang kosong
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Rp {item.price.toLocaleString("id-ID")} x{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <LucideMinus size={16} />
                      </button>
                      <span className="w-6 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <LucidePlus size={16} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded ml-1"
                      >
                        <LucideTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Ringkasan Harga */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Pajak (10%)</span>
                <span>Rp {tax.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition">
                <LucideCreditCard size={20} /> Bayar
              </button>
              <button className="p-3 border border-gray-300 hover:bg-gray-100 rounded-xl transition">
                <LucidePrinter size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
