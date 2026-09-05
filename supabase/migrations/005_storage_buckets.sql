-- Create storage buckets for product images and other assets

-- Product images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Hero slides bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-slides',
  'hero-slides',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Category images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'category-images',
  'category-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- RLS Policies for product-images bucket
-- Public read access
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Admin write access
CREATE POLICY "Admin write access for product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admin update access for product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admin delete access for product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND is_admin());

-- RLS Policies for hero-slides bucket
CREATE POLICY "Public read access for hero slides"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-slides');

CREATE POLICY "Admin write access for hero slides"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hero-slides' AND is_admin());

CREATE POLICY "Admin update access for hero slides"
ON storage.objects FOR UPDATE
USING (bucket_id = 'hero-slides' AND is_admin());

CREATE POLICY "Admin delete access for hero slides"
ON storage.objects FOR DELETE
USING (bucket_id = 'hero-slides' AND is_admin());

-- RLS Policies for category-images bucket
CREATE POLICY "Public read access for category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

CREATE POLICY "Admin write access for category images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'category-images' AND is_admin());

CREATE POLICY "Admin update access for category images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'category-images' AND is_admin());

CREATE POLICY "Admin delete access for category images"
ON storage.objects FOR DELETE
USING (bucket_id = 'category-images' AND is_admin());