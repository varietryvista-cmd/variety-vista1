import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://bwyssnnpymyvfdpcyujx.supabase.co';
const serviceRoleKey = fs.readFileSync('.env.local', 'utf8').match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1];

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedData() {
  console.log('Seeding data via REST API...');
  
  // 1. Site Settings
  console.log('\n1. Seeding site_settings...');
  const { error: siteError } = await supabase
    .from('site_settings')
    .upsert({
      id: 1,
      site_name: 'Variety Vista',
      tagline: 'Premium Indian Denim',
      logo_url: '/brand/logo.jpg',
      logo_inverted_url: '/brand/logo.jpg',
      favicon_url: '/brand/logo.jpg',
      contact_email: 'varietryvista@gmail.com',
      contact_phone: '+91 99202 55905',
      business_address: '123 Denim Street, Mumbai, Maharashtra 400001',
      currency_code: 'INR',
      currency_symbol: '₹',
      tax_rate: 18,
      tax_inclusive: true,
      announcement_messages: [
        { text: 'Free shipping on orders over ₹999 across India!', link: null },
        { text: 'New Summer Denim Collection is live', link: '/collections/new-arrivals' }
      ],
      cod_enabled: true,
      free_shipping_threshold: 999,
      flat_shipping_rate: 79,
      social_instagram: 'https://instagram.com/varietyvista'
    }, { onConflict: 'id' });
  
  if (siteError) console.error('site_settings error:', siteError.message);
  else console.log('site_settings OK');
  
  // 2. SEO Settings
  console.log('2. Seeding seo_settings...');
  const { error: seoError } = await supabase
    .from('seo_settings')
    .upsert({
      id: 1,
      meta_title_template: '%s | Variety Vista',
      default_meta_description: 'Shop premium denim jeans at Variety Vista. Discover bootcut, baggy, straight, and skinny fits for men and women.',
      og_default_image_url: '/brand/logo.jpg'
    }, { onConflict: 'id' });
  
  if (seoError) console.error('seo_settings error:', seoError.message);
  else console.log('seo_settings OK');
  
  // 3. Categories
  console.log('3. Seeding categories...');
  const categories = [
    { id: 'c1000000-0000-0000-0000-000000000001', name: 'Men', slug: 'men', type: 'gender', description: "Shop men's premium denim jeans" },
    { id: 'c2000000-0000-0000-0000-000000000002', name: 'Women', slug: 'women', type: 'gender', description: "Shop women's premium denim jeans" },
    { id: 'c3000000-0000-0000-0000-000000000003', name: 'Bootcut', slug: 'bootcut', type: 'fit', description: 'Classic bootcut jeans' },
    { id: 'c4000000-0000-0000-0000-000000000004', name: 'Baggy', slug: 'baggy', type: 'fit', description: 'Relaxed and baggy fit jeans' },
    { id: 'c5000000-0000-0000-0000-000000000005', name: 'Straight', slug: 'straight', type: 'fit', description: 'Timeless straight fit denim' },
    { id: 'c6000000-0000-0000-0000-000000000006', name: 'Skinny', slug: 'skinny', type: 'fit', description: 'Form-fitting skinny jeans' },
    { id: 'c7000000-0000-0000-0000-000000000007', name: 'Wide Leg', slug: 'wide-leg', type: 'fit', description: 'Trendy wide leg jeans' },
    { id: 'c8000000-0000-0000-0000-000000000008', name: 'Mom', slug: 'mom', type: 'fit', description: 'Vintage inspired mom jeans' },
    { id: 'c9000000-0000-0000-0000-000000000009', name: 'Flare', slug: 'flare', type: 'fit', description: 'Retro flare jeans' }
  ];
  
  const { error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' });
  
  if (catError) console.error('categories error:', catError.message);
  else console.log('categories OK');
  
  // 4. Products (without id - let database generate)
  console.log('4. Seeding products...');
  const products = [
    { title: 'Dark Indigo Bootcut Jeans', slug: 'dark-indigo-bootcut-jeans', description: 'Classic dark indigo bootcut jeans perfect for everyday wear.', gender: 'men', fit_type: 'bootcut', wash: 'Dark Wash', rise: 'mid', stretch_type: 'rigid', fabric_composition: '100% Cotton', price: 2499, sale_price: null, status: 'active' },
    { title: 'Washed Black Skinny Fit', slug: 'washed-black-skinny-fit', description: 'Edgy washed black skinny jeans with a bit of stretch.', gender: 'women', fit_type: 'skinny', wash: 'Washed Black', rise: 'high', stretch_type: 'super_stretch', fabric_composition: '98% Cotton, 2% Elastane', price: 1999, sale_price: 1799, status: 'active' },
    { title: 'Vintage Light Wash Baggy Jeans', slug: 'vintage-light-wash-baggy-jeans', description: 'Relaxed baggy jeans with a vintage light wash feel.', gender: 'unisex', fit_type: 'baggy', wash: 'Light Wash', rise: 'mid', stretch_type: 'rigid', fabric_composition: '100% Cotton', price: 2799, sale_price: null, status: 'active' },
    { title: 'Classic Blue Straight Jeans', slug: 'classic-blue-straight-jeans', description: 'Your essential classic blue straight jeans.', gender: 'men', fit_type: 'straight', wash: 'Medium Blue', rise: 'mid', stretch_type: 'stretch', fabric_composition: '99% Cotton, 1% Spandex', price: 2199, sale_price: null, status: 'active' },
    { title: 'Heavy Acid Wash Denim', slug: 'heavy-acid-wash-denim', description: 'Bold 80s-inspired heavy acid wash pattern with tactile texture.', gender: 'men', fit_type: 'baggy', wash: 'Acid Wash', rise: 'high', stretch_type: 'rigid', fabric_composition: '100% Cotton', price: 2899, sale_price: 2199, status: 'active' },
    { title: 'Faded Stonewash Straight Jeans', slug: 'faded-stonewash-straight-jeans', description: 'Sun-kissed authentic stonewash finish with handcrafted fading.', gender: 'men', fit_type: 'straight', wash: 'Light Blue', rise: 'mid', stretch_type: 'stretch', fabric_composition: '98% Cotton, 2% Spandex', price: 2399, sale_price: null, status: 'active' },
    { title: 'Vintage Washed Indigo Jeans', slug: 'vintage-washed-indigo-jeans', description: 'Rich vintage wash with natural whisker details across thighs.', gender: 'men', fit_type: 'bootcut', wash: 'Mid Blue', rise: 'mid', stretch_type: 'stretch', fabric_composition: '99% Cotton, 1% Spandex', price: 2599, sale_price: null, status: 'active' },
    { title: 'Vintage Light Wash Straight', slug: 'vintage-light-wash-straight', description: 'Signature light blue denim in a tailored straight leg.', gender: 'men', fit_type: 'straight', wash: 'Light Blue', rise: 'mid', stretch_type: 'rigid', fabric_composition: '100% Cotton', price: 2199, sale_price: null, status: 'active' }
  ];
  
  const { data: insertedProducts, error: prodError } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'slug' })
    .select('id, slug');
  
  if (prodError) {
    console.error('products error:', prodError.message);
    return;
  } else {
    console.log('products OK, inserted:', insertedProducts?.length);
  }
  
  // Map slugs to product IDs
  const productMap = {};
  insertedProducts?.forEach(p => productMap[p.slug] = p.id);
  
  // 5. Product Images
  console.log('5. Seeding product_images...');
  const imageData = [
    { product_slug: 'dark-indigo-bootcut-jeans', image_url: '/assets/PHOTO-2026-08-02-12-56-13.jpg', image_type: 'on_model', sort_order: 1 },
    { product_slug: 'dark-indigo-bootcut-jeans', image_url: '/assets/PHOTO-2026-08-02-12-56-14.jpg', image_type: 'on_model', sort_order: 2 },
    { product_slug: 'washed-black-skinny-fit', image_url: '/assets/PHOTO-2026-08-02-12-56-20.jpg', image_type: 'on_model', sort_order: 1 },
    { product_slug: 'vintage-light-wash-baggy-jeans', image_url: '/assets/PHOTO-2026-08-02-12-56-16.jpg', image_type: 'on_model', sort_order: 1 },
    { product_slug: 'classic-blue-straight-jeans', image_url: '/assets/PHOTO-2026-08-02-12-56-05.jpg', image_type: 'on_model', sort_order: 1 },
    { product_slug: 'heavy-acid-wash-denim', image_url: '/assets/PHOTO-2026-08-02-12-56-34.jpg', image_type: 'on_model', sort_order: 1 },
    { product_slug: 'faded-stonewash-straight-jeans', image_url: '/assets/PHOTO-2026-08-02-12-56-23.jpg', image_type: 'on_model', sort_order: 1 },
    { product_slug: 'vintage-washed-indigo-jeans', image_url: '/assets/PHOTO-2026-08-02-12-56-08.jpg', image_type: 'on_model', sort_order: 1 },
    { product_slug: 'vintage-light-wash-straight', image_url: '/assets/PHOTO-2026-08-02-12-56-01.jpg', image_type: 'on_model', sort_order: 1 }
  ];
  
  const images = imageData.map(i => ({
    product_id: productMap[i.product_slug],
    image_url: i.image_url,
    image_type: i.image_type,
    sort_order: i.sort_order
  }));
  
  const { error: imgError } = await supabase
    .from('product_images')
    .upsert(images, { onConflict: 'product_id,sort_order' });
  
  if (imgError) console.error('product_images error:', imgError.message);
  else console.log('product_images OK');
  
  // 6. Product Variants
  console.log('6. Seeding product_variants...');
  const variantData = [
    { product_slug: 'dark-indigo-bootcut-jeans', sku: 'M-BOOT-DK-30', waist_size: 30, inseam_length: 32, stock_quantity: 10 },
    { product_slug: 'dark-indigo-bootcut-jeans', sku: 'M-BOOT-DK-32', waist_size: 32, inseam_length: 32, stock_quantity: 15 },
    { product_slug: 'dark-indigo-bootcut-jeans', sku: 'M-BOOT-DK-34', waist_size: 34, inseam_length: 32, stock_quantity: 8 },
    { product_slug: 'washed-black-skinny-fit', sku: 'W-SKIN-BLK-26', waist_size: 26, inseam_length: 30, stock_quantity: 20 },
    { product_slug: 'washed-black-skinny-fit', sku: 'W-SKIN-BLK-28', waist_size: 28, inseam_length: 30, stock_quantity: 25 },
    { product_slug: 'vintage-light-wash-baggy-jeans', sku: 'U-BAG-LT-32', waist_size: 32, inseam_length: 30, stock_quantity: 5 },
    { product_slug: 'classic-blue-straight-jeans', sku: 'M-STR-BLU-34', waist_size: 34, inseam_length: 32, stock_quantity: 12 },
    { product_slug: 'heavy-acid-wash-denim', sku: 'M-ACD-BG-30', waist_size: 30, inseam_length: 32, stock_quantity: 18 },
    { product_slug: 'faded-stonewash-straight-jeans', sku: 'M-STN-30', waist_size: 30, inseam_length: 30, stock_quantity: 7 },
    { product_slug: 'vintage-washed-indigo-jeans', sku: 'M-VNT-32', waist_size: 32, inseam_length: 32, stock_quantity: 10 },
    { product_slug: 'vintage-light-wash-straight', sku: 'M-LT-STR-32', waist_size: 32, inseam_length: 32, stock_quantity: 14 }
  ];
  
  const variants = variantData.map(v => ({
    product_id: productMap[v.product_slug],
    sku: v.sku,
    waist_size: v.waist_size,
    inseam_length: v.inseam_length,
    stock_quantity: v.stock_quantity
  }));
  
  const { error: varError } = await supabase
    .from('product_variants')
    .upsert(variants, { onConflict: 'sku' });
  
  if (varError) console.error('product_variants error:', varError.message);
  else console.log('product_variants OK');
  
  // 7. Size Guide
  console.log('7. Seeding size_guide...');
  const sizeGuide = [
    { gender: 'men', waist_size: 30, hip_range: '36-38', inseam_options: [30, 32, 34] },
    { gender: 'men', waist_size: 32, hip_range: '38-40', inseam_options: [30, 32, 34] },
    { gender: 'women', waist_size: 26, hip_range: '34-36', inseam_options: [28, 30] },
    { gender: 'women', waist_size: 28, hip_range: '36-38', inseam_options: [28, 30, 32] }
  ];
  
  const { error: sgError } = await supabase
    .from('size_guide')
    .upsert(sizeGuide);
  
  if (sgError) console.error('size_guide error:', sgError.message);
  else console.log('size_guide OK');
  
  // 8. Hero Slides
  console.log('8. Seeding hero_slides...');
  const heroSlides = [
    { image_url: '/assets/PHOTO-2026-08-02-12-56-01.jpg', heading: 'Fits That Move With You', subheading: 'Discover our latest collection of premium Indian denim.', cta_text: 'Shop New Arrivals', cta_link: '/collections/new-arrivals', sort_order: 1, is_active: true },
    { image_url: '/assets/PHOTO-2026-08-02-12-56-34.jpg', heading: 'Acid Wash. Raw Energy.', subheading: 'Vintage textures, authentic wash, all-day confidence.', cta_text: 'Shop Heavy Acid Wash', cta_link: '/products/heavy-acid-wash-denim', sort_order: 2, is_active: true },
    { image_url: '/assets/PHOTO-2026-08-02-12-56-17.jpg', heading: 'Flat ₹500 Off', subheading: 'Use code DENIM500 at checkout. Free shipping across India.', cta_text: 'Explore All Fits', cta_link: '/collections/all', sort_order: 3, is_active: true }
  ];
  
  const { error: hsError } = await supabase
    .from('hero_slides')
    .upsert(heroSlides);
  
  if (hsError) console.error('hero_slides error:', hsError.message);
  else console.log('hero_slides OK');
  
  // 9. Coupons
  console.log('9. Seeding coupons...');
  const coupons = [
    { code: 'DENIM500', type: 'fixed', value: 500, min_order_amount: 1999, is_active: true },
    { code: 'DENIM10', type: 'percentage', value: 10, min_order_amount: 1500, is_active: true }
  ];
  
  const { error: coupError } = await supabase
    .from('coupons')
    .upsert(coupons, { onConflict: 'code' });
  
  if (coupError) console.error('coupons error:', coupError.message);
  else console.log('coupons OK');
  
  console.log('\n✅ All seed data applied successfully!');
}

seedData().catch(console.error);