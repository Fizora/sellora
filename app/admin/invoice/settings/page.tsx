"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect } from "react";
import {
  LucideFileText,
  LucideCalendar,
  LucidePercent,
  LucideBuilding,
  LucideMail,
  LucideSave,
  LucideLoader2,
  LucideCheck,
  LucidePlus,
  LucideTrash2,
} from "lucide-react";
import {
  getInvoiceSettings,
  updateInvoiceSettings,
  InvoiceSettings,
} from "@/lib/invoice-settings";

export default function InvoiceSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [settings, setSettings] = useState<InvoiceSettings | null>(null);

  // Invoice Format Settings
  const [invoicePrefix, setInvoicePrefix] = useState("INV");
  const [invoiceStartingNumber, setInvoiceStartingNumber] = useState(1000);
  const [invoiceDigits, setInvoiceDigits] = useState(4);

  // Payment Terms
  const [dueDays, setDueDays] = useState(14);
  const [enableLateFee, setEnableLateFee] = useState(true);
  const [lateFeePercentage, setLateFeePercentage] = useState(2);
  const [lateFeeFixed, setLateFeeFixed] = useState(50000);

  // Tax Settings
  const [taxRate, setTaxRate] = useState(11);
  const [taxName, setTaxName] = useState("PPN");
  const [taxInclusive, setTaxInclusive] = useState(true);

  // Company Info
  const [companyName, setCompanyName] = useState("Sellora Store");
  const [companyAddress, setCompanyAddress] = useState(
    "Jl. Contoh No. 123, Jakarta, Indonesia",
  );
  const [companyPhone, setCompanyPhone] = useState("+62 812 3456 7890");
  const [companyEmail, setCompanyEmail] = useState("admin@sellora.com");
  const [companyTaxId, setCompanyTaxId] = useState("12.345.678.9-123.456");

  // Notification Settings
  const [sendEmailOnInvoiceCreated, setSendEmailOnInvoiceCreated] =
    useState(true);
  const [sendReminderBeforeDue, setSendReminderBeforeDue] = useState(true);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(3);
  const [sendEmailOnPayment, setSendEmailOnPayment] = useState(true);

  // Due Date Periods (like categories in inventory)
  const [dueDatePeriods, setDueDatePeriods] = useState<
    { id: string; days: number; label: string }[]
  >([
    { id: "1", days: 7, label: "7 Hari" },
    { id: "2", days: 14, label: "14 Hari" },
    { id: "3", days: 30, label: "1 Bulan" },
    { id: "4", days: 60, label: "2 Bulan" },
    { id: "5", days: 90, label: "3 Bulan" },
  ]);
  const [newPeriodDays, setNewPeriodDays] = useState("");
  const [newPeriodLabel, setNewPeriodLabel] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await getInvoiceSettings();
      setSettings(data);

      // Set form values
      setInvoicePrefix(data.invoice_prefix);
      setInvoiceStartingNumber(parseInt(data.invoice_starting_number));
      setInvoiceDigits(parseInt(data.invoice_digits));
      setDueDays(parseInt(data.default_due_days));
      setEnableLateFee(data.enable_late_fee === "true");
      setLateFeePercentage(parseInt(data.late_fee_percentage));
      setLateFeeFixed(parseInt(data.late_fee_fixed));
      setTaxRate(parseInt(data.tax_rate));
      setTaxName(data.tax_name);
      setTaxInclusive(data.tax_inclusive === "true");
      setCompanyName(data.company_name);
      setCompanyAddress(data.company_address);
      setCompanyPhone(data.company_phone);
      setCompanyEmail(data.company_email);
      setCompanyTaxId(data.company_tax_id);
      setSendEmailOnInvoiceCreated(
        data.send_email_on_invoice_created === "true",
      );
      setSendReminderBeforeDue(data.send_reminder_before_due === "true");
      setReminderDaysBefore(parseInt(data.reminder_days_before));
      setSendEmailOnPayment(data.send_email_on_payment === "true");
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveInvoiceFormat() {
    try {
      setSaving("format");
      await updateInvoiceSettings({
        invoice_prefix: invoicePrefix,
        invoice_starting_number: String(invoiceStartingNumber),
        invoice_digits: String(invoiceDigits),
      });
      setTimeout(() => setSaving(null), 2000);
    } catch (error) {
      console.error("Error saving:", error);
      setSaving(null);
    }
  }

  async function handleSavePaymentTerms() {
    try {
      setSaving("payment");
      await updateInvoiceSettings({
        default_due_days: String(dueDays),
        enable_late_fee: String(enableLateFee),
        late_fee_percentage: String(lateFeePercentage),
        late_fee_fixed: String(lateFeeFixed),
      });
      setTimeout(() => setSaving(null), 2000);
    } catch (error) {
      console.error("Error saving:", error);
      setSaving(null);
    }
  }

  const handleAddDueDatePeriod = async () => {
    if (!newPeriodDays || !newPeriodLabel) return;
    const days = parseInt(newPeriodDays);
    if (isNaN(days) || days <= 0) {
      alert("Harap masukkan jumlah hari yang valid");
      return;
    }
    const newPeriod = {
      id: Date.now().toString(),
      days,
      label: newPeriodLabel,
    };
    setDueDatePeriods([...dueDatePeriods, newPeriod]);
    setNewPeriodDays("");
    setNewPeriodLabel("");
  };

  const handleDeleteDueDatePeriod = (id: string) => {
    setDueDatePeriods(dueDatePeriods.filter((p) => p.id !== id));
  };

  async function handleSaveTax() {
    try {
      setSaving("tax");
      await updateInvoiceSettings({
        tax_rate: String(taxRate),
        tax_name: taxName,
        tax_inclusive: String(taxInclusive),
      });
      setTimeout(() => setSaving(null), 2000);
    } catch (error) {
      console.error("Error saving:", error);
      setSaving(null);
    }
  }

  async function handleSaveCompany() {
    try {
      setSaving("company");
      await updateInvoiceSettings({
        company_name: companyName,
        company_address: companyAddress,
        company_phone: companyPhone,
        company_email: companyEmail,
        company_tax_id: companyTaxId,
      });
      setTimeout(() => setSaving(null), 2000);
    } catch (error) {
      console.error("Error saving:", error);
      setSaving(null);
    }
  }

  async function handleSaveNotifications() {
    try {
      setSaving("notifications");
      await updateInvoiceSettings({
        send_email_on_invoice_created: String(sendEmailOnInvoiceCreated),
        send_reminder_before_due: String(sendReminderBeforeDue),
        reminder_days_before: String(reminderDaysBefore),
        send_email_on_payment: String(sendEmailOnPayment),
      });
      setTimeout(() => setSaving(null), 2000);
    } catch (error) {
      console.error("Error saving:", error);
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        config={{
          title: "Pengaturan Faktur",
          moduleItems: [
            { label: "Faktur", href: "/admin/invoice" },
            { label: "Analitik", href: "/admin/invoice/analytics" },
            { label: "Pengaturan", href: "/admin/invoice/settings" },
          ],
        }}
      >
        <div className="flex items-center justify-center py-20">
          <LucideLoader2 className="animate-spin text-purple-600" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      config={{
        title: "Pengaturan Faktur",
        moduleItems: [
          { label: "Faktur", href: "/admin/invoice" },
          { label: "Analitik", href: "/admin/invoice/analytics" },
          { label: "Pengaturan", href: "/admin/invoice/settings" },
        ],
      }}
    >
      <div className="p-4 mb-15 md:my-0 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pengaturan Faktur
          </h1>
          <p className="text-gray-500">
            Konfigurasi pembuatan dan pengelolaan faktur
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Invoice Format */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideFileText size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Format Faktur
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Awalan
                </label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., INV"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Awal
                </label>
                <input
                  type="number"
                  value={invoiceStartingNumber}
                  onChange={(e) =>
                    setInvoiceStartingNumber(Number(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Digit Nomor
                </label>
                <input
                  type="number"
                  value={invoiceDigits}
                  onChange={(e) => setInvoiceDigits(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min={1}
                  max={10}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Preview: {invoicePrefix}-
                  {String(invoiceStartingNumber).padStart(invoiceDigits, "0")}
                </p>
              </div>
              <button
                onClick={handleSaveInvoiceFormat}
                disabled={saving === "format"}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
              >
                {saving === "format" ? (
                  <LucideLoader2 className="animate-spin" size={16} />
                ) : saving === "format_completed" ? (
                  <LucideCheck size={16} />
                ) : (
                  <LucideSave size={16} />
                )}
                {saving === "format" ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideCalendar size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Ketentuan Pembayaran
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hari Jatuh Tempo (dari tanggal faktur)
                </label>
                <input
                  type="number"
                  value={dueDays}
                  onChange={(e) => setDueDays(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Aktifkan Denda Keterlambatan
                  </p>
                  <p className="text-sm text-gray-500">
                    Kenakan biaya untuk faktur yang terlambat
                  </p>
                </div>
                <button
                  onClick={() => setEnableLateFee(!enableLateFee)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    enableLateFee ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      enableLateFee ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {enableLateFee && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Denda (% dari total)
                    </label>
                    <input
                      type="number"
                      value={lateFeePercentage}
                      onChange={(e) =>
                        setLateFeePercentage(Number(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Denda Minimum (Tetap)
                    </label>
                    <input
                      type="number"
                      value={lateFeeFixed}
                      onChange={(e) => setLateFeeFixed(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </>
              )}

              {/* Due Date Periods - Like Categories in Inventory */}
              <div className="mt-6 pt-4 border-t border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode Jatuh Tempo
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Tambah periode jatuh tempo untuk dipilih saat membuat faktur
                </p>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newPeriodLabel}
                    onChange={(e) => setNewPeriodLabel(e.target.value)}
                    placeholder="Label (mis. 15 Hari)"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    value={newPeriodDays}
                    onChange={(e) => setNewPeriodDays(e.target.value)}
                    placeholder="Hari"
                    min="1"
                    className="w-20 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleAddDueDatePeriod}
                    disabled={!newPeriodDays || !newPeriodLabel}
                    className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    <LucidePlus size={18} />
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {dueDatePeriods.map((period) => (
                    <div
                      key={period.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm text-gray-900">
                        {period.label} ({period.days} hari)
                      </span>
                      <button
                        onClick={() => handleDeleteDueDatePeriod(period.id)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded transition"
                      >
                        <LucideTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSavePaymentTerms}
                disabled={saving === "payment"}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
              >
                {saving === "payment" ? (
                  <LucideLoader2 className="animate-spin" size={16} />
                ) : (
                  <LucideSave size={16} />
                )}
                {saving === "payment" ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>

          {/* Tax Settings */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucidePercent size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Pengaturan Pajak
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pajak
                </label>
                <input
                  type="text"
                  value={taxName}
                  onChange={(e) => setTaxName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
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
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Pajak Inclusive</p>
                  <p className="text-sm text-gray-500">
                    Include tax in product prices
                  </p>
                </div>
                <button
                  onClick={() => setTaxInclusive(!taxInclusive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    taxInclusive ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      taxInclusive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <button
                onClick={handleSaveTax}
                disabled={saving === "tax"}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
              >
                {saving === "tax" ? (
                  <LucideLoader2 className="animate-spin" size={16} />
                ) : (
                  <LucideSave size={16} />
                )}
                {saving === "tax" ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideBuilding size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Info Perusahaan
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Perusahaan
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <textarea
                  rows={2}
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID (NPWP)
                </label>
                <input
                  type="text"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleSaveCompany}
                disabled={saving === "company"}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
              >
                {saving === "company" ? (
                  <LucideLoader2 className="animate-spin" size={16} />
                ) : (
                  <LucideSave size={16} />
                )}
                {saving === "company" ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LucideMail size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Notifications
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Send email on invoice creation
                    </p>
                    <p className="text-sm text-gray-500">
                      Send invoice to customer automatically
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSendEmailOnInvoiceCreated(!sendEmailOnInvoiceCreated)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      sendEmailOnInvoiceCreated
                        ? "bg-purple-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        sendEmailOnInvoiceCreated
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Send reminder before due date
                    </p>
                    <p className="text-sm text-gray-500">
                      Remind customers of upcoming payments
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSendReminderBeforeDue(!sendReminderBeforeDue)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      sendReminderBeforeDue ? "bg-purple-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        sendReminderBeforeDue
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {sendReminderBeforeDue && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reminder days before due
                    </label>
                    <input
                      type="number"
                      value={reminderDaysBefore}
                      onChange={(e) =>
                        setReminderDaysBefore(Number(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Send email on payment received
                    </p>
                    <p className="text-sm text-gray-500">
                      Notify customer when invoice is paid
                    </p>
                  </div>
                  <button
                    onClick={() => setSendEmailOnPayment(!sendEmailOnPayment)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      sendEmailOnPayment ? "bg-purple-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        sendEmailOnPayment ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveNotifications}
              disabled={saving === "notifications"}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
            >
              {saving === "notifications" ? (
                <LucideLoader2 className="animate-spin" size={16} />
              ) : (
                <LucideSave size={16} />
              )}
              {saving === "notifications" ? "Menyimpan..." : "Simpan Semua"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
