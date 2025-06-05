-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number TEXT UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_address TEXT,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, paid, cancelled
    subtotal DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    terms TEXT,
    stripe_invoice_id TEXT, -- Optional: if we want to link to Stripe
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Invoices: Only authenticated users can manage invoices
CREATE POLICY "Invoices are viewable by authenticated users" ON invoices
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Invoices are insertable by authenticated users" ON invoices
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Invoices are updatable by authenticated users" ON invoices
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Invoices are deletable by authenticated users" ON invoices
    FOR DELETE USING (auth.role() = 'authenticated');

-- Invoice items: Only authenticated users can manage invoice items
CREATE POLICY "Invoice items are viewable by authenticated users" ON invoice_items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Invoice items are insertable by authenticated users" ON invoice_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Invoice items are updatable by authenticated users" ON invoice_items
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Invoice items are deletable by authenticated users" ON invoice_items
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    year TEXT;
    sequence_num INTEGER;
BEGIN
    -- Get current year
    year := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    -- Get the next sequence number for this year
    -- Added explicit casting, coalesce for safety, and fixed substring index to 10
    SELECT COALESCE(MAX(SUBSTRING(invoice_number FROM 10)::INTEGER), 0) + 1
    INTO sequence_num
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || year || '-%'
      AND SUBSTRING(invoice_number FROM 10) ~ '^[0-9]+$'; -- Added regex to ensure substring is numeric

    -- Set the invoice number
    NEW.invoice_number := 'INV-' || year || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate invoice number
CREATE TRIGGER set_invoice_number
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_number();

-- Create trigger to update updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_items_updated_at
    BEFORE UPDATE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 