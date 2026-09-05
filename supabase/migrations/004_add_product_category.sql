-- Add product_category column to products table
-- Allows flexible categories (jeans, tshirts, jackets, etc.) managed via admin panel

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_category TEXT DEFAULT 'jeans';

-- Index for filtering performance
CREATE INDEX IF NOT EXISTS idx_products_product_category ON products(product_category);

-- RLS: categories are publicly readable
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- (existing policies already cover products table)

-- Comment for documentation
COMMENT ON COLUMN products.product_category IS 'Product category (e.g., jeans, tshirts, jackets, shorts, shirts, accessories). Managed via admin panel.';