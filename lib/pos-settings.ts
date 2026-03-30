import { createClient } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================

export interface PosSettings {
  tax_rate: string;
  discount_enabled: string;
  default_discount: string;
  receipt_header: string;
  receipt_footer: string;
  printer_type: string;
  printer_ip: string;
  printer_port: string;
  default_payment_method: string;
  cash_drawer_enabled: string;
}

export interface PosSettingsRow {
  key: string;
  value: string;
}

// ============================================
// POS Settings Operations
// ============================================

export async function getPosSettings(): Promise<PosSettings> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("pos_settings")
      .select("key, value");

    // If table doesn't exist or error, return defaults silently
    if (error || !data) {
      return {
        tax_rate: "11",
        discount_enabled: "true",
        default_discount: "0",
        receipt_header: "Sellora Store",
        receipt_footer: "Terima kasih telah berbelanja!",
        printer_type: "thermal",
        printer_ip: "192.168.1.100",
        printer_port: "9100",
        default_payment_method: "cash",
        cash_drawer_enabled: "true",
      };
    }

    // Transform array to object
    const settings: PosSettings = {
      tax_rate: "11",
      discount_enabled: "true",
      default_discount: "0",
      receipt_header: "Sellora Store",
      receipt_footer: "Terima kasih telah berbelanja!",
      printer_type: "thermal",
      printer_ip: "192.168.1.100",
      printer_port: "9100",
      default_payment_method: "cash",
      cash_drawer_enabled: "true",
    };

    data.forEach((row: PosSettingsRow) => {
      if (row.key in settings) {
        (settings as any)[row.key] = row.value;
      }
    });

    return settings;
  } catch (error) {
    console.error("Error in getPosSettings:", error);
    // Return default settings on error
    return {
      tax_rate: "11",
      discount_enabled: "true",
      default_discount: "0",
      receipt_header: "Sellora Store",
      receipt_footer: "Terima kasih telah berbelanja!",
      printer_type: "thermal",
      printer_ip: "192.168.1.100",
      printer_port: "9100",
      default_payment_method: "cash",
      cash_drawer_enabled: "true",
    };
  }
}

export async function updatePosSetting(key: string, value: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pos_settings")
    .upsert({ key, value }, { onConflict: "key" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePosSettings(settings: Partial<PosSettings>) {
  const supabase = createClient();

  const updates = Object.entries(settings).map(([k, v]) => ({
    key: k,
    value: String(v),
  }));

  const { error } = await supabase
    .from("pos_settings")
    .upsert(updates, { onConflict: "key" });

  if (error) throw error;
}

// ============================================
// Sales Analytics for POS
// ============================================

export interface SalesByPeriod {
  labels: string[];
  sales: number[];
  orders: number[];
}

export interface TopProduct {
  name: string;
  quantity: number;
}

export async function getPosSalesByPeriod(
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
        .from("orders")
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
        .from("orders")
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
        .from("orders")
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

export async function getPosTopProducts(
  limit: number = 5,
): Promise<TopProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("order_items")
    .select("product_name, quantity")
    .order("quantity", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map((item: any) => ({
    name: item.product_name || "Unknown",
    quantity: item.quantity || 0,
  }));
}

export interface PosStats {
  totalSales: number;
  totalOrders: number;
  averageOrder: number;
  uniqueCustomers: number;
}

export async function getPosStats(): Promise<PosStats> {
  const supabase = createClient();

  // All time
  const { data: allOrders } = await supabase
    .from("orders")
    .select("total_amount, customer_name")
    .eq("payment_status", "paid");

  const totalSales = (allOrders || []).reduce(
    (sum, o) => sum + (o.total_amount || 0),
    0,
  );
  const totalOrders = (allOrders || []).length;
  const uniqueCustomers = new Set(
    (allOrders || []).map((o) => o.customer_name).filter(Boolean),
  ).size;

  return {
    totalSales,
    totalOrders,
    averageOrder: totalOrders > 0 ? totalSales / totalOrders : 0,
    uniqueCustomers,
  };
}

// Get payment method distribution for analytics
export interface PaymentMethodStats {
  labels: string[];
  data: number[];
}

export async function getPaymentMethodDistribution(): Promise<PaymentMethodStats> {
  const supabase = createClient();

  // Get all paid orders with payment method
  const { data: orders } = await supabase
    .from("orders")
    .select("payment_method, total_amount")
    .eq("payment_status", "paid");

  // Group by payment method
  const methodTotals: Record<string, number> = {};
  (orders || []).forEach((order) => {
    const method = order.payment_method || "cash";
    methodTotals[method] =
      (methodTotals[method] || 0) + (order.total_amount || 0);
  });

  // Map to chart data
  const labels: string[] = [];
  const data: number[] = [];

  Object.entries(methodTotals).forEach(([method, total]) => {
    const labelMap: Record<string, string> = {
      cash: "Tunai",
      qris: "QRIS",
      debit: "Kartu Debit",
      transfer: "Transfer Bank",
      card: "Kartu",
    };
    labels.push(labelMap[method] || method);
    data.push(total);
  });

  return { labels, data };
}

// ============================================
// Payment Methods CRUD
// ============================================

export interface PaymentMethod {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }
  return data || [];
}

export async function createPaymentMethod(name: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .insert({ name, is_active: true })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePaymentMethod(
  id: string,
  name: string,
  is_active: boolean,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payment_methods")
    .update({ name, is_active })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePaymentMethod(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("payment_methods")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
