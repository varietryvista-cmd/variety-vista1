# Master Prompt — "Variety Vista" Jeans E-Commerce Website
> Copy and paste this entire prompt into your AI IDE (Claude Code, Cursor, etc). It is structured
in sections so the AI treats each area with equal priority.

---
## BRAND CONTEXT
- **Brand name**: Variety Vista
- **Category**: Denim-only D2C store — men's and women's jeans (bootcut, baggy, straight,
  skinny, wide-leg, mom, flare, etc.)
- **Market**: India (INR pricing, Indian address formats, Indian payment/shipping rails)
- **Design inspiration**: [freakins.com](https://freakins.com) — a denim-first Shopify store.
  Study its pattern and replicate the *feel*, not the code: minimal top nav (just
  WOMEN / MEN / SUPPORT), big edge-to-edge product photography, two-image hover swap
  on product cards (front shot → styled/lifestyle shot), a slim rotating announcement bar
  above the header ("New Fits Launched. Fits That Move With You!"), dense but clean
  product grids, denim-toned neutral palette, and a checkout that feels fast and trustworthy
  rather than "premium boutique." Variety Vista should feel energetic and product-forward,
  not overly minimal-luxury.

---
## THE PROMPT
```
You are building a production-grade, fully functional e-commerce platform for a denim
brand called "Variety Vista". The tech stack is strictly: Next.js 14 (App Router), TypeScript,
Tailwind CSS, Framer Motion, Supabase (Auth + Database + Storage), Razorpay for payments,
and Shiprocket for shipping/logistics. The project must be deployable to Vercel with zero
configuration issues.

This is NOT a template or mockup. Every feature must be wired to Supabase, Razorpay, and
Shiprocket, and fully functional.
```

---
## SECTION 1 — UI DESIGN SYSTEM (HIGHEST PRIORITY, FREAKINS-INSPIRED)

### Typography
- Use **Inter** or **Neue Montreal**-style grotesk for everything — body, nav, and headings.
  Freakins-style denim brands lean bold-sans, not editorial serif. Use a single tight, punchy
  sans-serif family throughout; reserve any secondary font for numerals/pricing only if desired.
- Font sizes: Hero headline 48–64px (bold, tight tracking), Section headings 28–36px,
  Product titles 15–17px (uppercase, letter-spacing 0.02em), Price 15–16px semibold,
  Body text 14–15px, Captions/labels 11–12px uppercase tracked-out (letter-spacing: 0.08em).
- Line height: 1.15 for headings, 1.5 for body text.

### Color Palette (denim-forward, not boutique-neutral)
- Primary background: #FFFFFF. Secondary/section background: #F4F3F0 (warm light grey).
- Primary text: #111111. Secondary text: #6B6B6B.
- Denim accent (brand color): #2B3A55 (deep indigo) — used for primary CTAs, active nav
  states, badges.
- Secondary accent: #1A1A1A (near-black) for "Add to Cart" buttons, matching Freakins'
  high-contrast black CTAs.
- Sale/discount tag: #D62828 (red). Success: #1E8E3E. Stock-low warning: #E08A00.
- Cards: background #FFFFFF, no heavy borders/shadows — Freakins uses flat imagery with
  minimal chrome. Use a 1px hairline `rgba(0,0,0,0.08)` only where needed for separation
  (e.g., filter sidebar, tables), not around every product card.

### Spacing & Layout
- 8px grid system throughout.
- Max content width: 1400px, centered. Horizontal page padding: 48px desktop, 16px mobile.
- Section vertical padding: 56–96px.
- Product grid: **4 columns desktop, 2 columns mobile**, gap 12–16px (tighter than
  boutique sites — Freakins runs a denser grid than Aesop-style stores).

### Micro-Interactions & Animations (Framer Motion)
1. **Announcement bar**: Thin bar above header, auto-rotating text/promo messages every
   4s (slide up/down transition), dismissible on mobile.
2. **Page transitions**: AnimatePresence wrapper, fade + slight upward slide (y: 16→0),
   0.35s, ease [0.25, 0.1, 0.25, 1].
3. **Product card — dual image hover (Freakins signature interaction)**: Each product has a
   primary flat/front shot and a secondary lifestyle/on-model shot. On hover (desktop) or
   on-scroll-into-view autoplay-once (mobile), crossfade from primary → secondary image
   over 0.4s. Below the image, an "Add" quick-add button and a "Choose size" variant picker
   appear inline (not a separate slide-up panel) — matching Freakins' "Add / Choose" pattern
   directly on the card grid, not just on hover.
4. **Add-to-cart effect**: Ghost image flies from the product card/PDP image to the cart icon
   in the header along a bezier arc, scaling 1→0.2 and fading out. Cart icon does a spring
   bounce (scale 1→1.3→1). Cart item count badge pops with a scale animation.
5. **Button interactions**: All buttons scale to 0.96 on `whileTap`. Primary CTAs are solid
   black/indigo with no gradient shimmer (keep it flat and fast — denim-brand energy, not
   luxury-boutique shimmer).
6. **Scroll-triggered reveals**: Sections and grid items fade up (opacity 0→1, y: 24→0),
   `staggerChildren: 0.06`, over 0.5s.
7. **Cart drawer**: Slides from the right (x: 100%→0) with backdrop blur. Items stagger in
   (`staggerChildren: 0.04`). Removed items animate out (opacity→0, height→0) before
   removal.
8. **Size/fit selector on PDP**: Pill buttons for waist size and separate pills for inseam/length
   (see Section 2). Selected pill gets a filled background + checkmark animation.
   Out-of-stock combinations are shown crossed-out and disabled, matching real jeans
   commerce UX.
9. **Skeleton loading states**: Shimmer-gradient placeholders for grids, PDP images, and
   order tables — never blank space or layout shift.
10. **Toast notifications**: Slide in from top-right, auto-dismiss after 3s with a shrinking
    progress bar.
11. **Sticky header**: Shrinks in height (72px→56px) on scroll with backdrop-blur and a
    hairline bottom border. Mobile menu is a full-screen overlay with staggered nav links,
    mirroring Freakins' simple WOMEN / MEN / SUPPORT structure plus Account, Search, Cart.
12. **Pincode/serviceability check widget**: On PDP, an inline pincode input with "Check
    delivery" button that calls the Shiprocket serviceability API and animates in the result
    (estimated delivery date, COD availability) below the input.

### Component Quality Rules
- All images via `next/image`, correct aspect ratios (jeans product shots are typically
  2:3 portrait), priority loading above-fold, blur placeholders.
- Inputs use floating labels that animate up on focus.
- Every clickable element has `cursor-pointer` and visible hover/active/focus-visible states.
- Mobile-first: test at 375px, 768px, 1440px.
- Empty states (empty cart, empty wishlist, no search results) have a simple illustration +
  CTA back to `/collections/all`.
- Use `<motion.div>` for all animated UI; CSS transitions only for color/background changes.

---
## SECTION 2 — STOREFRONT PAGES & FEATURES (JEANS-SPECIFIC)

### Homepage
- **Announcement bar**: rotating promo text (from Supabase `site_settings`).
- **Hero**: Full-bleed lifestyle image/video with overlay headline + CTA. Auto-rotating
  carousel of 3–4 slides (from `hero_slides` table), progress indicators.
- **Shop by Category**: two large tappable banners — "WOMEN" and "MEN" — plus a
  horizontal scroll row of fit-type categories (Bootcut, Baggy, Straight, Skinny, Wide-Leg,
  Mom Fit, Flare), each linking to a pre-filtered PLP.
- **New Arrivals**: 4-col grid pulled from Supabase, `created_at desc`, "NEW" pulse badge.
- **Best Sellers**: grid sorted by total units sold (aggregated from `order_items`).
- **Sale / Promotional Banner**: full-width banner with countdown timer if a sale is active
  (from admin settings).
- **"As seen on" / marketplace strip**: small strip linking out to marketplace listings
  (e.g., Flipkart/Amazon), matching Freakins' cross-channel banner — optional, admin-toggleable.
- **Newsletter Signup** → `subscribers` table.
- **Trust strip**: free shipping / easy 7-day returns / COD available / secure payments —
  simple icon row, no need for heavy animation.
- **Footer**: dynamic logo, nav columns, social icons, payment method icons (incl. Razorpay
  badges), Shiprocket "Track your order" link, copyright.

### Product Listing Page (PLP) — `/collections/[category]`
- **Filters**: Gender (Men/Women), Fit (Bootcut/Baggy/Straight/Skinny/Wide-Leg/Mom/Flare),
  Wash (Light/Medium/Dark/Black/Indigo/Washed/Raw), Waist size, Rise (Low/Mid/High),
  Price range slider, Stretch (Rigid/Stretch/Super-Stretch), Availability. All filters sync to
  URL search params (shareable/filterable links) and query Supabase in real time.
- **Sort**: Price low-high/high-low, Newest, Best-selling, Rating.
- Active filter chips with animated remove (×). Product count.
- Infinite scroll or "Load More".
- **Quick view modal**: centered modal (scale 0.95→1 + fade) with image, price, waist/length
  selector, add-to-cart — no page navigation.

### Product Detail Page (PDP) — `/products/[slug]`
- Breadcrumb: Home / Men or Women / Fit type / Product name.
- **Image gallery**: primary flat-lay + on-model shots, 5+ images, crossfade on thumbnail
  click, zoom on hover (desktop), pinch-zoom on mobile.
- **Product info**: title, price (strikethrough sale price if applicable), star rating, fabric
  composition (e.g., "98% Cotton, 2% Elastane"), wash name, fit description.
- **Variant selectors — jeans-specific**:
  - **Waist size** pills (28, 30, 32, 34, 36, 38…)
  - **Length/Inseam** pills (30", 32", 34…) — only shown if the product has multiple inseam
    options.
  - **Fit** shown as read-only badge (Bootcut/Baggy/etc.) since fit is usually a separate
    product, not a variant.
  - Out-of-stock waist/length combos shown crossed-out and disabled.
  - **Size guide** link opens a modal with a waist/hip/inseam measurement chart
    (admin-editable) and a "how to measure" diagram.
- **Quantity selector**, max = stock for the selected variant.
- **Add to Cart**: full-width, flying-image animation, disabled + "Out of Stock" state.
- **Delivery & serviceability widget**: pincode input → Shiprocket serviceability check →
  shows estimated delivery date and COD availability inline.
- **Accordion sections**: Description, Fabric & Care, Size & Fit, Shipping & Returns, Reviews.
- **Reviews**: star breakdown chart, review cards with verified-purchase badge, pagination,
  submit-review form → `reviews` table.
- **Related Products**: horizontal scroll, same fit-type or same wash.

### Cart Page / Cart Drawer
- Line items: image, title, wash, waist/length, unit price, qty stepper, line total, remove.
- **Coupon code** input validated against `coupons` table.
- **Shipping estimate**: pulls live rate from Shiprocket rate-check API based on pincode
  (falls back to default flat/free-shipping-threshold rule from `site_settings` if pincode not
  yet entered).
- Order summary: subtotal, discount, shipping, tax, total.
- "Proceed to Checkout" CTA.
- Empty cart illustration + "Continue Shopping".

### Checkout Page
- **Multi-step**: Shipping → Payment → Review, animated step indicator.
- **Shipping form**: name, email, phone, address line 1/2, city, state, pincode, country
  (default India). Pincode field triggers a **Shiprocket serviceability check** live —
  blocks checkout with a clear message if the pincode is genuinely unserviceable, and shows
  available shipping methods + ETAs returned by Shiprocket for that pincode.
- **Payment**: Razorpay Checkout (order creation on the server via `/api/razorpay/create-order`,
  Razorpay Checkout.js on the client), plus **Cash on Delivery (COD)** as a selectable payment
  method where Shiprocket reports COD as available for the pincode.
- **Order review step**: full summary — items, address, shipping method + ETA, payment
  method, totals.
- **Place Order**:
  1. Create `orders` row in Supabase with status `pending`.
  2. If online payment: create Razorpay order → verify payment signature on webhook →
     update `payment_status` to `paid`.
  3. If COD: mark `payment_status` as `cod_pending`.
  4. On confirmed order (paid or COD accepted), create a Shiprocket order via
     `/api/shiprocket/create-order`, store the returned `shiprocket_order_id`,
     `shiprocket_shipment_id`, and generate an AWB; store `awb_code` and `courier_name`
     on the order.
  5. Redirect to the confirmation page.

### Order Confirmation Page
- Animated checkmark (SVG path draw).
- Order number, items summary, estimated delivery (from Shiprocket).
- "Continue Shopping" and "Track Order" CTAs (track order deep-links into the account order
  detail page, which polls Shiprocket tracking).

### User Account Pages (Supabase Auth)
- Sign Up / Sign In (email+password + Google OAuth), smooth tab transition.
- **My Account Dashboard**: welcome message, recent orders, saved addresses.
- **Order History**: status badges (pending=yellow, processing=blue, shipped=indigo,
  delivered=green, cancelled/refunded=red).
- **Order Detail**: items, address, **live Shiprocket tracking timeline** (fetches tracking
  events via `/api/shiprocket/track/[awb]` and renders a vertical status timeline with
  courier name, current status, and expected delivery date).
- **Address Book**: CRUD, default address selector, pincode validated against Shiprocket
  serviceability on save.
- **Profile Settings**: name, email, password, avatar upload to Supabase Storage.
- **Wishlist**: heart-toggle animation, grid of wishlisted items.

### Search
- Search modal/overlay, debounced query against `products` (title, description, tags, wash,
  fit), instant results with thumbnail + price, keyboard navigation, recent searches in
  localStorage.

### Additional Pages
- About Us, Contact (→ Supabase `contact_messages`), FAQ (accordion), Shipping Policy
  (mentions Shiprocket-powered delivery timelines), Returns/Exchange Policy, Privacy Policy,
  Terms of Service, Size Guide (standalone page in addition to the PDP modal).

---
## SECTION 3 — ADMIN PANEL (`/admin`)

Separate layout, no storefront header/footer. Protected by Supabase Auth + `role = 'admin'`
check in `profiles`. Non-admins redirected to storefront.

### Admin UI
- Collapsible sidebar (Lucide icons), white sidebar (#FFFFFF), light-grey content area
  (#F8F9FA).
- Tables: sortable, searchable, paginated (20/page).
- Forms: inline validation errors. Destructive actions require confirmation modal.
- Dashboard charts: Recharts, using the brand's indigo/black palette.
- Toasts for all CRUD operations.

### Admin Dashboard (Home)
- KPI cards (animated count-up): Revenue, Orders, Customers, AOV, with % change vs
  last period.
- Revenue chart (7d/30d/90d/1y toggle).
- Recent Orders table (last 10).
- Top Selling Products (by fit type and by SKU).
- Low Stock Alerts (stock < 10 per waist/length variant).
- **Shipment status widget**: counts of orders currently In Transit / Out for Delivery /
  Delivered / RTO (return-to-origin), pulled from Shiprocket order statuses cached in
  Supabase.

### Product Management (`/admin/products`)
- List: thumbnail, Name, SKU, Fit, Wash, Price, Total stock across variants, Status
  (Active/Draft), Actions.
- **Add/Edit Product Form**:
  - Title, slug (auto-generated, editable), description (TipTap rich text).
  - **Fit type** selector (Bootcut, Baggy, Straight, Skinny, Wide-Leg, Mom, Flare — extendable
    list, stored as a taxonomy, not free text).
  - **Gender** (Men/Women/Unisex).
  - **Wash** (Light Indigo, Dark Indigo, Black, Washed, Raw, Tinted…), **Rise**
    (Low/Mid/High), **Stretch type** (Rigid/Stretch/Super-Stretch), fabric composition text.
  - Pricing: regular price, sale price, sale start/end.
  - Inventory: SKU prefix, "Track inventory" toggle, "Allow backorders" toggle.
  - Media: drag-and-drop upload to `product-images` bucket, reorder, first = featured, up to
    10 images per product — encourage uploading both a flat/front shot and an on-model
    shot per color so the storefront dual-image hover works.
  - **Variants**: option groups are **Waist size** and **Inseam/Length** (auto-generate the
    grid of combinations). Each variant gets its own stock quantity and optional price
    override and SKU.
  - SEO: meta title/description, OG image.
  - Status: Draft/Active. Save as Draft / Publish.

### Category Management (`/admin/categories`)
- CRUD for Gender categories (Men/Women) and Fit-type categories, each with name, slug,
  description, image, sort order. Simple two-level structure (Gender → Fit type) — no need
  for deep nesting since the catalog is jeans-only.

### Order Management (`/admin/orders`)
- List: Order #, Date, Customer, Items, Total, Payment status, Fulfillment status,
  **Shiprocket status** (Awaiting Pickup / Picked Up / In Transit / Out for Delivery /
  Delivered / RTO / Cancelled). Filterable by date range, status, payment status,
  fulfillment status, shipment status, min/max total. Searchable by order #, name, email,
  AWB number.
- **Order Detail**:
  - Customer info + link to profile.
  - Shipping/billing address side by side.
  - Items table with waist/length variant shown per line.
  - Order summary: subtotal, discount, shipping, tax, total.
  - Payment info: method, Razorpay payment ID, status.
  - **Shiprocket panel**: shipment ID, AWB code, courier name, current status, "Generate
    AWB" / "Schedule Pickup" / "Cancel Shipment" action buttons that call the corresponding
    Shiprocket API endpoints, plus a manual tracking-number override field for edge cases.
  - Order timeline: every status change with timestamp; admin can add internal notes.
  - Fulfillment status dropdown (Pending → Processing → Shipped → Delivered →
    Cancelled/Refunded/RTO), each change logged to the timeline.
  - Print packing slip / invoice.
- **Export**: CSV/Excel of filtered orders.

### Customer Management (`/admin/customers`)
- List: Name, Email, Total Orders, Total Spent, Join Date, Status.
- Detail: profile, order history, addresses, lifetime value, internal notes.

### Coupon / Discount Management (`/admin/coupons`)
- CRUD: code, type (percentage/fixed), value, min order amount, usage limit, per-customer
  limit, valid dates, applicable fit-types/products, active toggle, usage tracking.

### Brand & Site Settings (`/admin/settings`)
- **Brand logo**: primary (light bg) + inverted (dark bg) upload slots → Supabase Storage
  `brand-assets`; used across header, footer, invoices, favicon.
- Site name ("Variety Vista"), tagline.
- Contact info: business email, phone, address.
- Social links: Instagram, Facebook, X, TikTok, YouTube.
- **Announcement bar**: toggle, rotating messages (list, not single string), link URL,
  background color — matching Freakins' rotating top bar.
- Currency: INR by default, symbol ₹.
- **Shipping settings**:
  - Shiprocket API credentials (email/password or token, stored securely — never exposed
    client-side).
  - Default pickup location (must match a Shiprocket-registered pickup address).
  - Free-shipping threshold and flat-rate fallback (used only if Shiprocket rate check fails).
  - COD enable/disable toggle at store level (in addition to per-pincode COD availability
    from Shiprocket).
- Tax settings: GST rate, tax-inclusive/exclusive pricing toggle.
- Homepage hero slides CRUD (drag reorder).
- Banner promotions CRUD.

### SEO Management (`/admin/seo`)
- Global: meta title template, default meta description, GA4 ID, Search Console verification,
  Facebook Pixel ID, default OG image.
- Per-page SEO for Homepage, About, Contact, policy pages.
- Auto-generated `/sitemap.xml` (products, categories, pages).
- Editable `robots.txt`.
- JSON-LD Product schema on PDPs, Organization schema on homepage.

### Media Library (`/admin/media`)
- Grid of uploaded images, drag-drop upload, delete with in-use warning, copy public URL.

### Analytics (`/admin/analytics`)
- Revenue and orders over time.
- Top products by revenue/units, broken down by **fit type** and **wash**.
- Top categories.
- Customer acquisition over time.
- **Shipment performance**: average delivery time, RTO rate — sourced from Shiprocket
  data cached in Supabase.

---
## SECTION 4 — SUPABASE DATABASE SCHEMA

Create the following tables with relationships, RLS policies, and indexes. This mirrors the
generic e-commerce schema but adapts `products`/`product_options` to jeans attributes and
adds Shiprocket fields to `orders`.

### Tables
1. **profiles** — id (uuid, FK auth.users), email, full_name, phone, avatar_url,
   role (enum: customer, admin), created_at, updated_at.
2. **site_settings** — id, site_name, tagline, logo_url, logo_inverted_url, favicon_url,
   contact_email, contact_phone, business_address, currency_code, currency_symbol,
   tax_rate, tax_inclusive (bool), announcement_messages (jsonb array), cod_enabled (bool),
   free_shipping_threshold, flat_shipping_rate, shiprocket_pickup_location,
   social_instagram, social_facebook, social_twitter, social_tiktok, social_youtube,
   updated_at.
3. **seo_settings** — id, meta_title_template, default_meta_description,
   og_default_image_url, ga_tracking_id, fb_pixel_id, search_console_meta, robots_txt,
   updated_at.
4. **page_seo** — id, page_slug (unique), meta_title, meta_description, og_image_url.
5. **categories** — id, name, slug (unique), type (enum: gender, fit), description,
   image_url, sort_order, created_at.
6. **products** — id, title, slug (unique), description, gender (enum: men, women, unisex),
   fit_type (enum: bootcut, baggy, straight, skinny, wide_leg, mom, flare), wash, rise
   (enum: low, mid, high), stretch_type (enum: rigid, stretch, super_stretch),
   fabric_composition, price (numeric), sale_price (numeric, nullable), sale_start, sale_end,
   sku_prefix, status (enum: draft, active), meta_title, meta_description, og_image_url,
   tags (text[]), created_at, updated_at.
7. **product_images** — id, product_id (FK), image_url, image_type (enum: flat, on_model),
   sort_order, alt_text.
8. **product_variants** — id, product_id (FK), sku (unique), waist_size (int),
   inseam_length (int, nullable), price (override, nullable), stock_quantity (int),
   created_at.
9. **size_guide** — id, gender (enum), waist_size, hip_range, inseam_options (jsonb).
10. **addresses** — id, user_id (FK), full_name, phone, address_line1, address_line2,
    city, state, pincode, country default 'India', is_default (bool), created_at.
11. **orders** — id, order_number (unique, e.g. "VV-10001"), user_id (FK), email,
    shipping_address (jsonb), billing_address (jsonb), shipping_method, shipping_cost,
    subtotal, discount_amount, tax_amount, total, coupon_code,
    payment_method (enum: razorpay, cod),
    payment_status (enum: pending, paid, failed, refunded, cod_pending),
    fulfillment_status (enum: pending, processing, shipped, delivered, cancelled, rto),
    razorpay_order_id, razorpay_payment_id,
    shiprocket_order_id, shiprocket_shipment_id, awb_code, courier_name,
    tracking_status, estimated_delivery_date, notes, created_at, updated_at.
12. **order_items** — id, order_id (FK), product_id (FK), variant_id (FK), title,
    waist_size, inseam_length, wash, quantity, unit_price, line_total.
13. **order_timeline** — id, order_id (FK), status, note, created_by (FK profiles),
    created_at.
14. **reviews** — id, product_id (FK), user_id (FK), rating (1–5), title, body,
    is_verified (bool), created_at.
15. **coupons** — id, code (unique), type (enum: percentage, fixed), value,
    min_order_amount, usage_limit, per_customer_limit, times_used, valid_from, valid_to,
    applicable_products (uuid[]), applicable_fit_types (text[]), is_active (bool),
    created_at.
16. **subscribers** — id, email (unique), created_at.
17. **hero_slides** — id, image_url, heading, subheading, cta_text, cta_link, sort_order,
    is_active (bool).
18. **wishlist** — id, user_id (FK), product_id (FK), created_at, unique (user_id, product_id).
19. **media** — id, url, filename, size, mime_type, uploaded_by (FK), created_at.
20. **contact_messages** — id, name, email, message, created_at, is_read (bool).

### RLS Policies
- Customers: read/update own profile, addresses, orders, reviews, wishlist only.
- Products, categories, size_guide, site_settings, hero_slides publicly readable.
- Only admins can insert/update/delete products, categories, orders, coupons, settings,
  hero_slides, media.
- Orders: customers read own; admins read all.
- Reviews: publicly readable; customers can create for products they've ordered; admins
  can delete.

### Storage Buckets
- `product-images` — public read, admin write.
- `brand-assets` — public read, admin write.
- `media-library` — public read, admin write.
- `avatars` — authenticated read/write own folder.

### Database Functions / Triggers
- Auto-generate `order_number` on insert (e.g. `'VV-' || (10000 + id)`).
- Auto-update `updated_at` on row changes.
- Decrement `product_variants.stock_quantity` on order creation.
- Recalculate `coupons.times_used` on order creation with a coupon.
- On `orders.tracking_status` update (via Shiprocket webhook handler), append a row to
  `order_timeline` automatically.

---
## SECTION 5 — SHIPROCKET INTEGRATION (DEDICATED)

Shiprocket has no official JS SDK — integrate via their REST API from Next.js API routes only
(never call Shiprocket directly from the client; credentials must stay server-side).

- **Auth**: `/api/shiprocket/_auth` helper — POST to Shiprocket's auth/login endpoint with
  `SHIPROCKET_EMAIL` / `SHIPROCKET_PASSWORD`, cache the returned bearer token
  (tokens are long-lived; refresh on 401) in a server-side in-memory/Supabase cache — never
  expose the token to the client.
- **Serviceability check** — `/api/shiprocket/serviceability?pickup_pincode=&delivery_pincode=&cod=&weight=`
  → used on PDP delivery widget, cart page, and checkout pincode field. Returns available
  courier options, ETA, and COD availability.
- **Create order** — `/api/shiprocket/create-order` → called server-side right after an order
  is confirmed (paid or COD accepted). Sends order items, dimensions/weight, buyer address,
  and pickup location; stores `shiprocket_order_id` / `shiprocket_shipment_id` on the order.
- **Generate AWB** — `/api/shiprocket/generate-awb` → assigns a courier and AWB number;
  store `awb_code` and `courier_name`.
- **Schedule pickup** — `/api/shiprocket/schedule-pickup`.
- **Track shipment** — `/api/shiprocket/track/[awb]` → used by the account order-detail page
  and the admin order-detail Shiprocket panel; polls or is refreshed via webhook.
- **Webhook** — `/api/webhooks/shiprocket` → receives shipment status updates
  (Picked Up, In Transit, Out for Delivery, Delivered, RTO, Cancelled), updates
  `orders.tracking_status` and `orders.fulfillment_status`, and appends to `order_timeline`.
- **Cancel shipment** — `/api/shiprocket/cancel-shipment` for admin-initiated cancellations.

---
## SECTION 6 — TECHNICAL REQUIREMENTS

### Project Structure (Next.js App Router)
```
/app
  /(storefront)
    /layout.tsx
    /page.tsx
    /collections/[category]/page.tsx      ← PLP (gender or fit-type)
    /products/[slug]/page.tsx             ← PDP
    /cart/page.tsx
    /checkout/page.tsx
    /account/...
    /search/page.tsx
    /about, /contact, /faq, /policies, /size-guide ...
  /(admin)
    /admin/layout.tsx
    /admin/page.tsx
    /admin/products/...
    /admin/orders/...
    /admin/customers/...
    /admin/categories/...
    /admin/coupons/...
    /admin/settings/...
    /admin/seo/...
    /admin/media/...
    /admin/analytics/...
  /api
    /razorpay/create-order/route.ts
    /webhooks/razorpay/route.ts
    /shiprocket/_auth.ts
    /shiprocket/serviceability/route.ts
    /shiprocket/create-order/route.ts
    /shiprocket/generate-awb/route.ts
    /shiprocket/schedule-pickup/route.ts
    /shiprocket/track/[awb]/route.ts
    /shiprocket/cancel-shipment/route.ts
    /webhooks/shiprocket/route.ts
/components
  /ui       ← Button, Input, Modal, Toast, Skeleton, SizeGuideModal, etc.
  /storefront ← Header, AnnouncementBar, Footer, ProductCard (dual-image hover),
               CartDrawer, PincodeChecker, VariantSelector, etc.
  /admin    ← AdminSidebar, DataTable, StatCard, ShiprocketPanel, etc.
/lib
  /supabase.ts
  /razorpay.ts
  /shiprocket.ts   ← server-only client wrapper (auth, all Shiprocket calls)
  /utils.ts
/hooks     ← useCart, useWishlist, useDebounce, useServiceability
/types
/public
```

### State Management
- Cart: React Context + localStorage persistence. Provides items, addItem (triggers flying
  animation), removeItem, updateQuantity, clearCart, subtotal, itemCount.
- Auth: Supabase auth listener in a context provider.
- No Redux/Zustand unless necessary.

### Performance
- Dynamic imports for heavy components (rich text editor, charts).
- ISR for product/category pages (`revalidate: 60`).
- Lazy-load below-fold images.
- Bundle size target: under 200KB first-load JS.

### Environment Variables (`.env.local`, with `.env.example` provided)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_WEBHOOK_SECRET=

SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
SHIPROCKET_PICKUP_LOCATION=
```
Include a README.md with setup instructions covering Supabase project setup, Razorpay
test-mode keys, and Shiprocket account/pickup-location setup.

### Razorpay Integration
- Create order server-side (`/api/razorpay/create-order`) when checkout is initiated.
- Razorpay Checkout.js on the client for the payment sheet (Cards/UPI/Netbanking/Wallets).
- Webhook (`/api/webhooks/razorpay`) verifies signature, handles
  `payment.captured` → `payment_status = 'paid'`, `payment.failed` → `payment_status = 'failed'`.
- Support Razorpay test mode.

---
## SECTION 7 — FIRST IMPLEMENTATION STEPS

1. Initialize Next.js 14 + TypeScript + Tailwind + Framer Motion.
2. Set up Supabase client, auth provider, and the full SQL migration (Section 4).
3. Set up `lib/razorpay.ts` and `lib/shiprocket.ts` server-side wrappers.
4. Build design system components (Button, Input, Modal, Toast, Skeleton, ProductCard with
   dual-image hover, VariantSelector) with animations.
5. Build storefront layout: AnnouncementBar, Header (dynamic logo), Footer, CartDrawer.
6. Build homepage with all sections.
7. Build PLP with jeans-specific filters and sorting.
8. Build PDP with waist/length variant selection, size guide modal, pincode/serviceability
   widget.
9. Build cart + checkout, including live Shiprocket rate/serviceability checks + Razorpay +
   COD.
10. Build user account pages including live order tracking timeline.
11. Build admin layout + dashboard (with shipment status widget).
12. Build admin product management (fit/wash/waist/inseam variant grid).
13. Build admin order management including the Shiprocket panel (AWB, pickup, cancel).
14. Build admin settings (incl. Shiprocket credentials/pickup location), SEO, brand management.
15. Build remaining admin pages (categories, coupons, customers, media, analytics).
16. Add search functionality.
17. Final polish: loading states, error states, empty states, 404 page.

Generate all code files with complete implementations. Do not use placeholder comments
like `// TODO` or `// implement later`. Every function must be fully written.

---
## BONUS: UI REFERENCE KEYWORDS
```
VISUAL REFERENCE KEYWORDS FOR UI QUALITY:
The storefront should feel like freakins.com: dense, energetic product grids, dual-image
hover-swap on product cards, flat black/indigo CTAs (no shimmer), a slim rotating
announcement bar, and a fast, no-friction checkout with both online payment and COD.
The admin panel should feel like a mix of Vercel's dashboard clarity and Linear's polished UI.
If in doubt, choose the more direct, more product-forward option over the more decorative
one — Variety Vista sells jeans fast, it isn't a slow-luxury boutique.
```
