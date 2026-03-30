import { createClient } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================

export interface InvoiceData {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email?: string;
  customer_address?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  amount_paid: number;
  payment_status: "paid" | "pending" | "partial" | "overdue" | "debt";
  status: "draft" | "sent" | "paid" | "cancelled";
  due_date: string;
  notes?: string;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

/**
 * Get invoice items by invoice ID
 */
export async function getInvoiceItems(
  invoiceId: string,
): Promise<InvoiceItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId);

  if (error) {
    console.error("Error fetching invoice items:", error);
    return [];
  }

  return data || [];
}

// ============================================
// Invoice Operations (from Orders)
// ============================================

/**
 * Get invoices from orders - converts orders to invoice format
 */
export async function getInvoices(): Promise<InvoiceData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      id,
      invoice_number,
      customer_name,
      customer_email,
      customer_address,
      subtotal,
      tax_amount,
      discount_amount,
      total_amount,
      amount_paid,
      payment_status,
      status,
      due_date,
      notes,
      created_at
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((invoice: any) => ({
    id: invoice.id,
    invoice_number: invoice.invoice_number,
    customer_name: invoice.customer_name || "Walk-in Customer",
    customer_email: invoice.customer_email || undefined,
    customer_address: invoice.customer_address || undefined,
    subtotal: invoice.subtotal || 0,
    tax_amount: invoice.tax_amount || 0,
    discount_amount: invoice.discount_amount || 0,
    total_amount: invoice.total_amount || 0,
    amount_paid: invoice.amount_paid || 0,
    payment_status: invoice.payment_status || "pending",
    status: invoice.status || "draft",
    due_date: invoice.due_date || "",
    notes: invoice.notes || undefined,
    created_at: invoice.created_at,
  }));
}

/**
 * Get invoice by ID
 */
export async function getInvoiceById(id: string): Promise<InvoiceData | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      id,
      invoice_number,
      customer_name,
      customer_email,
      customer_address,
      subtotal,
      tax_amount,
      discount_amount,
      total_amount,
      amount_paid,
      payment_status,
      status,
      due_date,
      notes,
      created_at
    `,
    )
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    id: data.id,
    invoice_number: data.invoice_number,
    customer_name: data.customer_name,
    customer_email: data.customer_email || undefined,
    customer_address: data.customer_address || undefined,
    subtotal: data.subtotal,
    tax_amount: data.tax_amount,
    discount_amount: data.discount_amount,
    total_amount: data.total_amount,
    amount_paid: data.amount_paid,
    payment_status: data.payment_status,
    status: data.status,
    due_date: data.due_date,
    notes: data.notes || undefined,
    created_at: data.created_at,
  };
}

/**
 * Update invoice payment status
 */
export async function updateInvoiceStatus(
  id: string,
  status: "paid" | "pending" | "partial",
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: status,
      status: status === "paid" ? "completed" : "pending",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// Invoice Analytics
// ============================================

export interface InvoiceStats {
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
}

export async function getInvoiceStats(): Promise<InvoiceStats> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("total_amount, amount_paid, payment_status, status");

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

/**
 * Get daily invoice data for charts
 */
export async function getDailyInvoiceData(days: number = 7) {
  const supabase = createClient();

  const result: { labels: string[]; invoices: number[]; revenue: number[] } = {
    labels: [],
    invoices: [],
    revenue: [],
  };

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const { data, error } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", date.toISOString())
      .lt("created_at", nextDate.toISOString());

    if (!error) {
      const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
      result.labels.push(dayName);
      result.invoices.push((data || []).length);
      result.revenue.push(
        (data || []).reduce((sum, o: any) => sum + (o.total_amount || 0), 0) /
          1000000,
      );
    }
  }

  return result;
}

// ============================================
// Invoice CRUD Operations
// ============================================

/**
 * Create a new invoice
 */
export async function createInvoice(invoice: {
  customer_name: string;
  customer_email?: string;
  customer_address?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  due_date: string;
  notes?: string;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
  payment_status?: "paid" | "pending" | "partial" | "overdue" | "debt";
  amount_paid?: number;
}): Promise<InvoiceData> {
  const supabase = createClient();

  // Generate invoice number
  const { data: lastInvoice } = await supabase
    .from("invoices")
    .select("invoice_number")
    .order("created_at", { ascending: false })
    .limit(1);

  let nextNumber = 1000;
  if (lastInvoice && lastInvoice.length > 0) {
    const lastNum = parseInt(lastInvoice[0].invoice_number.replace("INV-", ""));
    nextNumber = lastNum + 1;
  }

  const invoiceNumber = `INV-${nextNumber}`;

  // Create invoice
  const { data: newInvoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email || null,
      customer_address: invoice.customer_address || null,
      subtotal: invoice.subtotal,
      tax_amount: invoice.tax_amount,
      discount_amount: invoice.discount_amount,
      total_amount: invoice.total_amount,
      amount_paid: invoice.amount_paid ?? 0,
      payment_status: invoice.payment_status || "pending",
      status: "draft",
      due_date: invoice.due_date,
      notes: invoice.notes || null,
    })
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // Create invoice items
  if (invoice.items.length > 0) {
    const { error: itemsError } = await supabase.from("invoice_items").insert(
      invoice.items.map((item) => ({
        invoice_id: newInvoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
      })),
    );

    if (itemsError) throw itemsError;
  }

  return {
    id: newInvoice.id,
    invoice_number: newInvoice.invoice_number,
    customer_name: newInvoice.customer_name,
    customer_email: newInvoice.customer_email || undefined,
    customer_address: newInvoice.customer_address || undefined,
    subtotal: newInvoice.subtotal,
    tax_amount: newInvoice.tax_amount,
    discount_amount: newInvoice.discount_amount,
    total_amount: newInvoice.total_amount,
    amount_paid: newInvoice.amount_paid,
    payment_status: newInvoice.payment_status,
    status: newInvoice.status,
    due_date: newInvoice.due_date,
    notes: newInvoice.notes || undefined,
    created_at: newInvoice.created_at,
  };
}

/**
 * Update an existing invoice
 */
export async function updateInvoice(
  id: string,
  invoice: Partial<{
    customer_name: string;
    customer_email: string;
    customer_address: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    amount_paid: number;
    payment_status: "paid" | "pending" | "partial" | "overdue" | "debt";
    status: "draft" | "sent" | "paid" | "cancelled";
    due_date: string;
    notes: string;
  }>,
): Promise<InvoiceData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoices")
    .update(invoice)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    invoice_number: data.invoice_number,
    customer_name: data.customer_name,
    customer_email: data.customer_email || undefined,
    customer_address: data.customer_address || undefined,
    subtotal: data.subtotal,
    tax_amount: data.tax_amount,
    discount_amount: data.discount_amount,
    total_amount: data.total_amount,
    amount_paid: data.amount_paid,
    payment_status: data.payment_status,
    status: data.status,
    due_date: data.due_date,
    notes: data.notes || undefined,
    created_at: data.created_at,
  };
}

/**
 * Delete an invoice
 */
export async function deleteInvoice(id: string): Promise<void> {
  const supabase = createClient();

  // Delete invoice items first
  const { error: itemsError } = await supabase
    .from("invoice_items")
    .delete()
    .eq("invoice_id", id);

  if (itemsError) throw itemsError;

  // Delete invoice
  const { error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) throw error;
}
