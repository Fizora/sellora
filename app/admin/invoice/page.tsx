"use client";

import { DashboardLayout } from "@/app/components/layout/dashboard-layout";
import { useState, useEffect } from "react";
import {
  LucideFileText,
  LucideSearch,
  LucideDollarSign,
  LucideClock,
  LucideCheckCircle,
  LucideLoader2,
  LucidePlus,
  LucideTrash2,
  LucideEdit2,
  LucideX,
  LucidePackage,
  LucidePrinter,
  LucideEye,
} from "lucide-react";
import {
  getInvoices,
  getInvoiceStats,
  getInvoiceItems,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  InvoiceData,
  InvoiceStats,
} from "@/lib/invoice";
import { getProducts, ProductWithStock } from "@/lib/inventory";
import { getInvoiceSettings, InvoiceSettings } from "@/lib/invoice-settings";

// PDF generation placeholder - disabled due to SSR issues with jspdf/fflate
const generatePDF = (invoice: InvoiceData, _items: any[]) => {
  if (typeof window !== "undefined") {
    alert(
      `Invoice ${invoice.invoice_number} - PDF download would be triggered here.\n\nThis feature is temporarily unavailable due to technical issues.`,
    );
  }
};

interface FormInvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

type ModalMode = "create" | "edit" | "view";

export default function InvoicePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Invoice settings for due date and tax
  const [invoiceSettings, setInvoiceSettings] =
    useState<InvoiceSettings | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  // Print modal state
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printInvoiceItems, setPrintInvoiceItems] = useState<any[]>([]);

  // Products for item selection
  const [products, setProducts] = useState<ProductWithStock[]>([]);

  // Form state
  const [formData, setFormData] = useState<{
    customer_name: string;
    customer_email: string;
    customer_address: string;
    due_date: string;
    notes: string;
    items: FormInvoiceItem[];
    payment_status: "paid" | "pending" | "partial" | "overdue" | "debt";
    amount_paid: number;
  }>({
    customer_name: "",
    customer_email: "",
    customer_address: "",
    due_date: "",
    notes: "",
    items: [],
    payment_status: "pending",
    amount_paid: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [invoicesData, invoiceStatsData, productsData, settingsData] =
        await Promise.all([
          getInvoices(),
          getInvoiceStats(),
          getProducts(),
          getInvoiceSettings(),
        ]);
      setInvoices(invoicesData);
      setInvoiceStats(invoiceStatsData);
      setProducts(productsData);
      setInvoiceSettings(settingsData);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || inv.payment_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Convert number to Indonesian words
  const numberToWords = (num: number): string => {
    const ones = [
      "",
      "satu",
      "dua",
      "tiga",
      "empat",
      "lima",
      "enam",
      "tujuh",
      "delapan",
      "sembilan",
    ];
    const tens = [
      "",
      "",
      "dua puluh",
      "tiga puluh",
      "empat puluh",
      "lima puluh",
      "enam puluh",
      "tujuh puluh",
      "delapan puluh",
      "sembilan puluh",
    ];
    const teens = [
      "sepuluh",
      "sebelas",
      "dua belas",
      "tiga belas",
      "empat belas",
      "lima belas",
      "enam belas",
      "tujuh belas",
      "delapan belas",
      "sembilan belas",
    ];

    if (num === 0) return "nol";
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
      );
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        " ratus" +
        (num % 100 ? " " + numberToWords(num % 100) : "")
      );
    if (num < 1000000)
      return (
        numberToWords(Math.floor(num / 1000)) +
        " ribu" +
        (num % 1000 ? " " + numberToWords(num % 1000) : "")
      );
    if (num < 1000000000)
      return (
        numberToWords(Math.floor(num / 1000000)) +
        " juta" +
        (num % 1000000 ? " " + numberToWords(num % 1000000) : "")
      );
    return (
      numberToWords(Math.floor(num / 1000000000)) +
      " milyar" +
      (num % 1000000000 ? " " + numberToWords(num % 1000000000) : "")
    );
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return { label: "Lunas", class: "bg-emerald-100 text-emerald-700" };
      case "partial":
        return {
          label: "Dibayar Sebagian",
          class: "bg-amber-100 text-amber-700",
        };
      case "pending":
        return { label: "Tertunda", class: "bg-amber-100 text-amber-700" };
      case "overdue":
        return { label: "Jatuh Tempo", class: "bg-red-100 text-red-700" };
      case "debt":
        return { label: "Ngutang", class: "bg-purple-100 text-purple-700" };
      default:
        return { label: "Unknown", class: "bg-gray-100 text-gray-700" };
    }
  };

  // Get tax rate from settings (default 11%)
  const getTaxRate = () => {
    if (invoiceSettings?.tax_rate) {
      return parseFloat(invoiceSettings.tax_rate) / 100;
    }
    return 0.11;
  };

  // Get due days from settings (default 14 days)
  const getDefaultDueDays = () => {
    if (invoiceSettings?.default_due_days) {
      return parseInt(invoiceSettings.default_due_days);
    }
    return 14;
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = getTaxRate();
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    const defaultDueDate = new Date(
      Date.now() + getDefaultDueDays() * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split("T")[0];
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_address: "",
      due_date: defaultDueDate,
      notes: "",
      items: [],
      payment_status: "pending",
      amount_paid: 0,
    });
    setSelectedInvoice(null);
    setShowModal(true);
  };

  const handleOpenView = async (invoice: InvoiceData) => {
    setModalMode("view");
    setSelectedInvoice(invoice);
    // Load invoice items for view mode
    const items = await getInvoiceItems(invoice.id);
    setPrintInvoiceItems(items);
    setFormData({
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email || "",
      customer_address: invoice.customer_address || "",
      due_date: invoice.due_date || "",
      notes: invoice.notes || "",
      items: [],
      payment_status: invoice.payment_status || "pending",
      amount_paid: invoice.amount_paid || 0,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (invoice: InvoiceData) => {
    setModalMode("edit");
    setSelectedInvoice(invoice);
    setFormData({
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email || "",
      customer_address: invoice.customer_address || "",
      due_date: invoice.due_date || "",
      notes: invoice.notes || "",
      items: [],
      payment_status: invoice.payment_status || "pending",
      amount_paid: invoice.amount_paid || 0,
    });
    setShowModal(true);
  };

  const handleAddProduct = (product: ProductWithStock) => {
    const existingIndex = formData.items.findIndex(
      (item) => item.description === product.name,
    );

    if (existingIndex >= 0) {
      const newItems = [...formData.items];
      newItems[existingIndex].quantity += 1;
      newItems[existingIndex].total =
        newItems[existingIndex].quantity * newItems[existingIndex].unit_price;
      setFormData({ ...formData, items: newItems });
    } else {
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            description: product.name,
            quantity: 1,
            unit_price: product.price,
            total: product.price,
          },
        ],
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (
    index: number,
    field: keyof FormInvoiceItem,
    value: string | number,
  ) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "unit_price") {
      newItems[index].total =
        newItems[index].quantity * newItems[index].unit_price;
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { subtotal, taxAmount, total } = calculateTotals();

      if (modalMode === "create") {
        const paymentStatus = formData.payment_status || "pending";
        const amountPaid =
          paymentStatus === "partial"
            ? formData.amount_paid
            : paymentStatus === "paid"
              ? total
              : 0;

        await createInvoice({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email || undefined,
          customer_address: formData.customer_address || undefined,
          subtotal,
          tax_amount: taxAmount,
          discount_amount: 0,
          total_amount: total,
          due_date: formData.due_date,
          notes: formData.notes || undefined,
          items: formData.items,
          payment_status: paymentStatus,
          amount_paid: amountPaid,
        });
      } else if (modalMode === "edit" && selectedInvoice) {
        const editTotal = selectedInvoice.total_amount;
        await updateInvoice(selectedInvoice.id, {
          customer_name: formData.customer_name,
          customer_email: formData.customer_email || undefined,
          customer_address: formData.customer_address || undefined,
          due_date: formData.due_date,
          notes: formData.notes || undefined,
          payment_status: formData.payment_status,
          amount_paid:
            formData.payment_status === "partial"
              ? formData.amount_paid
              : formData.payment_status === "paid"
                ? editTotal
                : 0,
        });
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus faktur ini?")) {
      try {
        await deleteInvoice(id);
        loadData();
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const handleUpdatePaymentStatus = async (
    id: string,
    status: "paid" | "pending" | "partial" | "overdue",
  ) => {
    try {
      await updateInvoice(id, { payment_status: status });
      loadData(); // Refresh the list
      // Update selected invoice if it's the one being updated
      if (selectedInvoice && selectedInvoice.id === id) {
        setSelectedInvoice({ ...selectedInvoice, payment_status: status });
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Gagal mengubah status pembayaran");
    }
  };

  const statsCards = [
    {
      title: "Total",
      value: loading ? "..." : invoices.length,
      change: "Faktur",
      icon: <LucideFileText size={18} />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Lunas",
      value: loading ? "..." : (invoiceStats?.paidInvoices ?? 0),
      change: "Dibayar penuh",
      icon: <LucideCheckCircle size={18} />,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Tertunda",
      value: loading ? "..." : (invoiceStats?.pendingInvoices ?? 0),
      change: "Belum dibayar",
      icon: <LucideClock size={18} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Dibayar Sebagian",
      value: loading ? "..." : (invoiceStats?.partialInvoices ?? 0),
      change: "Sebagian",
      icon: <LucideDollarSign size={18} />,
      gradient: "from-blue-500 to-blue-600",
    },
  ];

  const { subtotal, taxAmount, total } = calculateTotals();
  const taxRatePercent = getTaxRate() * 100;

  return (
    <DashboardLayout
      config={{
        title: "Invoice",
        moduleItems: [
          { label: "Faktur", href: "/admin/invoice" },
          { label: "Analitik", href: "/admin/invoice/analytics" },
          { label: "Pengaturan", href: "/admin/invoice/settings" },
        ],
      }}
    >
      <div className="p-4 mb-15 md:my-0 md:p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-mono">
              Invoice
            </h1>
            <p className="text-gray-500">Kelola faktur pelanggan</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <LucidePlus size={18} />
            Faktur Baru
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {statsCards.map((stat, index) => (
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

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-purple-200 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <LucideSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari faktur..."
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-purple-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-purple-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="all">Semua</option>
              <option value="paid">Lunas</option>
              <option value="pending">Tertunda</option>
              <option value="partial">Dibayar Sebagian</option>
              <option value="overdue">Jatuh Tempo</option>
              <option value="debt">Ngutang</option>
            </select>
          </div>

          {/* Invoice List with Actions */}
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LucideLoader2
                  className="animate-spin text-purple-600"
                  size={32}
                />
              </div>
            ) : filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {invoice.customer_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-xs text-gray-500">
                        {invoice.customer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">
                      {formatCurrency(invoice.total_amount)}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusConfig(String(invoice.payment_status)).class}`}
                    >
                      {getStatusConfig(String(invoice.payment_status)).label}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenView(invoice)}
                        className="p-2 hover:bg-violet-100 text-violet-600 rounded-lg"
                      >
                        <LucideEye size={16} />
                      </button>
                      <button
                        onClick={async () => {
                          const items = await getInvoiceItems(invoice.id);
                          generatePDF(invoice, items);
                        }}
                        className="p-2 hover:bg-emerald-100 text-emerald-600 rounded-lg"
                      >
                        <LucidePrinter size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(invoice)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"
                      >
                        <LucideEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                      >
                        <LucideTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-400">
                No invoices found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-purple-100">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === "create"
                  ? "Faktur Baru"
                  : modalMode === "edit"
                    ? "Edit Faktur"
                    : "Detail Faktur"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <LucideX size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* View Mode - Read Only */}
              {modalMode === "view" && selectedInvoice && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Nomor Faktur</p>
                      <p className="font-bold">
                        {selectedInvoice.invoice_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusConfig(String(selectedInvoice.payment_status)).class}`}
                      >
                        {
                          getStatusConfig(
                            String(selectedInvoice.payment_status),
                          ).label
                        }
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pelanggan</p>
                      <p className="font-medium">
                        {selectedInvoice.customer_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm">
                        {selectedInvoice.customer_email || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Invoice Items */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">
                      Item Faktur
                    </h3>
                    {printInvoiceItems.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-3 py-2 text-left">Deskripsi</th>
                            <th className="px-3 py-2 text-right">Qty</th>
                            <th className="px-3 py-2 text-right">Harga</th>
                            <th className="px-3 py-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {printInvoiceItems.map((item: any, idx: number) => (
                            <tr
                              key={idx}
                              className="border-t border-purple-100"
                            >
                              <td className="px-3 py-2">{item.description}</td>
                              <td className="px-3 py-2 text-right">
                                {item.quantity}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {formatCurrency(item.unit_price)}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {formatCurrency(item.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-400 text-sm">Tidak ada item</p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-purple-100 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>PPN ({taxRatePercent}%)</span>
                      <span>{formatCurrency(selectedInvoice.tax_amount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span>
                        {formatCurrency(selectedInvoice.total_amount)}
                      </span>
                    </div>
                    {selectedInvoice.amount_paid > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Sudah Dibayar</span>
                        <span>
                          {formatCurrency(selectedInvoice.amount_paid)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Payment Info */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">
                      Informasi Pembayaran
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Jatuh Tempo</p>
                        <p>{selectedInvoice.due_date || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Sisa Pembayaran</p>
                        <p className="font-medium text-amber-600">
                          {formatCurrency(
                            selectedInvoice.total_amount -
                              (selectedInvoice.amount_paid || 0),
                          )}
                        </p>
                      </div>
                    </div>
                    {selectedInvoice.notes && (
                      <div className="mt-2">
                        <p className="text-gray-500">Catatan</p>
                        <p>{selectedInvoice.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Create and Edit Mode */}
              {modalMode !== "view" && (
                <>
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Pelanggan *
                      </label>
                      <input
                        type="text"
                        value={formData.customer_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer_name: e.target.value,
                          })
                        }
                                                className="w-full px-4 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer_email: e.target.value,
                          })
                        }
                                                className="w-full px-4 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat
                    </label>
                    <textarea
                      rows={2}
                      value={formData.customer_address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jatuh Tempo
                      </label>
                      <input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) =>
                          setFormData({ ...formData, due_date: e.target.value })
                        }
                                                className="w-full px-4 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catatan
                      </label>
                      <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                                                className="w-full px-4 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Products Selection (Create mode only) */}
                  {modalMode === "create" && (
                    <div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tambah Produk
                        </label>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                          {products.slice(0, 10).map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleAddProduct(product)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-purple-100 rounded-full text-sm hover:bg-purple-50 hover:border-purple-300 transition"
                            >
                              <LucidePackage size={14} />
                              {product.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Items Table */}
                      {formData.items.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Item Faktur
                          </label>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-3 py-2 text-left">
                                  Deskripsi
                                </th>
                                <th className="px-3 py-2 text-right">Qty</th>
                                <th className="px-3 py-2 text-right">Harga</th>
                                <th className="px-3 py-2 text-right">Total</th>
                                <th className="px-3 py-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.items.map((item, index) => (
                                <tr
                                  key={index}
                                  className="border-t border-purple-100"
                                >
                                  <td className="px-3 py-2">
                                    <input
                                      type="text"
                                      value={item.description}
                                      onChange={(e) =>
                                        handleItemChange(
                                          index,
                                          "description",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-2 py-1 border border-purple-100 rounded"
                                    />
                                  </td>
                                  <td className="px-3 py-2">
                                    <input
                                      type="number"
                                      min="1"
                                      value={item.quantity}
                                      onChange={(e) =>
                                        handleItemChange(
                                          index,
                                          "quantity",
                                          parseInt(e.target.value) || 1,
                                        )
                                      }
                                      className="w-16 px-2 py-1 border border-purple-100 rounded text-right"
                                    />
                                  </td>
                                  <td className="px-3 py-2">
                                    <input
                                      type="number"
                                      value={item.unit_price}
                                      onChange={(e) =>
                                        handleItemChange(
                                          index,
                                          "unit_price",
                                          parseInt(e.target.value) || 0,
                                        )
                                      }
                                      className="w-24 px-2 py-1 border border-purple-100 rounded text-right"
                                    />
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    {formatCurrency(item.total)}
                                  </td>
                                  <td className="px-3 py-2">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveItem(index)}
                                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                                    >
                                      <LucideTrash2 size={14} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Totals */}
                      {formData.items.length > 0 && (
                        <div className="border-t border-purple-100 pt-4 space-y-2">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>PPN ({taxRatePercent}%)</span>
                            <span>{formatCurrency(taxAmount)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg text-gray-900">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Status Section - for Create and Edit modes */}
                  <div className="border-t border-purple-100 pt-4 mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Pembayaran
                    </label>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            payment_status: "pending",
                            amount_paid: 0,
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          formData.payment_status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600 hover:bg-amber-50"
                        }`}
                      >
                        Tertunda
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            payment_status: "partial",
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          formData.payment_status === "partial"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                        }`}
                      >
                        Dibayar Sebagian
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            payment_status: "paid",
                            amount_paid:
                              modalMode === "edit" && selectedInvoice
                                ? selectedInvoice.total_amount
                                : total,
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          formData.payment_status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600 hover:bg-emerald-50"
                        }`}
                      >
                        Lunas
                      </button>
                    </div>

                    {/* Amount Paid Input - Show only when partial is selected */}
                    {formData.payment_status === "partial" && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nominal Pembayaran
                        </label>
                        <input
                          type="number"
                          value={formData.amount_paid}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              amount_paid: parseInt(e.target.value) || 0,
                            })
                          }
                          min={0}
                          max={
                            modalMode === "edit" && selectedInvoice
                              ? selectedInvoice.total_amount
                              : total
                          }
                          className="w-full px-4 py-2 border border-purple-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Masukkan nominal yang sudah dibayar"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Sisa:{" "}
                          {formatCurrency(
                            (modalMode === "edit" && selectedInvoice
                              ? selectedInvoice.total_amount
                              : total) - formData.amount_paid,
                          )}
                        </p>
                      </div>
                    )}

                    {/* Show current payment info in edit mode */}
                    {modalMode === "edit" && selectedInvoice && (
                      <div className="mt-2 text-sm text-gray-500">
                        <p>
                          Total Faktur:{" "}
                          {formatCurrency(selectedInvoice.total_amount)}
                        </p>
                        <p>
                          {" "}
                          Sudah Dibayar:{" "}
                          {formatCurrency(selectedInvoice.amount_paid || 0)}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions */}
            {modalMode !== "view" && (
              <div className="p-4 border-t border-purple-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.customer_name}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <LucideLoader2 className="animate-spin" size={16} />
                  )}
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

