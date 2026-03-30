"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect } from "react";
import {
  LucideSettings,
  LucidePrinter,
  LucideReceipt,
  LucideCreditCard,
  LucideSave,
  LucideLoader2,
  LucidePlus,
  LucideEdit2,
  LucideTrash2,
  LucideX,
  LucideCheck,
} from "lucide-react";
import {
  getPosSettings,
  updatePosSettings,
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  PaymentMethod,
} from "@/lib/pos-settings";
import { useToast } from "@/app/components/toast";

export default function PosSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const { showToast } = useToast();

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [newMethodName, setNewMethodName] = useState("");

  // Form state
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

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const [settingsData, methodsData] = await Promise.all([
        getPosSettings(),
        getPaymentMethods(),
      ]);

      setTaxRate(Number(settingsData.tax_rate) || 11);
      setDiscountEnabled(settingsData.discount_enabled === "true");
      setDefaultDiscount(Number(settingsData.default_discount) || 0);
      setReceiptHeader(settingsData.receipt_header || "Sellora Store");
      setReceiptFooter(
        settingsData.receipt_footer || "Terima kasih telah berhati!",
      );
      setPrinterType(settingsData.printer_type || "thermal");
      setPrinterIP(settingsData.printer_ip || "192.168.1.100");
      setPrinterPort(settingsData.printer_port || "9100");
      setDefaultPaymentMethod(settingsData.default_payment_method || "cash");
      setCashDrawerEnabled(settingsData.cash_drawer_enabled === "true");
      setPaymentMethods(methodsData);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }

  // Payment Methods CRUD
  const handleAddPaymentMethod = async () => {
    if (!newMethodName.trim()) return;

    try {
      await createPaymentMethod(newMethodName.trim());
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
      setNewMethodName("");
      setShowAddMethod(false);
      showToast("success", "Metode pembayaran berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding payment method:", error);
      showToast("error", "Gagal menambahkan metode pembayaran");
    }
  };

  const handleUpdatePaymentMethod = async (method: PaymentMethod) => {
    try {
      await updatePaymentMethod(method.id, method.name, method.is_active);
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
      setEditingMethod(null);
      showToast("success", "Metode pembayaran berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating payment method:", error);
      showToast("error", "Gagal memperbarui metode pembayaran");
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus metode pembayaran ini?"))
      return;

    try {
      await deletePaymentMethod(id);
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
      showToast("success", "Metode pembayaran berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting payment method:", error);
      showToast("error", "Gagal menghapus metode pembayaran");
    }
  };

  const handleSaveGeneral = async () => {
    try {
      setSaving(true);
      setSavingSection("general");
      await updatePosSettings({
        tax_rate: String(taxRate),
        discount_enabled: String(discountEnabled),
        default_discount: String(defaultDiscount),
      });
      showToast("success", "Pengaturan umum berhasil disimpan!");
    } catch (error) {
      console.error("Error saving:", error);
      showToast("error", "Gagal menyimpan pengaturan umum");
    } finally {
      setSaving(false);
      setSavingSection(null);
    }
  };

  const handleSaveReceipt = async () => {
    try {
      setSaving(true);
      setSavingSection("receipt");
      await updatePosSettings({
        receipt_header: receiptHeader,
        receipt_footer: receiptFooter,
      });
      showToast("success", "Pengaturan struk berhasil disimpan!");
    } catch (error) {
      console.error("Error saving:", error);
      showToast("error", "Gagal menyimpan pengaturan struk");
    } finally {
      setSaving(false);
      setSavingSection(null);
    }
  };

  const handleSavePrinter = async () => {
    try {
      setSaving(true);
      setSavingSection("printer");
      await updatePosSettings({
        printer_type: printerType,
        printer_ip: printerIP,
        printer_port: printerPort,
      });
      showToast("success", "Pengaturan printer berhasil disimpan!");
    } catch (error) {
      console.error("Error saving:", error);
      showToast("error", "Gagal menyimpan pengaturan printer");
    } finally {
      setSaving(false);
      setSavingSection(null);
    }
  };

  const handleSavePayment = async () => {
    try {
      setSaving(true);
      setSavingSection("payment");
      await updatePosSettings({
        default_payment_method: defaultPaymentMethod,
        cash_drawer_enabled: String(cashDrawerEnabled),
      });
      showToast("success", "Pengaturan pembayaran berhasil disimpan!");
    } catch (error) {
      console.error("Error saving:", error);
      showToast("error", "Gagal menyimpan pengaturan pembayaran");
    } finally {
      setSaving(false);
      setSavingSection(null);
    }
  };

  if (loading) {
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
        <div className="flex items-center justify-center py-12">
          <LucideLoader2 className="animate-spin text-purple-600" size={32} />
        </div>
      </DashboardLayout>
    );
  }

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">
            Pengaturan Kasir
          </h1>
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
                disabled={saving}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-60"
              >
                {savingSection === "general" ? (
                  <LucideLoader2 size={16} className="animate-spin" />
                ) : (
                  <LucideSave size={16} />
                )}
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
                disabled={saving}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-60"
              >
                {savingSection === "receipt" ? (
                  <LucideLoader2 size={16} className="animate-spin" />
                ) : (
                  <LucideSave size={16} />
                )}
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
                disabled={saving}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-60"
              >
                {savingSection === "printer" ? (
                  <LucideLoader2 size={16} className="animate-spin" />
                ) : (
                  <LucideSave size={16} />
                )}
                Save Changes
              </button>
            </div>
          </div>

          {/* Payment Settings - with CRUD */}
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
              {/* Payment Methods List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Metode Pembayaran
                  </label>
                  <button
                    onClick={() => setShowAddMethod(true)}
                    className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
                  >
                    <LucidePlus size={14} /> Tambah
                  </button>
                </div>

                {/* Add new method form */}
                {showAddMethod && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newMethodName}
                      onChange={(e) => setNewMethodName(e.target.value)}
                      placeholder="Nama metode pembayaran"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddPaymentMethod()
                      }
                    />
                    <button
                      onClick={handleAddPaymentMethod}
                      className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      <LucideCheck size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setShowAddMethod(false);
                        setNewMethodName("");
                      }}
                      className="p-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
                    >
                      <LucideX size={16} />
                    </button>
                  </div>
                )}

                {/* Payment methods list */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      {editingMethod?.id === method.id ? (
                        <div className="flex gap-2 w-full">
                          <input
                            type="text"
                            value={editingMethod.name}
                            onChange={(e) =>
                              setEditingMethod({
                                ...editingMethod,
                                name: e.target.value,
                              })
                            }
                            className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                          />
                          <button
                            onClick={() =>
                              handleUpdatePaymentMethod(editingMethod)
                            }
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <LucideCheck size={16} />
                          </button>
                          <button
                            onClick={() => setEditingMethod(null)}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                          >
                            <LucideX size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-gray-700">
                            {method.name}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingMethod(method)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <LucideEdit2 size={14} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeletePaymentMethod(method.id)
                              }
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <LucideTrash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {paymentMethods.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-2">
                      Belum ada metode pembayaran
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metode Pembayaran Default
                </label>
                <select
                  value={defaultPaymentMethod}
                  onChange={(e) => setDefaultPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.name.toLowerCase()}>
                      {method.name}
                    </option>
                  ))}
                  <option value="cash">Tunai</option>
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
                disabled={saving}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-60"
              >
                {savingSection === "payment" ? (
                  <LucideLoader2 size={16} className="animate-spin" />
                ) : (
                  <LucideSave size={16} />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
