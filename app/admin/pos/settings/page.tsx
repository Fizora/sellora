"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideSettings,
  LucidePrinter,
  LucideReceipt,
  LucidePercent,
  LucideCreditCard,
  LucideSave,
} from "lucide-react";

export default function PosSettingsPage() {
  const [taxRate, setTaxRate] = useState(11);
  const [discountEnabled, setDiscountEnabled] = useState(true);
  const [defaultDiscount, setDefaultDiscount] = useState(0);
  const [receiptHeader, setReceiptHeader] = useState("Sellora Store");
  const [receiptFooter, setReceiptFooter] = useState(
    "Terima kasih telah berbelanja!",
  );
  const [printerType, setPrinterType] = useState("thermal");
  const [printerIP, setPrinterIP] = useState("192.168.1.100");
  const [printerPort, setPrinterPort] = useState("9100");
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState("cash");
  const [cashDrawerEnabled, setCashDrawerEnabled] = useState(true);

  const handleSaveGeneral = () => {
    alert("General POS settings saved!");
  };

  const handleSaveReceipt = () => {
    alert("Receipt settings saved!");
  };

  const handleSavePrinter = () => {
    alert("Printer settings saved!");
  };

  const handleSavePayment = () => {
    alert("Payment settings saved!");
  };

  return (
    <DashboardLayout
      config={{
        title: "Pengaturan Kasir",
        moduleItems: [
          { label: "Kasir", href: "/admin/pos" },
          { label: "Analitik", href: "/admin/pos/analytics" },
          { label: "Pengaturan", href: "/admin/pos/settings" },
        ],
      }}
    >
      <div className="p-4 mb-15 md:my-0 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Kasir</h1>
          <p className="text-gray-500">Konfigurasi preferensi kasir Anda</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideSettings size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Umum</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarif Pajak (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Diterapkan pada semua penjualan (mis., PPN 11%)
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Aktifkan Diskon</p>
                  <p className="text-sm text-gray-500">
                    Izinkan diskon pada transaksi
                  </p>
                </div>
                <button
                  onClick={() => setDiscountEnabled(!discountEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    discountEnabled ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      discountEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {discountEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diskon Default (%)
                  </label>
                  <input
                    type="number"
                    value={defaultDiscount}
                    onChange={(e) => setDefaultDiscount(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
              <button
                onClick={handleSaveGeneral}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Receipt Settings */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideReceipt size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Struk</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teks Header
                </label>
                <input
                  type="text"
                  value={receiptHeader}
                  onChange={(e) => setReceiptHeader(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teks Footer
                </label>
                <textarea
                  rows={2}
                  value={receiptFooter}
                  onChange={(e) => setReceiptFooter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleSaveReceipt}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Printer Settings */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucidePrinter size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Printer</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Printer
                </label>
                <select
                  value={printerType}
                  onChange={(e) => setPrinterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="thermal">Printer Thermal (ESC/POS)</option>
                  <option value="dotmatrix">Dot Matrix</option>
                  <option value="network">Printer Jaringan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat IP Printer
                </label>
                <input
                  type="text"
                  value={printerIP}
                  onChange={(e) => setPrinterIP(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <input
                  type="text"
                  value={printerPort}
                  onChange={(e) => setPrinterPort(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleSavePrinter}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideCreditCard size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Pembayaran
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metode Pembayaran Default
                </label>
                <select
                  value={defaultPaymentMethod}
                  onChange={(e) => setDefaultPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cash">Tunai</option>
                  <option value="qris">QRIS</option>
                  <option value="debit">Kartu Debit</option>
                  <option value="transfer">Transfer Bank</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Aktifkan Laci Uang
                  </p>
                  <p className="text-sm text-gray-500">
                    Buka laci uang secara otomatis setelah penjualan
                  </p>
                </div>
                <button
                  onClick={() => setCashDrawerEnabled(!cashDrawerEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    cashDrawerEnabled ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      cashDrawerEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <button
                onClick={handleSavePayment}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
