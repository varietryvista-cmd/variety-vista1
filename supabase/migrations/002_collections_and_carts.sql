-- ============================================
-- VARIETY VISTA — Migration 002
-- Collections, Server-Side Carts, Product Enhancements
-- ============================================

-- ---- New product columns ----
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS bestseller BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS new_arrival BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS colour TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS model_info TEXT;

-- ---- New review column ----
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS customer_photos TEXT[] DEFAULT '{}';

-- ---- New variant column ----
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS length TEXT;

-- ============================================
-- Collections (curated product groups)
-- ============================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, product_id)
);

-- ============================================
-- Server-side Carts
-- ============================================
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0 AND quantity <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, variant_id)
);

-- ---- Indexes ----
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_active ON collections(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_collection_products_collection ON collection_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_products_product ON collection_products(product_id);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session ON carts(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant ON cart_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(bestseller) WHERE bestseller = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(new_arrival) WHERE new_arrival = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_colour ON products(colour);

-- ---- Auto-update timestamps ----
CREATE TRIGGER set_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION auto_update_updated_at();

CREATE TRIGGER set_carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION auto_update_updated_at();

CREATE TRIGGER set_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION auto_update_updated_at();

-- ============================================
-- RLS Policies
-- ============================================

-- Collections: public read, admin write
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collections are publicly readable" ON collections FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage collections" ON collections FOR ALL USING (is_admin());

ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collection products are publicly readable" ON collection_products FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage collection products" ON collection_products FOR ALL USING (is_admin());

-- Carts: users access own carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own carts" ON carts FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR carts.user_id IS NULL)
    )
  );

-- ============================================
-- Full-text search support
-- ============================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(colour, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(wash, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(tags::TEXT, '')), 'D')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);
