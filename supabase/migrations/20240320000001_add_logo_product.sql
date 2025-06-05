-- Insert the logo creation product
INSERT INTO products (name, description, price)
VALUES (
    'Company Logo Design',
    'Professional logo design service for your company. Includes initial consultation, 2 rounds of revisions, and final delivery in multiple formats (PNG, JPG, SVG).',
    20.00
)
ON CONFLICT (id) DO NOTHING; 