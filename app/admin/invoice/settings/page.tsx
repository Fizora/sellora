"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState } from "react";
import {
  LucideFileText,
  LucideCalendar,
  LucidePercent,
  LucideBuilding,
  LucideMail,
  LucideSave,
  LucideToggleLeft,
  LucideToggleRight,
} from "lucide-react";

export default function InvoiceSettingsPage() {
  // Invoice Format Settings
  const [invoicePrefix, setInvoicePrefix] = useState("INV");
  const [invoiceStartingNumber, setInvoiceStartingNumber] = useState(1000);
  const [invoiceNumberFormat, setInvoiceNumberFormat] =
    useState("{prefix}-{number}");
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
  const [adminEmail, setAdminEmail] = useState("admin@sellora.com");

  const handleSaveInvoiceFormat = () => alert("Invoice format settings saved!");
  const handleSavePaymentTerms = () => alert("Payment terms saved!");
  const handleSaveTax = () => alert("Tax settings saved!");
  const handleSaveCompany = () => alert("Company info saved!");
  const handleSaveNotifications = () => alert("Notification settings saved!");

  return (
    <DashboardLayout
      config={{
        title: "Invoice Settings",
        moduleItems: [
          { label: "Invoices", href: "/admin/invoice" },
          { label: "Settings", href: "/admin/invoice/settings" },
        ],
      }}
    >
      <div className="p-4 mb-15 md:my-0 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Settings</h1>
          <p className="text-gray-500">
            Configure invoice generation and management
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
                Invoice Format
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prefix
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
                  Starting Number
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
                  Number Format
                </label>
                <select
                  value={invoiceNumberFormat}
                  onChange={(e) => setInvoiceNumberFormat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="{prefix}-{number}">{`{prefix}-{number}`}</option>
                  <option value="{prefix}{number}">{`{prefix}{number}`}</option>
                  <option value="{prefix}/{number}">{`{prefix}/{number}`}</option>
                  <option value="{number}">{`{number}`}</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Preview: {invoicePrefix}-
                  {String(invoiceStartingNumber).padStart(invoiceDigits, "0")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number Digits
                </label>
                <input
                  type="number"
                  value={invoiceDigits}
                  onChange={(e) => setInvoiceDigits(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min={1}
                  max={10}
                />
              </div>
              <button
                onClick={handleSaveInvoiceFormat}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
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
                Payment Terms
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Days (from invoice date)
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
                  <p className="font-medium text-gray-900">Enable Late Fee</p>
                  <p className="text-sm text-gray-500">
                    Charge fee for overdue invoices
                  </p>
                </div>
                <button
                  onClick={() => setEnableLateFee(!enableLateFee)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition bg-gray-300"
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
                      Late Fee (% of total)
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
                      Minimum Late Fee (Fixed)
                    </label>
                    <input
                      type="number"
                      value={lateFeeFixed}
                      onChange={(e) => setLateFeeFixed(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Fee will be the greater of percentage or fixed amount
                    </p>
                  </div>
                </>
              )}
              <button
                onClick={handleSavePaymentTerms}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
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
                Tax Settings
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Name
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
                  Tax Rate (%)
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
                  <p className="font-medium text-gray-900">Tax Inclusive</p>
                  <p className="text-sm text-gray-500">
                    Include tax in product prices
                  </p>
                </div>
                <button
                  onClick={() => setTaxInclusive(!taxInclusive)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition bg-gray-300"
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
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
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
                Company Info
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
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
                  Address
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
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                <LucideSave size={16} />
                Save Changes
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
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition bg-gray-300"
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
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition bg-gray-300"
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
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition bg-gray-300"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        sendEmailOnPayment ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin notification email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Receive copies of all invoice emails
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveNotifications}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              <LucideSave size={16} />
              Save All Notification Settings
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
