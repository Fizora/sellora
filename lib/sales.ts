import { createClient } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string | null;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_code: string | null;
  product_name: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// ============================================
// Customer Operations
// ============================================

export async function getCustomers(): Promise<Customer[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("name");

  if (error) throw error;
  return data || [];
}

export async function createCustomer(customer: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .insert(customer)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCustomer(
  id: string,
  customer: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  },
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .update(customer)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCustomer(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// Order Operations
// ============================================

export async function getOrders(): Promise<Order[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const supabase = createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  if (itemsError) throw itemsError;

  return {
    ...order,
    items: items || [],
  };
}

export async function createOrder(order: {
  customer_id?: string;
  customer_name?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method?: string;
  payment_status?: string;
  status?: string;
  notes?: string;
  items: {
    product_id: string;
    product_code: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[];
}) {
  const supabase = createClient();

  // Generate order number
  const orderNumber = `ORD-${Date.now()}`;

  // Create order
  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: order.customer_id || null,
      customer_name: order.customer_name || null,
      subtotal: order.subtotal,
      tax_amount: order.tax_amount,
      discount_amount: order.discount_amount,
      total_amount: order.total_amount,
      payment_method: order.payment_method || "cash",
      payment_status: order.payment_status || "paid",
      status: order.status || "completed",
      notes: order.notes || null,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items and auto-deduct stock
  if (order.items.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(
      order.items.map((item) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        product_code: item.product_code,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      })),
    );

    if (itemsError) throw itemsError;
  }

  return newOrder;
}

export async function getTodaySales(): Promise<number> {
  const supabase = createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", today.toISOString())
      .eq("payment_status", "paid");

    if (error) {
      console.error("Error fetching today sales:", error);
      return 0;
    }

    return (data || []).reduce((sum, order) => sum + order.total_amount, 0);
  } catch (error) {
    console.error("Error in getTodaySales:", error);
    return 0;
  }
}

export async function getMonthlySales(): Promise<number[]> {
  const supabase = createClient();

  // Get last 6 months of sales
  const months: number[] = [];
  for (let i = 5; i >= 0; i--) {
    const startOfMonth = new Date();
    startOfMonth.setMonth(startOfMonth.getMonth() - i);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const { data, error } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", startOfMonth.toISOString())
      .lt("created_at", endOfMonth.toISOString())
      .eq("payment_status", "paid");

    if (error) throw error;
    months.push(
      (data || []).reduce((sum, order) => sum + order.total_amount, 0),
    );
  }

  return months;
}

export async function getSalesStats() {
  const supabase = createClient();

  // Total orders
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // Today's sales
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: todayData } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", today.toISOString())
    .eq("payment_status", "paid");

  const todaySales = (todayData || []).reduce(
    (sum, o) => sum + o.total_amount,
    0,
  );

  // This month's sales
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: monthData } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", startOfMonth.toISOString())
    .eq("payment_status", "paid");

  const monthSales = (monthData || []).reduce(
    (sum, o) => sum + o.total_amount,
    0,
  );

  // Total revenue
  const { data: allData } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("payment_status", "paid");

  const totalRevenue = (allData || []).reduce(
    (sum, o) => sum + o.total_amount,
    0,
  );

  return {
    totalOrders: totalOrders || 0,
    todaySales,
    monthSales,
    totalRevenue,
  };
}

// ============================================
// Dashboard Stats (combined with inventory)
// ============================================

export async function getDashboardStats() {
  const [salesStats] = await Promise.all([getSalesStats()]);

  return {
    sales: salesStats,
  };
}

// ============================================
// Analytics Functions
// ============================================

// Get top selling products
export async function getTopSellingProducts(
  limit: number = 5,
): Promise<{ name: string; totalSold: number }[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("order_items")
    .select("product_name, quantity");

  if (error) {
    console.error("Error fetching top products:", error);
    return [];
  }

  // Group by product name and sum quantities
  const productMap = new Map<string, number>();
  (data || []).forEach((item) => {
    if (item.product_name) {
      const current = productMap.get(item.product_name) || 0;
      productMap.set(item.product_name, current + (item.quantity || 0));
    }
  });

  // Convert to array and sort
  const products = Array.from(productMap.entries())
    .map(([name, totalSold]) => ({ name, totalSold }))
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, limit);

  return products;
}

// Get sales by category (from order items with product categories)
export async function getSalesByCategory(): Promise<
  { name: string; total: number }[]
> {
  const supabase = createClient();

  // Get all order items
  const { data: orderItems, error } = await supabase
    .from("order_items")
    .select("product_id, subtotal");

  if (error || !orderItems) {
    console.error("Error fetching sales by category:", error);
    return [];
  }

  // Since we don't have category in order_items, we'll return total sales
  // In a real implementation, you'd join with products table
  const totalSales = (orderItems || []).reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0,
  );

  // Return as single entry for now
  return [{ name: "Total Penjualan", total: totalSales }];
}

// Get sales by period (daily/weekly)
export async function getSalesByPeriod(
  period: "daily" | "weekly" | "monthly",
): Promise<{ labels: string[]; data: number[] }> {
  const supabase = createClient();

  const result = { labels: [] as string[], data: [] as number[] };

  if (period === "daily") {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const { data } = await supabase
        .from("orders")
        .select("total_amount")
        .gte("created_at", date.toISOString())
        .lt("created_at", nextDate.toISOString())
        .eq("payment_status", "paid");

      const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
      result.labels.push(dayName);
      result.data.push(
        (data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0),
      );
    }
  } else if (period === "weekly") {
    // Last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const startOfWeek = new Date();
      startOfWeek.setDate(
        startOfWeek.getDate() - (i * 7 + startOfWeek.getDay()),
      );
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
      result.data.push(
        (data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0),
      );
    }
  } else {
    // Monthly - last 6 months
    for (let i = 5; i >= 0; i--) {
      const startOfMonth = new Date();
      startOfMonth.setMonth(startOfMonth.getMonth() - i);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      const { data } = await supabase
        .from("orders")
        .select("total_amount")
        .gte("created_at", startOfMonth.toISOString())
        .lt("created_at", endOfMonth.toISOString())
        .eq("payment_status", "paid");

      const monthName = startOfMonth.toLocaleDateString("id-ID", {
        month: "short",
      });
      result.labels.push(monthName);
      result.data.push(
        (data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0),
      );
    }
  }

  return result;
}

// Get order count by status
export async function getOrderCountByStatus(): Promise<{
  completed: number;
  pending: number;
  processing: number;
}> {
  const supabase = createClient();

  const { data, error } = await supabase.from("orders").select("status");

  if (error) {
    console.error("Error fetching order count by status:", error);
    return { completed: 0, pending: 0, processing: 0 };
  }

  const counts = {
    completed: 0,
    pending: 0,
    processing: 0,
  };

  (data || []).forEach((order) => {
    if (order.status === "completed") counts.completed++;
    else if (order.status === "pending") counts.pending++;
    else if (order.status === "processing") counts.processing++;
  });

  return counts;
}
