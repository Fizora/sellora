-- ============================================
-- Database Schema for Inventory Module
-- ============================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
    ('Hijab', '各种头巾产品'),
    ('Mukenah', '祈祷披肩产品'),
    ('Pants', '裤子产品'),
    ('Footwear', '鞋类'),
    ('Bags', '包类')
ON CONFLICT DO NOTHING;

-- 2. Units Table
CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    abbreviation VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default units
INSERT INTO units (name, abbreviation) VALUES
    ('pcs', 'pcs'),
    ('pair', 'pair'),
    ('set', 'set'),
    ('kg', 'kg'),
    ('gram', 'g'),
    ('liter', 'L'),
    ('meter', 'm'),
    ('box', 'box'),
    ('pack', 'pack')
ON CONFLICT (name) DO NOTHING;

-- 3. Products Table (Main product data)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES categories(id),
    unit_id UUID REFERENCES units(id),
    price DECIMAL(15, 2) DEFAULT 0,
    cost_price DECIMAL(15, 2) DEFAULT 0,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Stock Table (Inventory tracking)
CREATE TABLE IF NOT EXISTS stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 10,
    critical_quantity INTEGER DEFAULT 5,
    location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Product Codes Table (Barcode/SKU management)
CREATE TABLE IF NOT EXISTS product_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    barcode VARCHAR(100),
    sku VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Inventory Settings Table
CREATE TABLE IF NOT EXISTS inventory_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO inventory_settings (key, value) VALUES
    ('default_tax_rate', '11'),
    ('currency', 'IDR'),
    ('date_format', 'DD/MM/YYYY'),
    ('low_stock_threshold', '10'),
    ('critical_stock_threshold', '5'),
    ('enable_email_alerts', 'true'),
    ('alert_email', 'admin@sellora.com'),
    ('default_unit', 'pcs'),
    ('enable_auto_code', 'true'),
    ('product_code_prefix', 'PRD'),
    ('code_digits', '4')
ON CONFLICT (key) DO NOTHING;

-- 7. Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_updated_at BEFORE UPDATE ON stock
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_settings_updated_at BEFORE UPDATE ON inventory_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_stock_product ON stock(product_id);
CREATE INDEX IF NOT EXISTS idx_product_codes_product ON product_codes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_codes_barcode ON product_codes(barcode);

-- 12. Stock History Table (for tracking stock in/out movements)
CREATE TABLE IF NOT EXISTS stock_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER DEFAULT 0,
    reference_number VARCHAR(100),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for stock history
CREATE INDEX IF NOT EXISTS idx_stock_history_product ON stock_history(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_created ON stock_history(created_at);

-- Enable RLS
ALTER TABLE stock_history ENABLE ROW LEVEL SECURITY;

-- Create policy for stock_history using correct syntax
CREATE POLICY "Allow all for anon on stock_history" ON stock_history
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- 10. POS Settings Table
CREATE TABLE IF NOT EXISTS pos_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default POS settings
INSERT INTO pos_settings (key, value) VALUES
    ('tax_rate', '11'),
    ('discount_enabled', 'true'),
    ('default_discount', '0'),
    ('receipt_header', 'Sellora Store'),
    ('receipt_footer', 'Terima kasih telah berbelanja!'),
    ('printer_type', 'thermal'),
    ('printer_ip', '192.168.1.100'),
    ('printer_port', '9100'),
    ('default_payment_method', 'cash'),
    ('cash_drawer_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS for pos_settings
ALTER TABLE pos_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon on pos_settings" ON pos_settings
    FOR ALL TO public USING (true) WITH CHECK (true);

-- 11. Create policies for public access (for anon key)
CREATE POLICY "Allow all for anon on categories" ON categories
    FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon on units" ON units
    FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon on products" ON products
    FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon on stock" ON stock
    FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon on product_codes" ON product_codes
    FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon on inventory_settings" ON inventory_settings
    FOR ALL TO public USING (true) WITH CHECK (true);