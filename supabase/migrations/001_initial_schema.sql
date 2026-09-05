-- Enums
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE gender_type AS ENUM ('men', 'women', 'unisex');
CREATE TYPE fit_type AS ENUM ('bootcut', 'baggy', 'straight', 'skinny', 'wide_leg', 'mom', 'flare');
CREATE TYPE rise_type AS ENUM ('low', 'mid', 'high');
CREATE TYPE stretch_type AS ENUM ('rigid', 'stretch', 'super_stretch');
CREATE TYPE product_status AS ENUM ('draft', 'active');
CREATE TYPE image_type AS ENUM ('flat', 'on_model', 'detail');
CREATE TYPE category_type AS ENUM ('gender', 'fit');
CREATE TYPE payment_method_type AS ENUM ('razorpay', 'cod');
CREATE TYPE payment_status_type AS ENUM ('pending', 'paid', 'failed', 'refunded', 'cod_pending');
CREATE TYPE fulfillment_status_type AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'rto');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');

-- 1. profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. site_settings
CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT,
  tagline TEXT,
  logo_url TEXT,
  logo_inverted_url TEXT,
  favicon_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  business_address TEXT,
  currency_code TEXT DEFAULT 'INR',
  currency_symbol TEXT DEFAULT '₹',
  tax_rate NUMERIC DEFAULT 18,
  tax_inclusive BOOLEAN DEFAULT TRUE,
  announcement_messages JSONB,
  cod_enabled BOOLEAN DEFAULT TRUE,
  free_shipping_threshold NUMERIC DEFAULT 999,
  flat_shipping_rate NUMERIC DEFAULT 79,
  shiprocket_pickup_location TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  social_twitter TEXT,
  social_tiktok TEXT,
  social_youtube TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. seo_settings
CREATE TABLE seo_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  meta_title_template TEXT,
  default_meta_description TEXT,
  og_default_image_url TEXT,
  ga_tracking_id TEXT,
  fb_pixel_id TEXT,
  search_console_meta TEXT,
  robots_txt TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. page_seo
CREATE TABLE page_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT UNIQUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT
);

-- 5. categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type category_type NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  gender gender_type,
  fit_type fit_type,
  wash TEXT,
  rise rise_type,
  stretch_type stretch_type,
  fabric_composition TEXT,
  price NUMERIC NOT NULL,
  sale_price NUMERIC,
  sale_start TIMESTAMPTZ,
  sale_end TIMESTAMPTZ,
  sku_prefix TEXT,
  status product_status DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. product_images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  image_type image_type,
  sort_order INT DEFAULT 0,
  alt_text TEXT
);

-- 8. product_variants
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products ON DELETE CASCADE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  waist_size INT NOT NULL,
  inseam_length INT,
  price NUMERIC,
  stock_quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. size_guide
CREATE TABLE size_guide (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gender gender_type,
  waist_size INT,
  hip_range TEXT,
  inseam_options JSONB
);

-- 10. addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  shipping_method TEXT,
  shipping_cost NUMERIC DEFAULT 0,
  subtotal NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  coupon_code TEXT,
  payment_method payment_method_type NOT NULL,
  payment_status payment_status_type DEFAULT 'pending',
  fulfillment_status fulfillment_status_type DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  shiprocket_order_id TEXT,
  shiprocket_shipment_id TEXT,
  awb_code TEXT,
  courier_name TEXT,
  tracking_status TEXT,
  estimated_delivery_date TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants ON DELETE SET NULL,
  title TEXT NOT NULL,
  waist_size INT,
  inseam_length INT,
  wash TEXT,
  quantity INT NOT NULL,
  unit_price NUMERIC NOT NULL,
  line_total NUMERIC NOT NULL
);

-- 13. order_timeline
CREATE TABLE order_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  created_by UUID REFERENCES profiles ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  title TEXT,
  body TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type coupon_type NOT NULL,
  value NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0,
  usage_limit INT,
  per_customer_limit INT DEFAULT 1,
  times_used INT DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  applicable_products UUID[],
  applicable_fit_types TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. hero_slides
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  heading TEXT,
  subheading TEXT,
  cta_text TEXT,
  cta_link TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- 18. wishlist
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 19. media
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT,
  size INT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. contact_messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_fit_type ON products(fit_type);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_waist_size ON product_variants(waist_size);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_fulfillment_status ON orders(fulfillment_status);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_type ON categories(type);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);

-- Triggers / Functions

-- 1. handle_new_user()
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- 2. auto_update_updated_at()
CREATE OR REPLACE FUNCTION auto_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE auto_update_updated_at();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE auto_update_updated_at();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE PROCEDURE auto_update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE auto_update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE auto_update_updated_at();

-- 3. generate_order_number()
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 10001;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'VV-' || nextval('order_number_seq')::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE PROCEDURE generate_order_number();

-- 4. decrement_stock_on_order()
CREATE OR REPLACE FUNCTION decrement_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.variant_id IS NOT NULL THEN
    UPDATE product_variants
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.variant_id AND stock_quantity >= NEW.quantity;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_stock
  AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE PROCEDURE decrement_stock_on_order();

-- 5. increment_coupon_usage()
CREATE OR REPLACE FUNCTION increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.coupon_code IS NOT NULL THEN
    UPDATE coupons
    SET times_used = times_used + 1
    WHERE code = NEW.coupon_code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_coupon
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE PROCEDURE increment_coupon_usage();

-- 6. log_tracking_status_change()
CREATE OR REPLACE FUNCTION log_tracking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.tracking_status IS DISTINCT FROM NEW.tracking_status) AND NEW.tracking_status IS NOT NULL THEN
    INSERT INTO order_timeline (order_id, status, note, created_at)
    VALUES (NEW.id, 'tracking_updated', 'Tracking status updated to ' || NEW.tracking_status, NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_tracking_status
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE PROCEDURE log_tracking_status_change();


-- RLS Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE size_guide ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- profiles
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "Admins can insert profiles" ON profiles FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE USING (is_admin());

-- site_settings, seo_settings, categories, products, product_images, product_variants, size_guide, hero_slides
CREATE POLICY "Public read access for site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin write access for site_settings" ON site_settings FOR ALL USING (is_admin());

CREATE POLICY "Public read access for seo_settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Admin write access for seo_settings" ON seo_settings FOR ALL USING (is_admin());

CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin write access for categories" ON categories FOR ALL USING (is_admin());

CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin write access for products" ON products FOR ALL USING (is_admin());

CREATE POLICY "Public read access for product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admin write access for product_images" ON product_images FOR ALL USING (is_admin());

CREATE POLICY "Public read access for product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Admin write access for product_variants" ON product_variants FOR ALL USING (is_admin());

CREATE POLICY "Public read access for size_guide" ON size_guide FOR SELECT USING (true);
CREATE POLICY "Admin write access for size_guide" ON size_guide FOR ALL USING (is_admin());

CREATE POLICY "Public read access for hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Admin write access for hero_slides" ON hero_slides FOR ALL USING (is_admin());

-- addresses: users read/write own only; admins read all
CREATE POLICY "Users access own addresses" ON addresses FOR ALL USING (auth.uid() = user_id OR is_admin());

-- orders: users read own; admins read all
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admin write access for orders" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete access for orders" ON orders FOR DELETE USING (is_admin());

-- order_items: users read own (via order); admins read all
CREATE POLICY "Users read own order_items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Users create own order_items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Admin write access for order_items" ON order_items FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete access for order_items" ON order_items FOR DELETE USING (is_admin());

-- reviews: publicly readable; authenticated users can create; admins can delete/update
CREATE POLICY "Public read access for reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Auth users insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin delete access for reviews" ON reviews FOR DELETE USING (is_admin());
CREATE POLICY "Admin update access for reviews" ON reviews FOR UPDATE USING (is_admin());

-- wishlist: users read/write own only
CREATE POLICY "Users access own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- subscribers: anyone can insert; admins can read
CREATE POLICY "Anyone can insert subscriber" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read access for subscribers" ON subscribers FOR SELECT USING (is_admin());
CREATE POLICY "Admin delete access for subscribers" ON subscribers FOR DELETE USING (is_admin());

-- contact_messages: anyone can insert; admins can read/update
CREATE POLICY "Anyone can insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read update access for contact_messages" ON contact_messages FOR ALL USING (is_admin());

-- media: admins only
CREATE POLICY "Admin access for media" ON media FOR ALL USING (is_admin());

-- page_seo: publicly readable; admin write
CREATE POLICY "Public read access for page_seo" ON page_seo FOR SELECT USING (true);
CREATE POLICY "Admin write access for page_seo" ON page_seo FOR ALL USING (is_admin());

-- coupons: publicly readable active coupons; admin full CRUD
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin access for coupons" ON coupons FOR ALL USING (is_admin());

-- order_timeline: users read own order timelines; admins read/write all
CREATE POLICY "Users read own order timelines" ON order_timeline FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_timeline.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Admin write access for order_timeline" ON order_timeline FOR ALL USING (is_admin());
