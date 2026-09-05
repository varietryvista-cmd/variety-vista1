-- Seed Data for Variety Vista

-- Default site_settings
INSERT INTO site_settings (
  id, site_name, tagline, logo_url, logo_inverted_url, favicon_url, contact_email, contact_phone, business_address, 
  currency_code, currency_symbol, tax_rate, tax_inclusive, announcement_messages, cod_enabled, 
  free_shipping_threshold, flat_shipping_rate, social_instagram
) VALUES (
  1, 'Variety Vista', 'Premium Indian Denim', '/brand/logo.jpg', '/brand/logo.jpg', '/brand/logo.jpg', 'varietryvista@gmail.com', '+91 99202 55905', 'Mumbai, Maharashtra 400001, India',
  'INR', '₹', 18, TRUE, '[{"text": "Free shipping on orders over ₹999 across India!", "link": null}, {"text": "New Summer Denim Collection is live", "link": "/collections/new-arrivals"}]'::jsonb, TRUE,
  999, 79, 'https://instagram.com/varietyvista'
) ON CONFLICT (id) DO NOTHING;

-- Default seo_settings
INSERT INTO seo_settings (
  id, meta_title_template, default_meta_description, og_default_image_url
) VALUES (
  1, '%s | Variety Vista', 'Shop premium denim jeans at Variety Vista. Discover bootcut, baggy, straight, and skinny fits for men and women.', '/brand/logo.jpg'
) ON CONFLICT (id) DO NOTHING;

-- Sample Categories
INSERT INTO categories (id, name, slug, type, description) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Men', 'men', 'gender', 'Shop men''s premium denim jeans'),
  ('c2000000-0000-0000-0000-000000000002', 'Women', 'women', 'gender', 'Shop women''s premium denim jeans'),
  ('c3000000-0000-0000-0000-000000000003', 'Bootcut', 'bootcut', 'fit', 'Classic bootcut jeans'),
  ('c4000000-0000-0000-0000-000000000004', 'Baggy', 'baggy', 'fit', 'Relaxed and baggy fit jeans'),
  ('c5000000-0000-0000-0000-000000000005', 'Straight', 'straight', 'fit', 'Timeless straight fit denim'),
  ('c6000000-0000-0000-0000-000000000006', 'Skinny', 'skinny', 'fit', 'Form-fitting skinny jeans'),
  ('c7000000-0000-0000-0000-000000000007', 'Wide Leg', 'wide-leg', 'fit', 'Trendy wide leg jeans'),
  ('c8000000-0000-0000-0000-000000000008', 'Mom', 'mom', 'fit', 'Vintage inspired mom jeans'),
  ('c9000000-0000-0000-0000-000000000009', 'Flare', 'flare', 'fit', 'Retro flare jeans')
ON CONFLICT (slug) DO NOTHING;

-- Sample Products
INSERT INTO products (id, title, slug, description, gender, fit_type, wash, rise, stretch_type, fabric_composition, price, sale_price, status) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'Dark Indigo Bootcut Jeans', 'dark-indigo-bootcut-jeans', 'Classic dark indigo bootcut jeans perfect for everyday wear.', 'men', 'bootcut', 'Dark Wash', 'mid', 'rigid', '100% Cotton', 2499, NULL, 'active'),
  ('p2000000-0000-0000-0000-000000000002', 'Washed Black Skinny Fit', 'washed-black-skinny-fit', 'Edgy washed black skinny jeans with a bit of stretch.', 'women', 'skinny', 'Washed Black', 'high', 'super_stretch', '98% Cotton, 2% Elastane', 1999, 1799, 'active'),
  ('p3000000-0000-0000-0000-000000000003', 'Vintage Light Wash Baggy Jeans', 'vintage-light-wash-baggy-jeans', 'Relaxed baggy jeans with a vintage light wash feel.', 'unisex', 'baggy', 'Light Wash', 'mid', 'rigid', '100% Cotton', 2799, NULL, 'active'),
  ('p4000000-0000-0000-0000-000000000004', 'Classic Blue Straight Jeans', 'classic-blue-straight-jeans', 'Your essential classic blue straight jeans.', 'men', 'straight', 'Medium Blue', 'mid', 'stretch', '99% Cotton, 1% Spandex', 2199, NULL, 'active'),
  ('p5000000-0000-0000-0000-000000000005', 'Heavy Acid Wash Denim', 'heavy-acid-wash-denim', 'Bold 80s-inspired heavy acid wash pattern with tactile texture.', 'men', 'baggy', 'Acid Wash', 'high', 'rigid', '100% Cotton', 2899, 2199, 'active'),
  ('p6000000-0000-0000-0000-000000000006', 'Faded Stonewash Straight Jeans', 'faded-stonewash-straight-jeans', 'Sun-kissed authentic stonewash finish with handcrafted fading.', 'men', 'straight', 'Light Blue', 'mid', 'stretch', '98% Cotton, 2% Spandex', 2399, NULL, 'active'),
  ('p7000000-0000-0000-0000-000000000007', 'Vintage Washed Indigo Jeans', 'vintage-washed-indigo-jeans', 'Rich vintage wash with natural whisker details across thighs.', 'men', 'bootcut', 'Mid Blue', 'mid', 'stretch', '99% Cotton, 1% Spandex', 2599, NULL, 'active'),
  ('p8000000-0000-0000-0000-000000000008', 'Vintage Light Wash Straight', 'vintage-light-wash-straight', 'Signature light blue denim in a tailored straight leg.', 'men', 'straight', 'Light Blue', 'mid', 'rigid', '100% Cotton', 2199, NULL, 'active'),
  -- Women's Collection
  ('p9000000-0000-0000-0000-000000000009', 'Mid Rise Skinny Ankle Jeans', 'mid-rise-skinny-ankle-jeans', 'Sleek mid-rise skinny jeans that hit perfectly at the ankle.', 'women', 'skinny', 'Dark Indigo', 'mid', 'super_stretch', '97% Cotton, 3% Elastane', 2299, NULL, 'active'),
  ('p9000001-0000-0000-0000-000000000010', 'High Waisted Mom Jeans', 'high-waisted-mom-jeans', 'Vintage-inspired high-waisted mom jeans with relaxed fit through hip.', 'women', 'mom', 'Light Wash', 'high', 'rigid', '100% Cotton', 2599, 1999, 'active'),
  ('p9000002-0000-0000-0000-000000000011', 'Flare Leg Stretch Jeans', 'flare-leg-stretch-jeans', 'Retro flare silhouette with modern stretch comfort.', 'women', 'flare', 'Medium Blue', 'high', 'stretch', '98% Cotton, 2% Spandex', 2499, NULL, 'active'),
  ('p9000003-0000-0000-0000-000000000012', 'Wide Leg Cropped Denim', 'wide-leg-cropped-denim', 'Contemporary wide leg with cropped length for a modern look.', 'women', 'wide_leg', 'Off White', 'mid', 'rigid', '100% Organic Cotton', 2799, NULL, 'active'),
  ('p9000004-0000-0000-0000-000000000013', 'Super High Rise Skinny', 'super-high-rise-skinny', 'Ultra-flattering super high rise with sculpting stretch.', 'women', 'skinny', 'Black', 'high', 'super_stretch', '96% Cotton, 4% Elastane', 2399, NULL, 'active'),
  ('p9000005-0000-0000-0000-000000000014', 'Boyfriend Fit Jeans', 'boyfriend-fit-jeans', 'Relaxed boyfriend fit with subtle distressing at knees.', 'women', 'baggy', 'Medium Wash', 'mid', 'stretch', '99% Cotton, 1% Spandex', 2699, 2199, 'active'),
  ('p9000006-0000-0000-0000-000000000015', 'High Rise Straight Leg', 'high-rise-straight-leg', 'Timeless high-rise straight leg in premium selvedge denim.', 'women', 'straight', 'Raw Indigo', 'high', 'rigid', '100% Cotton Selvedge', 3299, NULL, 'active'),
  -- Men's Extended Collection
  ('p9000007-0000-0000-0000-000000000016', 'Raw Selvedge Straight Jeans', 'raw-selvedge-straight-jeans', 'Premium Japanese selvedge denim in classic straight fit.', 'men', 'straight', 'Raw', 'mid', 'rigid', '100% Japanese Selvedge Cotton', 3999, NULL, 'active'),
  ('p9000008-0000-0000-0000-000000000017', 'Tapered Fit Chino Denim', 'tapered-fit-chino-denim', 'Smart casual tapered denim with chino styling details.', 'men', 'straight', 'Khaki', 'mid', 'stretch', '98% Cotton, 2% Elastane', 2499, NULL, 'active'),
  ('p9000009-0000-0000-0000-000000000018', 'Relaxed Bootcut Jeans', 'relaxed-bootcut-jeans', 'Comfortable relaxed bootcut with room through thigh.', 'men', 'bootcut', 'Dark Rinse', 'mid', 'stretch', '99% Cotton, 1% Spandex', 2599, NULL, 'active'),
  ('p9000010-0000-0000-0000-000000000019', 'Slim Taper Stretch Denim', 'slim-taper-stretch-denim', 'Modern slim taper with 360-degree stretch for all-day comfort.', 'men', 'straight', 'Navy', 'mid', 'super_stretch', '95% Cotton, 5% Elastane', 2799, 2299, 'active'),
  ('p9000011-0000-0000-0000-000000000020', 'Heavyweight Baggy Jeans', 'heavyweight-baggy-jeans', 'Heavyweight 14oz denim in oversized baggy silhouette.', 'men', 'baggy', 'Raw Indigo', 'mid', 'rigid', '100% Heavyweight Cotton', 3499, NULL, 'active'),
  ('p9000012-0000-0000-0000-000000000021', 'Mid Rise Straight Jeans', 'mid-rise-straight-jeans', 'Classic mid-rise straight leg — the ultimate wardrobe staple.', 'men', 'straight', 'Classic Blue', 'mid', 'stretch', '99% Cotton, 1% Spandex', 2199, NULL, 'active'),
  -- Unisex / Gender-Neutral
  ('p9000013-0000-0000-0000-000000000022', 'Oversized Wide Leg Jeans', 'oversized-wide-leg-jeans', 'Statement oversized wide leg for effortless cool.', 'unisex', 'wide_leg', 'Ecru', 'high', 'rigid', '100% Organic Cotton', 2999, NULL, 'active'),
  ('p9000014-0000-0000-0000-000000000023', 'Distressed Straight Fit', 'distressed-straight-fit', 'Artfully distressed straight leg with authentic wear patterns.', 'unisex', 'straight', 'Vintage Grey', 'mid', 'stretch', '98% Cotton, 2% Spandex', 2899, 2399, 'active'),
  ('p9000015-0000-0000-0000-000000000024', 'Classic 5-Pocket Bootcut', 'classic-5-pocket-bootcut', 'Iconic 5-pocket bootcut in versatile mid wash.', 'unisex', 'bootcut', 'Mid Wash', 'mid', 'rigid', '100% Cotton', 2299, NULL, 'active'),
  ('p9000016-0000-0000-0000-000000000025', 'Double Knee Work Jeans', 'double-knee-work-jeans', 'Utility-inspired double knee construction in durable denim.', 'unisex', 'baggy', 'Brown Duck', 'high', 'rigid', '100% Cotton Canvas', 3199, NULL, 'active'),
  ('p9000017-0000-0000-0000-000000000026', 'High Rise Flare Jeans', 'high-rise-flare-jeans', 'Dramatic high-rise flare with elongated leg line.', 'women', 'flare', 'Deep Indigo', 'high', 'stretch', '98% Cotton, 2% Spandex', 2699, NULL, 'active'),
  ('p9000018-0000-0000-0000-000000000027', 'Low Rise Baggy Jeans', 'low-rise-baggy-jeans', 'Y2K-inspired low-rise baggy fit with vintage wash.', 'unisex', 'baggy', 'Faded Blue', 'low', 'rigid', '100% Cotton', 2599, 1999, 'active')
ON CONFLICT (slug) DO NOTHING;

-- Sample Product Images
INSERT INTO product_images (product_id, image_url, image_type, sort_order) VALUES
  ('p1000000-0000-0000-0000-000000000001', '/assets/PHOTO-2026-08-02-12-56-13.jpg', 'on_model', 1),
  ('p1000000-0000-0000-0000-000000000001', '/assets/PHOTO-2026-08-02-12-56-14.jpg', 'on_model', 2),
  ('p2000000-0000-0000-0000-000000000002', '/assets/PHOTO-2026-08-02-12-56-20.jpg', 'on_model', 1),
  ('p3000000-0000-0000-0000-000000000003', '/assets/PHOTO-2026-08-02-12-56-16.jpg', 'on_model', 1),
  ('p4000000-0000-0000-0000-000000000004', '/assets/PHOTO-2026-08-02-12-56-05.jpg', 'on_model', 1),
  ('p5000000-0000-0000-0000-000000000005', '/assets/PHOTO-2026-08-02-12-56-34.jpg', 'on_model', 1),
  ('p6000000-0000-0000-0000-000000000006', '/assets/PHOTO-2026-08-02-12-56-23.jpg', 'on_model', 1),
  ('p7000000-0000-0000-0000-000000000007', '/assets/PHOTO-2026-08-02-12-56-08.jpg', 'on_model', 1),
  ('p8000000-0000-0000-0000-000000000008', '/assets/PHOTO-2026-08-02-12-56-01.jpg', 'on_model', 1),
  -- Women's Collection Images
  ('p9000000-0000-0000-0000-000000000009', '/assets/PHOTO-2026-08-02-12-56-26.jpg', 'on_model', 1),
  ('p9000001-0000-0000-0000-000000000010', '/assets/PHOTO-2026-08-02-12-56-21.jpg', 'on_model', 1),
  ('p9000002-0000-0000-0000-000000000011', '/assets/PHOTO-2026-08-02-12-56-06.jpg', 'on_model', 1),
  ('p9000003-0000-0000-0000-000000000012', '/assets/PHOTO-2026-08-02-12-56-13.jpg', 'on_model', 1),
  ('p9000004-0000-0000-0000-000000000013', '/assets/PHOTO-2026-08-02-12-56-20.jpg', 'on_model', 1),
  ('p9000005-0000-0000-0000-000000000014', '/assets/PHOTO-2026-08-02-12-56-16.jpg', 'on_model', 1),
  ('p9000006-0000-0000-0000-000000000015', '/assets/PHOTO-2026-08-02-12-56-05.jpg', 'on_model', 1),
  -- Men's Extended Collection Images
  ('p9000007-0000-0000-0000-000000000016', '/assets/PHOTO-2026-08-02-12-56-34.jpg', 'on_model', 1),
  ('p9000008-0000-0000-0000-000000000017', '/assets/PHOTO-2026-08-02-12-56-23.jpg', 'on_model', 1),
  ('p9000009-0000-0000-0000-000000000018', '/assets/PHOTO-2026-08-02-12-56-08.jpg', 'on_model', 1),
  ('p9000010-0000-0000-0000-000000000019', '/assets/PHOTO-2026-08-02-12-56-01.jpg', 'on_model', 1),
  ('p9000011-0000-0000-0000-000000000020', '/assets/PHOTO-2026-08-02-12-56-26.jpg', 'on_model', 1),
  ('p9000012-0000-0000-0000-000000000021', '/assets/PHOTO-2026-08-02-12-56-21.jpg', 'on_model', 1),
  -- Unisex Images
  ('p9000013-0000-0000-0000-000000000022', '/assets/PHOTO-2026-08-02-12-56-06.jpg', 'on_model', 1),
  ('p9000014-0000-0000-0000-000000000023', '/assets/PHOTO-2026-08-02-12-56-13.jpg', 'on_model', 1),
  ('p9000015-0000-0000-0000-000000000024', '/assets/PHOTO-2026-08-02-12-56-20.jpg', 'on_model', 1),
  ('p9000016-0000-0000-0000-000000000025', '/assets/PHOTO-2026-08-02-12-56-05.jpg', 'on_model', 1),
  ('p9000017-0000-0000-0000-000000000026', '/assets/PHOTO-2026-08-02-12-56-34.jpg', 'on_model', 1),
  ('p9000018-0000-0000-0000-000000000027', '/assets/PHOTO-2026-08-02-12-56-23.jpg', 'on_model', 1);

-- Sample Product Variants (waist sizes)
INSERT INTO product_variants (product_id, sku, waist_size, inseam_length, stock_quantity) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'M-BOOT-DK-30', 30, 32, 10),
  ('p1000000-0000-0000-0000-000000000001', 'M-BOOT-DK-32', 32, 32, 15),
  ('p1000000-0000-0000-0000-000000000001', 'M-BOOT-DK-34', 34, 32, 8),
  ('p2000000-0000-0000-0000-000000000002', 'W-SKIN-BLK-26', 26, 30, 20),
  ('p2000000-0000-0000-0000-000000000002', 'W-SKIN-BLK-28', 28, 30, 25),
  ('p3000000-0000-0000-0000-000000000003', 'U-BAG-LT-32', 32, 30, 5),
  ('p4000000-0000-0000-0000-000000000004', 'M-STR-BLU-34', 34, 32, 12),
  ('p5000000-0000-0000-0000-000000000005', 'M-ACD-BG-30', 30, 32, 18),
  ('p6000000-0000-0000-0000-000000000006', 'M-STN-30', 30, 30, 7),
  ('p7000000-0000-0000-0000-000000000007', 'M-VNT-32', 32, 32, 10),
  ('p8000000-0000-0000-0000-000000000008', 'M-LT-STR-32', 32, 32, 14),
  -- Women's Collection Variants
  ('p9000000-0000-0000-0000-000000000009', 'W-SKN-DK-24', 24, 28, 15),
  ('p9000000-0000-0000-0000-000000000009', 'W-SKN-DK-26', 26, 28, 20),
  ('p9000000-0000-0000-0000-000000000009', 'W-SKN-DK-28', 28, 30, 18),
  ('p9000000-0000-0000-0000-000000000009', 'W-SKN-DK-30', 30, 30, 12),
  ('p9000000-0000-0000-0000-000000000009', 'W-SKN-DK-32', 32, 30, 8),
  ('p9000001-0000-0000-0000-000000000010', 'W-MOM-LT-26', 26, 29, 18),
  ('p9000001-0000-0000-0000-000000000010', 'W-MOM-LT-28', 28, 29, 22),
  ('p9000001-0000-0000-0000-000000000010', 'W-MOM-LT-30', 30, 30, 15),
  ('p9000001-0000-0000-0000-000000000010', 'W-MOM-LT-32', 32, 30, 10),
  ('p9000002-0000-0000-0000-000000000011', 'W-FLR-MB-26', 26, 32, 12),
  ('p9000002-0000-0000-0000-000000000011', 'W-FLR-MB-28', 28, 32, 18),
  ('p9000002-0000-0000-0000-000000000011', 'W-FLR-MB-30', 30, 32, 15),
  ('p9000002-0000-0000-0000-000000000011', 'W-FLR-MB-32', 32, 34, 8),
  ('p9000003-0000-0000-0000-000000000012', 'W-WLG-OW-24', 24, 26, 10),
  ('p9000003-0000-0000-0000-000000000012', 'W-WLG-OW-26', 26, 26, 15),
  ('p9000003-0000-0000-0000-000000000012', 'W-WLG-OW-28', 28, 28, 12),
  ('p9000003-0000-0000-0000-000000000012', 'W-WLG-OW-30', 30, 28, 8),
  ('p9000004-0000-0000-0000-000000000013', 'W-SHR-BL-24', 24, 28, 20),
  ('p9000004-0000-0000-0000-000000000013', 'W-SHR-BL-26', 26, 28, 25),
  ('p9000004-0000-0000-0000-000000000013', 'W-SHR-BL-28', 28, 30, 18),
  ('p9000004-0000-0000-0000-000000000013', 'W-SHR-BL-30', 30, 30, 12),
  ('p9000005-0000-0000-0000-000000000014', 'W-BF-MW-26', 26, 29, 15),
  ('p9000005-0000-0000-0000-000000000014', 'W-BF-MW-28', 28, 29, 20),
  ('p9000005-0000-0000-0000-000000000014', 'W-BF-MW-30', 30, 30, 12),
  ('p9000005-0000-0000-0000-000000000014', 'W-BF-MW-32', 32, 30, 8),
  ('p9000006-0000-0000-0000-000000000015', 'W-HRS-RA-26', 26, 32, 10),
  ('p9000006-0000-0000-0000-000000000015', 'W-HRS-RA-28', 28, 32, 14),
  ('p9000006-0000-0000-0000-000000000015', 'W-HRS-RA-30', 30, 32, 10),
  ('p9000006-0000-0000-0000-000000000015', 'W-HRS-RA-32', 32, 34, 6),
  -- Men's Extended Collection Variants
  ('p9000007-0000-0000-0000-000000000016', 'M-RAW-SL-30', 30, 32, 8),
  ('p9000007-0000-0000-0000-000000000016', 'M-RAW-SL-32', 32, 32, 12),
  ('p9000007-0000-0000-0000-000000000016', 'M-RAW-SL-34', 34, 32, 10),
  ('p9000007-0000-0000-0000-000000000016', 'M-RAW-SL-36', 36, 32, 6),
  ('p9000008-0000-0000-0000-000000000017', 'M-TAP-KH-30', 30, 32, 15),
  ('p9000008-0000-0000-0000-000000000017', 'M-TAP-KH-32', 32, 32, 20),
  ('p9000008-0000-0000-0000-000000000017', 'M-TAP-KH-34', 34, 32, 12),
  ('p9000008-0000-0000-0000-000000000017', 'M-TAP-KH-36', 36, 32, 8),
  ('p9000009-0000-0000-0000-000000000018', 'M-RBC-DR-32', 32, 32, 12),
  ('p9000009-0000-0000-0000-000000000018', 'M-RBC-DR-34', 34, 32, 18),
  ('p9000009-0000-0000-0000-000000000018', 'M-RBC-DR-36', 36, 32, 10),
  ('p9000010-0000-0000-0000-000000000019', 'M-STP-NV-30', 30, 32, 15),
  ('p9000010-0000-0000-0000-000000000019', 'M-STP-NV-32', 32, 32, 22),
  ('p9000010-0000-0000-0000-000000000019', 'M-STP-NV-34', 34, 32, 14),
  ('p9000010-0000-0000-0000-000000000019', 'M-STP-NV-36', 36, 32, 8),
  ('p9000011-0000-0000-0000-000000000020', 'M-HVY-BG-32', 32, 30, 8),
  ('p9000011-0000-0000-0000-000000000020', 'M-HVY-BG-34', 34, 30, 12),
  ('p9000011-0000-0000-0000-000000000020', 'M-HVY-BG-36', 36, 30, 10),
  ('p9000011-0000-0000-0000-000000000020', 'M-HVY-BG-38', 38, 30, 6),
  ('p9000012-0000-0000-0000-000000000021', 'M-MRS-CB-30', 30, 32, 20),
  ('p9000012-0000-0000-0000-000000000021', 'M-MRS-CB-32', 32, 32, 25),
  ('p9000012-0000-0000-0000-000000000021', 'M-MRS-CB-34', 34, 32, 15),
  ('p9000012-0000-0000-0000-000000000021', 'M-MRS-CB-36', 36, 32, 10),
  -- Unisex Variants
  ('p9000013-0000-0000-0000-000000000022', 'U-WLG-EC-28', 28, 30, 12),
  ('p9000013-0000-0000-0000-000000000022', 'U-WLG-EC-30', 30, 30, 18),
  ('p9000013-0000-0000-0000-000000000022', 'U-WLG-EC-32', 32, 32, 14),
  ('p9000013-0000-0000-0000-000000000022', 'U-WLG-EC-34', 34, 32, 8),
  ('p9000014-0000-0000-0000-000000000023', 'U-DST-VG-30', 30, 32, 15),
  ('p9000014-0000-0000-0000-000000000023', 'U-DST-VG-32', 32, 32, 20),
  ('p9000014-0000-0000-0000-000000000023', 'U-DST-VG-34', 34, 32, 12),
  ('p9000014-0000-0000-0000-000000000023', 'U-DST-VG-36', 36, 32, 8),
  ('p9000015-0000-0000-0000-000000000024', 'U-BC-MW-28', 28, 32, 12),
  ('p9000015-0000-0000-0000-000000000024', 'U-BC-MW-30', 30, 32, 18),
  ('p9000015-0000-0000-0000-000000000024', 'U-BC-MW-32', 32, 32, 14),
  ('p9000015-0000-0000-0000-000000000024', 'U-BC-MW-34', 34, 32, 8),
  ('p9000016-0000-0000-0000-000000000025', 'U-DK-BD-30', 30, 32, 10),
  ('p9000016-0000-0000-0000-000000000025', 'U-DK-BD-32', 32, 32, 15),
  ('p9000016-0000-0000-0000-000000000025', 'U-DK-BD-34', 34, 32, 12),
  ('p9000016-0000-0000-0000-000000000025', 'U-DK-BD-36', 36, 32, 6),
  ('p9000017-0000-0000-0000-000000000026', 'W-HRF-DI-26', 26, 34, 12),
  ('p9000017-0000-0000-0000-000000000026', 'W-HRF-DI-28', 28, 34, 18),
  ('p9000017-0000-0000-0000-000000000026', 'W-HRF-DI-30', 30, 34, 14),
  ('p9000017-0000-0000-0000-000000000026', 'W-HRF-DI-32', 32, 34, 8),
  ('p9000018-0000-0000-0000-000000000027', 'U-LRB-FB-28', 28, 30, 15),
  ('p9000018-0000-0000-0000-000000000027', 'U-LRB-FB-30', 30, 30, 20),
  ('p9000018-0000-0000-0000-000000000027', 'U-LRB-FB-32', 32, 30, 12),
  ('p9000018-0000-0000-0000-000000000027', 'U-LRB-FB-34', 34, 30, 8)
ON CONFLICT (sku) DO NOTHING;

-- Sample Size Guide
INSERT INTO size_guide (gender, waist_size, hip_range, inseam_options) VALUES
  ('men', 30, '36-38', '[30, 32, 34]'::jsonb),
  ('men', 32, '38-40', '[30, 32, 34]'::jsonb),
  ('men', 34, '40-42', '[30, 32, 34]'::jsonb),
  ('men', 36, '42-44', '[30, 32, 34]'::jsonb),
  ('women', 24, '32-34', '[26, 28]'::jsonb),
  ('women', 26, '34-36', '[28, 30]'::jsonb),
  ('women', 28, '36-38', '[28, 30, 32]'::jsonb),
  ('women', 30, '38-40', '[30, 32]'::jsonb),
  ('women', 32, '40-42', '[30, 32]'::jsonb),
  ('unisex', 28, '36-38', '[30, 32]'::jsonb),
  ('unisex', 30, '38-40', '[30, 32, 34]'::jsonb),
  ('unisex', 32, '40-42', '[30, 32, 34]'::jsonb),
  ('unisex', 34, '42-44', '[30, 32, 34]'::jsonb);

-- Hero Slides
INSERT INTO hero_slides (image_url, heading, subheading, cta_text, cta_link, sort_order) VALUES
  ('/assets/PHOTO-2026-08-02-12-56-01.jpg', 'Fits That Move With You', 'Discover our latest collection of premium Indian denim.', 'Shop New Arrivals', '/collections/new-arrivals', 1),
  ('/assets/PHOTO-2026-08-02-12-56-34.jpg', 'Acid Wash. Raw Energy.', 'Vintage textures, authentic wash, all-day confidence.', 'Shop Heavy Acid Wash', '/products/heavy-acid-wash-denim', 2),
  ('/assets/PHOTO-2026-08-02-12-56-17.jpg', 'Flat ₹500 Off', 'Use code DENIM500 at checkout. Free shipping across India.', 'Explore All Fits', '/collections/all', 3),
  ('/assets/PHOTO-2026-08-02-12-56-06.jpg', 'Wide Leg Freedom', 'Oversized silhouettes for the modern wardrobe.', 'Shop Wide Leg', '/collections/wide-leg', 4),
  ('/assets/PHOTO-2026-08-02-12-56-13.jpg', 'Bootcut Revival', 'Classic bootcut reimagined for today.', 'Shop Bootcut', '/collections/bootcut', 5),
  ('/assets/PHOTO-2026-08-02-12-56-20.jpg', 'Skinny Perfected', 'Sculpting stretch, flawless fit.', 'Shop Skinny', '/collections/skinny', 6);

-- Sample Coupon
INSERT INTO coupons (code, type, value, min_order_amount, is_active) VALUES
  ('DENIM500', 'fixed', 500, 1999, true),
  ('DENIM10', 'percentage', 10, 1500, true),
  ('WELCOME15', 'percentage', 15, 1000, true),
  ('FREESHIP', 'fixed', 79, 999, true),
  ('VISTA20', 'percentage', 20, 3000, true),
  ('NEWARRIVAL', 'fixed', 300, 1500, true)
ON CONFLICT (code) DO NOTHING;
