-- Create payment_methods table for POS payment method management
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default payment methods
INSERT INTO payment_methods (name, is_active) VALUES 
  ('Tunai', true),
  ('QRIS', true),
  ('Kartu Debit', true),
  ('Transfer Bank', true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Allow all access (for now)
CREATE POLICY "Allow all access to payment_methods" ON payment_methods
  FOR ALL USING (true);