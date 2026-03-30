import { createClient } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================

export interface InvoiceSettings {
  invoice_prefix: string;
  invoice_starting_number: string;
  invoice_digits: string;
  default_due_days: string;
  enable_late_fee: string;
  late_fee_percentage: string;
  late_fee_fixed: string;
  tax_rate: string;
  tax_name: string;
  tax_inclusive: string;
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_tax_id: string;
  send_email_on_invoice_created: string;
  send_reminder_before_due: string;
  reminder_days_before: string;
  send_email_on_payment: string;
}

export interface InvoiceSettingsRow {
  key: string;
  value: string;
}

// ============================================
// Invoice Settings Operations
// ============================================

export async function getInvoiceSettings(): Promise<InvoiceSettings> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoice_settings")
    .select("key, value");

  if (error) throw error;

  // Default values
  const settings: InvoiceSettings = {
    invoice_prefix: "INV",
    invoice_starting_number: "1000",
    invoice_digits: "4",
    default_due_days: "14",
    enable_late_fee: "true",
    late_fee_percentage: "2",
    late_fee_fixed: "50000",
    tax_rate: "11",
    tax_name: "PPN",
    tax_inclusive: "true",
    company_name: "Sellora Store",
    company_address: "Jl. Contoh No. 123, Jakarta, Indonesia",
    company_phone: "+62 812 3456 7890",
    company_email: "admin@sellora.com",
    company_tax_id: "12.345.678.9-123.456",
    send_email_on_invoice_created: "true",
    send_reminder_before_due: "true",
    reminder_days_before: "3",
    send_email_on_payment: "true",
  };

  (data || []).forEach((row: InvoiceSettingsRow) => {
    if (row.key in settings) {
      (settings as any)[row.key] = row.value;
    }
  });

  return settings;
}

export async function updateInvoiceSetting(key: string, value: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoice_settings")
    .upsert({ key, value }, { onConflict: "key" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInvoiceSettings(
  settings: Partial<InvoiceSettings>,
) {
  const supabase = createClient();

  const updates = Object.entries(settings).map(([key, value]) => ({
    key,
    value: String(value),
  }));

  const { error } = await supabase
    .from("invoice_settings")
    .upsert(updates, { onConflict: "key" });

  if (error) throw error;
}

// ============================================
// Invoice Analytics
// ============================================

export interface SalesByPeriod {
  labels: string[];
  sales: number[];
  orders: number[];
}

export interface TopCustomer {
  name: string;
  total: number;
}

export interface PaymentDistribution {
  cash: number;
  card: number;
  transfer: number;
}

export async function getInvoiceSalesByPeriod(
  period: "daily" | "weekly" | "monthly",
): Promise<SalesByPeriod> {
  const supabase = createClient();

  const result: SalesByPeriod = {
    labels: [],
    sales: [],
    orders: [],
  };

  if (period === "daily") {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const { data } = await supabase
        .from("invoices")
        .select("total_amount")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .eq("payment_status", "paid");

      result.labels.push(
        start.toLocaleDateString("id-ID", { weekday: "short" }),
      );
      result.sales.push(
        (data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0) /
          1000000,
      );
      result.orders.push((data || []).length);
    }
  } else if (period === "weekly") {
    // Last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(startOfWeek.getDate() - i * 7 - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      const { data } = await supabase
        .from("invoices")
        .select("total_amount")
        .gte("created_at", startOfWeek.toISOString())
        .lt("created_at", endOfWeek.toISOString())
        .eq("payment_status", "paid");

      result.labels.push(`Minggu ${4 - i}`);
      result.sales.push(
        (data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0) /
          1000000,
      );
      result.orders.push((data || []).length);
    }
  } else {
    // Last 4 months
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

      const { data } = await supabase
        .from("invoices")
        .select("total_amount")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .eq("payment_status", "paid");

      result.labels.push(start.toLocaleDateString("id-ID", { month: "short" }));
      result.sales.push(
        (data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0) /
          1000000,
      );
      result.orders.push((data || []).length);
    }
  }

  return result;
}

export async function getInvoiceTopCustomers(
  limit: number = 5,
): Promise<TopCustomer[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("customer_name, total_amount")
    .eq("payment_status", "paid")
    .order("total_amount", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map((item: any) => ({
    name: item.customer_name,
    total: item.total_amount / 1000000,
  }));
}

export async function getInvoiceStatusDistribution(): Promise<{
  paid: number;
  pending: number;
  partial: number;
  overdue: number;
  debt: number;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("payment_status");

  if (error) throw error;

  const result = { paid: 0, pending: 0, partial: 0, overdue: 0, debt: 0 };
  (data || []).forEach((item: any) => {
    if (item.payment_status === "paid") result.paid++;
    else if (item.payment_status === "pending") result.pending++;
    else if (item.payment_status === "partial") result.partial++;
    else if (item.payment_status === "overdue") result.overdue++;
    else if (item.payment_status === "debt") result.debt++;
  });

  return result;
}

export async function getInvoiceStats(): Promise<{
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  partialInvoices: number;
  debtInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  partialRevenue: number;
  debtRevenue: number;
  averageInvoiceValue: number;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("total_amount, payment_status");

  if (error) throw error;

  const invoices = data || [];

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(
    (o: any) => o.payment_status === "paid",
  ).length;
  const pendingInvoices = invoices.filter(
    (o: any) => o.payment_status === "pending",
  ).length;
  const partialInvoices = invoices.filter(
    (o: any) => o.payment_status === "partial",
  ).length;
  const debtInvoices = invoices.filter(
    (o: any) => o.payment_status === "debt",
  ).length;

  const totalRevenue = invoices.reduce(
    (sum: number, o: any) => sum + (o.total_amount || 0),
    0,
  );
  const paidRevenue = invoices
    .filter((o: any) => o.payment_status === "paid")
    .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
  const pendingRevenue = invoices
    .filter((o: any) => o.payment_status === "pending")
    .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
  const partialRevenue = invoices
    .filter((o: any) => o.payment_status === "partial")
    .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
  const debtRevenue = invoices
    .filter((o: any) => o.payment_status === "debt")
    .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

  return {
    totalInvoices,
    paidInvoices,
    pendingInvoices,
    partialInvoices,
    debtInvoices,
    overdueInvoices: 0,
    totalRevenue,
    paidRevenue,
    pendingRevenue,
    partialRevenue,
    debtRevenue,
    averageInvoiceValue: totalInvoices > 0 ? totalRevenue / totalInvoices : 0,
  };
}
