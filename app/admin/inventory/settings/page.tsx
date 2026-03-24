"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideSettings,
  LucideBell,
  LucidePackage,
  LucideTag,
  LucideRuler,
  LucideSave,
  LucidePlus,
  LucideTrash2,
  LucideEdit2,
} from "lucide-react";

export default function InventorySettingsPage() {
  // General Settings
  const [defaultTaxRate, setDefaultTaxRate] = useState(11);
  const [currency, setCurrency] = useState("IDR");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Stock Alerts
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [criticalStockThreshold, setCriticalStockThreshold] = useState(5);
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);
  const [alertEmail, setAlertEmail] = useState("admin@sellora.com");

  // Product Settings
  const [defaultUnit, setDefaultUnit] = useState("pcs");
  const [enableAutoCode, setEnableAutoCode] = useState(true);
  const [productCodePrefix, setProductCodePrefix] = useState("PRD");
  const [codeDigits, setCodeDigits] = useState(4);

  // Categories (dummy data)
  const [categories, setCategories] = useState([
    { id: 1, name: "Hijab" },
    { id: 2, name: "Mukenah" },
    { id: 3, name: "Pants" },
    { id: 4, name: "Footwear" },
    { id: 5, name: "Bags" },
  ]);
  const [newCategory, setNewCategory] = useState("");

  // Units (dummy data)
  const [units, setUnits] = useState([
    { id: 1, name: "pcs" },
    { id: 2, name: "pair" },
    { id: 3, name: "set" },
  ]);
  const [newUnit, setNewUnit] = useState("");

  const handleSaveGeneral = () => alert("General settings saved!");
  const handleSaveStockAlerts = () => alert("Stock alert settings saved!");
  const handleSaveProductSettings = () => alert("Product settings saved!");

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        { id: Date.now(), name: newCategory.trim() },
      ]);
      setNewCategory("");
    }
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const addUnit = () => {
    if (newUnit.trim()) {
      setUnits([...units, { id: Date.now(), name: newUnit.trim() }]);
      setNewUnit("");
    }
  };

  const deleteUnit = (id: number) => {
    setUnits(units.filter((u) => u.id !== id));
  };

  return (
    <DashboardLayout
      config={{
        title: "Inventory Settings",
        moduleItems: [
          { label: "Dashboard", href: "/admin/inventory" },
          { label: "Stock", href: "/admin/inventory/stock" },
          { label: "Product", href: "/admin/inventory/product" },
          { label: "Code Product", href: "/admin/inventory/code-product" },
          { label: "Report", href: "/admin/inventory/report" },
          { label: "Settings", href: "/admin/inventory/settings" },
        ],
      }}
    >
      <div className="p-4 my-15 md:my-0 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">
            Inventory Settings
          </h1>
          <p className="text-gray-500">
            Konfigurasi preferensi pengelolaan inventori
          </p>
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
                  Tarif Pajak Default (%)
                </label>
                <input
                  type="number"
                  value={defaultTaxRate}
                  onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mata Uang
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="IDR">IDR (Rp)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format Tanggal
                </label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <button
                onClick={handleSaveGeneral}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Stock Alerts */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideBell size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Peringatan Stok
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batas Stok Rendah
                </label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Beri tahu saat stok turun di bawah angka ini
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batas Stok Kritis
                </label>
                <input
                  type="number"
                  value={criticalStockThreshold}
                  onChange={(e) =>
                    setCriticalStockThreshold(Number(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Peringatan mendesak saat stok kritis
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Aktifkan Peringatan Email
                  </p>
                  <p className="text-sm text-gray-500">
                    Terima notifikasi untuk stok rendah/kritis
                  </p>
                </div>
                <button
                  onClick={() => setEnableEmailAlerts(!enableEmailAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    enableEmailAlerts ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      enableEmailAlerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {enableEmailAlerts && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Peringatan
                  </label>
                  <input
                    type="email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
              <button
                onClick={handleSaveStockAlerts}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Product Settings */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucidePackage size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Pengaturan Produk
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Default
                </label>
                <select
                  value={defaultUnit}
                  onChange={(e) => setDefaultUnit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Buat Kode Produk Otomatis
                  </p>
                  <p className="text-sm text-gray-500">
                    Buat kode produk secara otomatis
                  </p>
                </div>
                <button
                  onClick={() => setEnableAutoCode(!enableAutoCode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    enableAutoCode ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      enableAutoCode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {enableAutoCode && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Awalan Kode Produk
                    </label>
                    <input
                      type="text"
                      value={productCodePrefix}
                      onChange={(e) => setProductCodePrefix(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Digit Kode
                    </label>
                    <input
                      type="number"
                      value={codeDigits}
                      onChange={(e) => setCodeDigits(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min={1}
                      max={10}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Preview: {productCodePrefix}-
                      {String(1).padStart(codeDigits, "0")}
                    </p>
                  </div>
                </>
              )}
              <button
                onClick={handleSaveProductSettings}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Categories Management */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideTag size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Kategori</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nama kategori baru"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={addCategory}
                  className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                  <LucidePlus size={18} />
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <span className="text-gray-900">{cat.name}</span>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded transition"
                    >
                      <LucideTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Units Management */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideRuler size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Satuan</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="Nama satuan baru (mis., kg, box, lusin)"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={addUnit}
                  className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                  <LucidePlus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md"
                  >
                    <span className="text-gray-900">{unit.name}</span>
                    <button
                      onClick={() => deleteUnit(unit.id)}
                      className="p-0.5 text-red-500 hover:bg-red-100 rounded transition"
                    >
                      <LucideTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
