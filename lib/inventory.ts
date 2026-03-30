import { createClient } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  name: string;
  abbreviation: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category_id: string | null;
  category_name?: string;
  unit_id: string | null;
  unit_name?: string;
  price: number;
  cost_price: number;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithStock extends Product {
  stock_quantity: number;
  min_quantity: number;
  critical_quantity: number;
  stock_status: "available" | "low" | "critical" | "out";
}

export interface Stock {
  id: string;
  product_id: string;
  product_name?: string;
  product_code?: string;
  quantity: number;
  min_quantity: number;
  critical_quantity: number;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductCode {
  id: string;
  product_id: string | null;
  product_name?: string;
  code: string;
  barcode: string | null;
  sku: string | null;
  status: "active" | "inactive";
  created_at: string;
}

export interface InventorySettings {
  key: string;
  value: string;
}

export interface StockHistory {
  id: string;
  product_id: string;
  product_name?: string;
  product_code?: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  previous_quantity: number;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
}

// ============================================
// Categories Operations
// ============================================

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data || [];
}

// Get category distribution (all categories with product count)
export async function getCategoryDistribution(): Promise<
  { name: string; count: number }[]
> {
  const supabase = createClient();

  try {
    // Get all categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    if (catError) {
      console.error("Error fetching categories:", catError);
      return [];
    }

    if (!categories || categories.length === 0) {
      return [];
    }

    // Get all products with their category IDs
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("id, category_id");

    if (prodError) {
      console.error("Error fetching products:", prodError);
      return categories.map((cat) => ({ name: cat.name, count: 0 }));
    }

    // Count products per category
    const productCountByCategory = new Map<string, number>();
    products?.forEach((p) => {
      if (p.category_id) {
        productCountByCategory.set(
          p.category_id,
          (productCountByCategory.get(p.category_id) || 0) + 1,
        );
      }
    });

    // Return all categories with their product counts
    return categories.map((cat) => ({
      name: cat.name,
      count: productCountByCategory.get(cat.id) || 0,
    }));
  } catch (error) {
    console.error("Error in getCategoryDistribution:", error);
    return [];
  }
}

export async function createCategory(name: string, description?: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, description })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(
  id: string,
  name: string,
  description?: string,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .update({ name, description })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// Units Operations
// ============================================

export async function getUnits(): Promise<Unit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .order("name");

  if (error) throw error;
  return data || [];
}

export async function createUnit(name: string, abbreviation?: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("units")
    .insert({ name, abbreviation })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUnit(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("units").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// Products Operations
// ============================================

export async function getProducts(): Promise<ProductWithStock[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(name),
        unit:units(name),
        stock:stock(quantity, min_quantity, critical_quantity)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    // Transform data to include stock info
    return (data || []).map((item: any) => {
      const stock = item.stock?.[0] || {
        quantity: 0,
        min_quantity: 10,
        critical_quantity: 5,
      };
      let stock_status: "available" | "low" | "critical" | "out" = "available";
      if (stock.quantity === 0) stock_status = "out";
      else if (
        stock.critical_quantity &&
        stock.quantity <= stock.critical_quantity
      )
        stock_status = "critical";
      else if (stock.min_quantity && stock.quantity <= stock.min_quantity)
        stock_status = "low";

      return {
        ...item,
        category_name: item.category?.name,
        unit_name: item.unit?.name,
        stock_quantity: stock.quantity,
        min_quantity: stock.min_quantity,
        critical_quantity: stock.critical_quantity,
        stock_status,
      };
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return [];
  }
}

export async function getProductById(
  id: string,
): Promise<ProductWithStock | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(name),
      unit:units(name),
      stock:stock(quantity, min_quantity, critical_quantity)
    `,
    )
    .eq("id", id)
    .single();

  if (error) return null;

  const stock = data.stock?.[0] || {
    quantity: 0,
    min_quantity: 10,
    critical_quantity: 5,
  };
  let stock_status: "available" | "low" | "critical" | "out" = "available";
  if (stock.quantity === 0) stock_status = "out";
  else if (stock.critical_quantity && stock.quantity <= stock.critical_quantity)
    stock_status = "critical";
  else if (stock.min_quantity && stock.quantity <= stock.min_quantity)
    stock_status = "low";

  return {
    ...data,
    category_name: data.category?.name,
    unit_name: data.unit?.name,
    stock_quantity: stock.quantity,
    min_quantity: stock.min_quantity,
    critical_quantity: stock.critical_quantity,
    stock_status,
  };
}

export async function createProduct(product: {
  code: string;
  name: string;
  category_id?: string;
  unit_id?: string;
  price: number;
  cost_price?: number;
  description?: string;
  image_url?: string;
  stock_quantity?: number;
  min_quantity?: number;
  critical_quantity?: number;
}) {
  const supabase = createClient();

  // Start transaction
  const { data: newProduct, error: productError } = await supabase
    .from("products")
    .insert({
      code: product.code,
      name: product.name,
      category_id: product.category_id || null,
      unit_id: product.unit_id || null,
      price: product.price,
      cost_price: product.cost_price || 0,
      description: product.description || null,
      image_url: product.image_url || null,
    })
    .select()
    .single();

  if (productError) throw productError;

  // Create stock record
  const { error: stockError } = await supabase.from("stock").insert({
    product_id: newProduct.id,
    quantity: product.stock_quantity || 0,
    min_quantity: product.min_quantity || 10,
    critical_quantity: product.critical_quantity || 5,
  });

  if (stockError) throw stockError;

  return newProduct;
}

export async function updateProduct(
  id: string,
  product: {
    code?: string;
    name?: string;
    category_id?: string;
    unit_id?: string;
    price?: number;
    cost_price?: number;
    description?: string;
    image_url?: string;
    is_active?: boolean;
  },
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// Stock Operations
// ============================================

export async function getStock(): Promise<Stock[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock")
    .select(
      `
      *,
      product:products(code, name)
    `,
    )
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    ...item,
    product_name: item.product?.name,
    product_code: item.product?.code,
  }));
}

export async function updateStock(
  id: string,
  stock: {
    quantity?: number;
    min_quantity?: number;
    critical_quantity?: number;
    location?: string;
  },
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock")
    .update(stock)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adjustStock(
  productId: string,
  quantity: number,
  operation: "add" | "subtract" | "set",
) {
  const supabase = createClient();

  // Get current stock
  const { data: currentStock, error: fetchError } = await supabase
    .from("stock")
    .select("quantity")
    .eq("product_id", productId)
    .single();

  if (fetchError) throw fetchError;

  let newQuantity: number;
  switch (operation) {
    case "add":
      newQuantity = (currentStock?.quantity || 0) + quantity;
      break;
    case "subtract":
      newQuantity = Math.max(0, (currentStock?.quantity || 0) - quantity);
      break;
    case "set":
      newQuantity = quantity;
      break;
  }

  const { data, error } = await supabase
    .from("stock")
    .update({ quantity: newQuantity })
    .eq("product_id", productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// Product Codes Operations (Barcode/SKU)
// ============================================

export async function getProductCodes(): Promise<ProductCode[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("product_codes")
    .select(
      `
      *,
      product:products(name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    ...item,
    product_name: item.product?.name,
  }));
}

export async function createProductCode(code: {
  product_id?: string;
  code: string;
  barcode?: string;
  sku?: string;
  status?: "active" | "inactive";
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("product_codes")
    .insert({
      product_id: code.product_id || null,
      code: code.code,
      barcode: code.barcode || null,
      sku: code.sku || null,
      status: code.status || "active",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProductCode(
  id: string,
  code: {
    product_id?: string;
    code?: string;
    barcode?: string;
    sku?: string;
    status?: "active" | "inactive";
  },
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("product_codes")
    .update(code)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProductCode(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("product_codes").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// Inventory Settings Operations
// ============================================

export async function getInventorySettings(): Promise<InventorySettings[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("inventory_settings")
    .select("*")
    .order("key");

  if (error) throw error;
  return data || [];
}

export async function updateInventorySetting(key: string, value: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("inventory_settings")
    .upsert({ key, value }, { onConflict: "key" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMultipleSettings(
  settings: { key: string; value: string }[],
) {
  const supabase = createClient();
  const { error } = await supabase.from("inventory_settings").upsert(
    settings.map((s) => ({ key: s.key, value: s.value })),
    { onConflict: "key" },
  );

  if (error) throw error;
}

// ============================================
// Dashboard Stats
// ============================================

export async function getInventoryStats() {
  const supabase = createClient();

  // Get products count
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // Get categories count
  const { count: totalCategories } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  // Get total stock value
  const { data: stockData } = await supabase.from("stock").select("quantity");

  const { data: productsData } = await supabase
    .from("products")
    .select("price");

  const totalValue =
    productsData?.reduce((sum, p) => {
      const stock = stockData?.find((s, i) => i === productsData.indexOf(p));
      return sum + p.price * (stock?.quantity || 0);
    }, 0) || 0;

  // Get low stock count
  const { data: lowStockData } = await supabase
    .from("stock")
    .select("quantity, min_quantity, critical_quantity");

  const lowStock =
    lowStockData?.filter(
      (s) => s.min_quantity && s.quantity <= s.min_quantity && s.quantity > 0,
    ).length || 0;

  const criticalStock =
    lowStockData?.filter(
      (s) => s.critical_quantity && s.quantity <= s.critical_quantity,
    ).length || 0;

  const outOfStock = lowStockData?.filter((s) => s.quantity === 0).length || 0;

  return {
    totalProducts: totalProducts || 0,
    totalCategories: totalCategories || 0,
    totalValue,
    lowStock,
    criticalStock,
    outOfStock,
  };
}

// ============================================
// Category Stats for Dashboard
// ============================================

export interface CategoryStats {
  id: string;
  name: string;
  productCount: number;
}

export async function getCategoryStats(): Promise<CategoryStats[]> {
  const supabase = createClient();

  // Get all categories
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (catError) throw catError;
  if (!categories || categories.length === 0) return [];

  // Get product counts per category
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("category_id");

  if (prodError) throw prodError;

  // Count products per category
  const categoryMap = new Map<string, number>();
  products?.forEach((p) => {
    if (p.category_id) {
      categoryMap.set(p.category_id, (categoryMap.get(p.category_id) || 0) + 1);
    }
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    productCount: categoryMap.get(cat.id) || 0,
  }));
}

// ============================================
// Stock History Operations
// ============================================

export async function getStockHistory(): Promise<StockHistory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock_history")
    .select(
      `
      *,
      product:products(code, name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;

  return (data || []).map((item: any) => ({
    ...item,
    product_name: item.product?.name,
    product_code: item.product?.code,
  }));
}

export async function addStockIn(
  productId: string,
  quantity: number,
  reference?: string,
  notes?: string,
) {
  const supabase = createClient();

  // Get current stock
  const { data: currentStock, error: fetchError } = await supabase
    .from("stock")
    .select("quantity")
    .eq("product_id", productId)
    .single();

  if (fetchError) throw fetchError;

  const previousQuantity = currentStock?.quantity || 0;
  const newQuantity = previousQuantity + quantity;

  // Update stock
  const { error: updateError } = await supabase
    .from("stock")
    .update({ quantity: newQuantity })
    .eq("product_id", productId);

  if (updateError) throw updateError;

  // Add history record
  const { error: historyError } = await supabase.from("stock_history").insert({
    product_id: productId,
    type: "in",
    quantity,
    previous_quantity: previousQuantity,
    reference_number: reference || null,
    notes: notes || null,
  });

  if (historyError) throw historyError;
}

export async function addStockOut(
  productId: string,
  quantity: number,
  reference?: string,
  notes?: string,
) {
  const supabase = createClient();

  // Get current stock
  const { data: currentStock, error: fetchError } = await supabase
    .from("stock")
    .select("quantity")
    .eq("product_id", productId)
    .single();

  if (fetchError) throw fetchError;

  const previousQuantity = currentStock?.quantity || 0;
  const newQuantity = Math.max(0, previousQuantity - quantity);

  // Update stock
  const { error: updateError } = await supabase
    .from("stock")
    .update({ quantity: newQuantity })
    .eq("product_id", productId);

  if (updateError) throw updateError;

  // Add history record
  const { error: historyError } = await supabase.from("stock_history").insert({
    product_id: productId,
    type: "out",
    quantity,
    previous_quantity: previousQuantity,
    reference_number: reference || null,
    notes: notes || null,
  });

  if (historyError) throw historyError;
}

export async function adjustStockQuantity(
  productId: string,
  newQuantity: number,
  notes?: string,
) {
  const supabase = createClient();

  // Get current stock
  const { data: currentStock, error: fetchError } = await supabase
    .from("stock")
    .select("quantity")
    .eq("product_id", productId)
    .single();

  if (fetchError) throw fetchError;

  const previousQuantity = currentStock?.quantity || 0;

  // Update stock
  const { error: updateError } = await supabase
    .from("stock")
    .update({ quantity: newQuantity })
    .eq("product_id", productId);

  if (updateError) throw updateError;

  // Add history record
  const { error: historyError } = await supabase.from("stock_history").insert({
    product_id: productId,
    type: "adjustment",
    quantity: newQuantity - previousQuantity,
    previous_quantity: previousQuantity,
    notes: notes || "Manual adjustment",
  });

  if (historyError) throw historyError;
}
