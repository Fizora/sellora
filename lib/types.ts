// ============================================
// TypeScript Type Definitions for Sellora App
// ============================================

// User Types
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    picture?: string;
    name?: string;
  };
}

// Inventory Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  name: string;
  abbreviation?: string;
  created_at: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category_id: string;
  category_name?: string;
  unit_id: string;
  unit_name?: string;
  price: number;
  cost_price: number;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithStock extends Product {
  stock_quantity: number;
  min_quantity: number;
  critical_quantity: number;
}

export interface Stock {
  id: string;
  product_id: string;
  product_name?: string;
  product_code?: string;
  quantity: number;
  min_quantity: number;
  critical_quantity: number;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCode {
  id: string;
  product_id: string;
  code: string;
  barcode?: string;
  sku?: string;
  status: string;
  created_at: string;
}

export interface StockHistory {
  id: string;
  product_id: string;
  product_name?: string;
  product_code?: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  previous_quantity: number;
  reference_number?: string;
  notes?: string;
  created_at: string;
}

export interface InventorySettings {
  key: string;
  value: string;
}

// Sales Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: "paid" | "pending" | "partial";
  status: "completed" | "pending" | "cancelled";
  notes?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_code: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

// Invoice Types
export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  total: number;
  paid: number;
  status: "paid" | "pending" | "partial" | "overdue";
  date: string;
  due_date: string;
}

// Dashboard Stats
export interface SalesStats {
  todaySales: number;
  todayOrders: number;
  monthSales: number;
  monthOrders: number;
  totalSales: number;
  totalOrders: number;
}

export interface InventoryStats {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}
