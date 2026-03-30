-- ============================================
-- Database Schema for Invoices Module
-- ============================================

-- 1. Invoices Table (for manual invoice creation)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(100),
    customer_address TEXT,
    subtotal DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    amount_paid DECIMAL(15, 2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'pending',
    status VARCHAR(20) DEFAULT 'draft',
    due_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Invoice Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(500),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_name);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);

-- 4. Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- 5. Create policies
CREATE POLICY "Allow all for anon on invoices" ON invoices
    FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for anon on invoice_items" ON invoice_items
    FOR ALL TO public USING (true) WITH CHECK (true);

-- 6. Invoice Settings Table
CREATE TABLE IF NOT EXISTS invoice_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default invoice settings
INSERT INTO invoice_settings (key, value) VALUES
    ('invoice_prefix', 'INV'),
    ('invoice_starting_number', '1000'),
    ('invoice_digits', '4'),
    ('default_due_days', '14'),
    ('enable_late_fee', 'true'),
    ('late_fee_percentage', '2'),
    ('late_fee_fixed', '50000'),
    ('tax_rate', '11'),
    ('tax_name', 'PPN'),
    ('tax_inclusive', 'true'),
    ('company_name', 'Sellora Store'),
    ('company_address', 'Jl. Contoh No. 123, Jakarta, Indonesia'),
    ('company_phone', '+62 812 3456 7890'),
    ('company_email', 'admin@sellora.com'),
    ('company_tax_id', '12.345.678.9-123.456'),
    ('send_email_on_invoice_created', 'true'),
    ('send_reminder_before_due', 'true'),
    ('reminder_days_before', '3'),
    ('send_email_on_payment', 'true')
ON CONFLICT (key) DO NOTHING;