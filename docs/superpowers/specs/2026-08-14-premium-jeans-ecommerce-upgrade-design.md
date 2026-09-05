# Variety Vista Premium Upgrade — Design Specification

> **Design Read:** Indian premium jeans e-commerce (Variety Vista) — full-funnel premium upgrade for discerning denim buyers. Brand language: **heritage-raw meets modern-editorial** — authentic selvedge credibility with fashion-forward polish. Leaning toward **custom design system** (Tailwind v4 + shadcn/ui primitives + Motion + Geist) with **high variance (8), high motion (7), medium density (4)**.

---

## 1. Brand Identity & Visual Language

### 1.1 Brand Personality: "Heritage-Raw × Modern-Editorial"
- **Heritage-Raw**: Japanese selvedge authenticity, raw denim culture, fade storytelling, craftsmanship credibility
- **Modern-Editorial**: Fashion magazine layouts, asymmetric whitespace, kinetic typography, cinematic product presentation
- **Blend**: Not vintage cosplay — contemporary Indian denim brand that respects tradition but speaks to 2025 buyers

### 1.2 Color Palette (Locked — No Beige/Brass Default)
```
Primary Accent: #1A1A2E  (Deep Indigo — denim soul)
Secondary:    #00D4AA  (Oxidized Copper — rivet hardware)
Background:   #0A0A0F  (Near-black — dark mode default)
Surface:      #12121A  (Elevated cards)
Text Primary: #F5F5F0  (Off-white — warm, readable)
Text Muted:   #8B8B9A  (Desaturated indigo)
Error:        #E85D4D  (Brick red — not generic red)
Success:      #00D4AA  (Matches copper accent)
```

**Palette Rotation Rule**: This project uses Cold Luxury (indigo + copper + near-black). Next premium project must rotate.

### 1.3 Typography
- **Display**: Geist Display (Geist variable) — headlines, hero, product titles
- **Body**: Geist (variable) — UI, descriptions, long-form
- **Mono**: Geist Mono — prices, SKUs, technical specs, size labels
- **Scale**: Fluid clamp() — `text-4xl md:text-6xl lg:text-7xl` hero, `text-base md:text-lg` body
- **Serif Ban**: No serif anywhere unless explicitly justified per Section 4.1 of design-taste-frontend

### 1.4 Shape System (Locked)
- **Buttons**: Full pill (9999px) — primary, secondary, ghost
- **Cards**: 16px radius — product cards, content cards
- **Inputs**: 12px radius — forms, search, pincode
- **Images**: 4px radius — product gallery, thumbnails
- **Badges**: 6px radius — sale, new, stock indicators

---

## 2. Page-Level Design Specifications

### 2.1 Homepage (`/`)
**Structure** (10 sections, zero repetition):
1. **Hero** — Full-viewport cinematic, single product focus, scroll-triggered reveal
2. **Shop by World** — Asymmetric 3-zone layout (Fit / Wash / Occasion), not 3 equal cards
3. **New Arrivals** — Horizontal scroll-snap track, 5 products, Motion stagger entry
4. **Fit Visualizer** — Interactive fit comparison (Skinny → Relaxed), magnetic hover physics
5. **Wash Selector** — Color-chip grid with real denim texture swatches (generated)
6. **Sale Banner** — Full-width cinematic, parallax background, countdown timer
7. **Best Sellers** — Bento grid (1 featured + 2 stacked), exactly 3 cells
8. **Editorial Craft** — Long-form storytelling, scroll-driven image sequence
9. **Testimonials** — Horizontal carousel, 3 max visible, auto-advance + manual
10. **Footer Zones** — Trust strip (5 icons), Newsletter (single email + submit)

**Anti-Patterns Avoided**: No 3-column equal cards, no centered hero stack, no eyebrow on every section (max 3 total), no zigzag beyond 2 sections.

### 2.2 Collection Pages (`/collections/[slug]`)
- **Header**: Asymmetric — left: title + count, right: sort/filter drawer trigger
- **Filter Sidebar**: Slide-over panel (mobile) / sticky aside (desktop), collapsible groups
- **Product Grid**: CSS Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, gap-6
- **Product Card**: 4:5 aspect, hover → quick-view overlay (not navigation), wishlist heartbeat animation
- **Infinite Scroll**: IntersectionObserver + `useInView` (Motion), skeleton loaders matching card shape
- **Empty State**: Illustrated denim texture + "No jeans found" + "Clear filters" CTA

### 2.3 Product Detail Page (`/products/[slug]`) — **Conversion Core**
**Layout**: Split-screen sticky (images left 55%, info right 45% sticky top-24)
- **Gallery**: Main image (zoom on hover, pinch on mobile), thumbnail strip (vertical on desktop), 360° view toggle if assets exist
- **Size Selector**: Waist chips (28-40), Length chips (L30-L36) — real-time stock sync, out-of-stock = strikethrough + disabled
- **Pincode Check**: Inline, debounced 300ms, same-day delivery badge for Mumbai (400xxx)
- **CTAs**: Primary "Add to Cart" (full-width pill), Secondary "Buy Now" (outline), Wishlist (icon button, heartbeat on add)
- **Accordions**: Description / Fit & Fabric / Shipping & Returns — single open, smooth height animation
- **Social Proof**: Inline review summary (stars + count), expand to full reviews section
- **Recently Viewed**: Horizontal scroll, 5 max, persists via localStorage
- **JSON-LD**: Product + BreadcrumbList + AggregateRating (auto-generated)

### 2.4 Cart (`/cart`)
- **Layout**: Two-column (items left 65%, summary right 35% sticky)
- **Item Row**: Thumbnail (60px), title, size/length chips, qty stepper, line price, remove (trash icon, confirm toast)
- **Promo Code**: Expandable row, real-time validation, success toast
- **Summary**: Subtotal → Shipping (calculated) → Tax → Total, "Proceed to Checkout" primary CTA
- **Empty Cart**: Illustration + "Start shopping" → `/collections/all`
- **Persisted**: localStorage guest → Supabase merge on login

### 2.5 Checkout (`/checkout`) — **Zero-Friction**
- **Progress**: 3-step indicator (Shipping → Payment → Review)
- **Step 1 Shipping**: Address autocomplete (Google Places), save to profile checkbox, delivery date picker
- **Step 2 Payment**: Razorpay inline (UPI, Card, Netbanking, Wallet), saved payment methods
- **Step 3 Review**: Order summary editable (click to go back), place order → loading spinner + optimistic UI
- **Success**: Redirect to `/order-confirmation/[id]` with confetti burst (Motion, reduced-motion safe)

### 2.6 Account Pages (`/account/*`)
- **Dashboard**: Order timeline (vertical, scrollable), quick reorder, return initiation
- **Orders**: List + detail modal (timeline: placed → confirmed → shipped → delivered)
- **Addresses**: CRUD modal, default badge, delete confirmation
- **Profile**: Avatar upload (Supabase Storage), name, email, phone, password change
- **Wishlist**: Grid view, move to cart, remove, share link

### 2.7 Admin Dashboard (`/admin/*`) — **Merchant Grade**
- **Products**: Table with inline edit (title, price, stock, status), bulk actions, image upload drag-drop
- **Collections**: Drag-drop reorder, product assignment multi-select
- **Orders**: Kanban (Pending → Processing → Shipped → Delivered → Cancelled), Shiprocket sync button
- **Customers**: Search, segment tags, LTV, order history sidebar
- **Settings**: Razorpay keys, Shiprocket config, SEO defaults, email templates

---

## 3. Component Architecture

### 3.1 Design System Primitives (`src/components/ui/`)
| Component | Variants | States | Motion |
|-----------|----------|--------|--------|
| Button | primary, secondary, outline, ghost, destructive | default, hover, active, loading, disabled | scale-[0.98] active, spin loading |
| Input | default, error, success | default, focus, filled, disabled | border-color transition |
| Select | single, multi, searchable | default, open, loading | slide-down/fade |
| Dialog | default, alert, form | closed, opening, open, closing | spring(0.3, 0.7) |
| Toast | success, error, info, warning | entering, visible, exiting | slide-up + fade |
| Badge | default, sale, new, low-stock, out-of-stock | static | pulse on "low-stock" |
| Avatar | image, fallback, status | - | - |
| Skeleton | text, card, image, button | pulsing | shimmer animation |

### 3.2 Storefront Components (`src/components/storefront/`)
- `ProductCard` — 4 variants (default, featured, compact, quick-view)
- `ImageGallery` — zoom, thumbnails, 360°, fullscreen
- `SizeSelector` — waist + length, real-time stock
- `PincodeChecker` — debounced, cached results
- `AddToCartButton` — optimistic, cart drawer trigger
- `WishlistButton` — heartbeat animation
- `ProductScrollTrack` — horizontal snap, stagger entry
- `ProductBentoGrid` — asymmetric, exactly N cells
- `FitVisualizer` — interactive comparison
- `WashSelector` — texture swatches
- `EditorialCraft` — scroll-driven narrative
- `TrustStrip` — 5 icons, hover highlight
- `NewsletterSection` — inline validation, honeypot
- `HeroCarousel` — auto-advance, pause on hover, indicators

### 3.3 Client-Only Components (`src/components/client/`)
- `HeroCarousel` (already exists)
- `SaleBanner` (already exists)
- `MagneticButton` — NEW: pointer-following physics
- `ParallaxImage` — NEW: scroll-driven parallax
- `StickyStack` — NEW: GSAP pin stack (Section 5.A)
- `HorizontalPan` — NEW: GSAP horizontal scroll (Section 5.B)
- `RevealStagger` — NEW: Motion whileInView (Section 5.C)

---

## 4. Motion & Interaction Spec

### 4.1 Global Motion Values
```typescript
// motion/constants.ts
export const spring = { type: "spring", stiffness: 100, damping: 20 };
export const springSnappy = { type: "spring", stiffness: 300, damping: 30 };
export const easeOut = [0.16, 1, 0.3, 1];
export const duration = { fast: 0.15, normal: 0.3, slow: 0.6 };
```

### 4.2 Required Animations
| Trigger | Animation | Reduced Motion |
|---------|-----------|----------------|
| Page entry | Stagger fade-up (0.06s delay) | Instant |
| Scroll reveal | `whileInView` fade + y:24→0 | Instant |
| Button hover | scale 1.02, shadow lift | None |
| Button active | scale 0.98 | None |
| Card hover | y: -4, shadow XL | None |
| Wishlist add | Heartbeat (scale 1.3→1) | Color fill only |
| Cart add | Icon fly to cart badge | Toast only |
| Size select | Ring expand, bg fill | Instant |
| Pincode check | Spinner → check/x | Text only |
| Toast enter | Slide up + fade | Fade only |
| Modal open | Scale 0.95→1 + fade backdrop | Instant |
| Image zoom | Scale on hover (1.05) | None |

### 4.3 Advanced Physics (MOTION_INTENSITY: 7)
- **Magnetic Buttons**: `useMotionValue` + `useTransform` — cursor attraction within 80px radius
- **Parallax Hero**: Background translateY(-50px → 50px) on scroll
- **Sticky Stack** (Editorial): GSAP pin cards, scale/opacity scrub
- **Horizontal Pan** (Wash Selector): GSAP scrub horizontal track
- **360° View**: Drag rotation, inertia decay, snap to angles

---

## 5. Technical Requirements

### 5.1 Performance Budgets
| Metric | Target | Enforcement |
|--------|--------|-------------|
| LCP | < 2.0s | Hero `priority`, preload, `fetchPriority="high"` |
| INP | < 150ms | Code-split heavy components, `useDeferredValue` |
| CLS | < 0.05 | Reserve space for images, fonts, embeds |
| Bundle (JS) | < 180kb gz | Dynamic import below fold, tree-shake |
| Images | WebP/AVIF, responsive | `next/image` with `sizes` prop |

### 5.2 Accessibility (WCAG 2.2 AA)
- All interactive: focus-visible ring (2px, accent color, offset 2px)
- Color contrast: 4.5:1 body, 3:1 large (18px+), 3:1 UI components
- Keyboard: Tab order logical, skip links, focus trap in modals
- Screen readers: ARIA labels, live regions for toasts/cart updates
- Reduced motion: All animations respect `prefers-reduced-motion`
- Touch targets: Min 44×44px (mobile)

### 5.3 SEO & Schema
- Every page: `generateMetadata` with OG/Twitter cards
- Product: Product + Offer + AggregateRating + BreadcrumbList JSON-LD
- Collection: ItemList + BreadcrumbList JSON-LD
- Sitemap: Auto-generated via `next-sitemap`
- Robots: Allow all, disallow `/admin`, `/checkout`, `/account`

### 5.4 Internationalization (Indian Market)
- Currency: INR (��), formatted `��{price.toLocaleString('en-IN')}`
- Pincode: 6-digit validation, Mumbai (400xxx) same-day logic
- Language: English primary, Hindi labels optional (future)
- Address: Indian states, districts, landmarks

---

## 6. Data & API Contracts

### 6.1 Supabase Types (Extended)
```typescript
// types/index.ts additions
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  sale_price?: number;
  gender: 'men' | 'women' | 'unisex';
  fit_type: 'skinny' | 'slim' | 'regular' | 'relaxed' | 'loose';
  rise: 'low' | 'mid' | 'high';
  stretch_type: 'none' | 'slight' | 'moderate' | 'high';
  fabric_composition: string;
  status: 'draft' | 'active' | 'archived';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  waist_size: number;      // 28-40
  inseam_length?: number;  // 30-36
  length?: string;         // "L30", "L32", etc.
  sku: string;
  stock_quantity: number;
  barcode?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_type: 'hero' | 'flat' | 'worn' | 'detail' | '360' | 'swatch';
  alt_text: string;
  sort_order: number;
}
```

### 6.2 Server Actions (Checkout, Cart, Wishlist)
- `addToCart(productId, variantId, qty)` → optimistic update + server sync
- `updateCartItem(cartItemId, qty)` → debounced 500ms
- `removeFromCart(cartItemId)` → instant UI + server
- `toggleWishlist(productId)` → heartbeat + server
- `checkServiceability(pincode)` → cached 24h, fallback to Shiprocket
- `createOrder(shipping, payment)` → atomic inventory decrement + Razorpay order

---

## 7. Error Handling & Edge Cases

| Scenario | Handling |
|----------|----------|
| Stock race condition | Atomic DB trigger throws → catch → toast "Just sold out" + refresh |
| Pincode unserviceable | Inline message, hide "Buy Now", show "Notify me" |
| Payment failure | Razorpay error modal → retry / change method / contact support |
| Image load failure | Blur placeholder → fallback to `/placeholder-product.webp` |
| Network offline | Service worker cache → queue mutations → sync on reconnect |
| Session expiry | Silent refresh → if fails, redirect to login with return URL |

---

## 8. Testing Strategy

### 8.1 Unit Tests (Vitest)
- Utility functions: `formatCurrency`, `cn`, `debounce`, `generateOrderNumber`
- Hooks: `useCart`, `useWishlist`, `useServiceability`
- Components: Button variants, Input states, SizeSelector logic

### 8.2 Integration Tests (Playwright)
- **Happy Path**: Home → Collection → Product → Size Select → Add to Cart → Checkout → Success
- **Guest → Auth**: Cart persists, merges on login
- **Stock Edge**: Last item → concurrent add → one succeeds, one fails gracefully
- **Pincode**: Serviceable / Unserviceable / Same-day Mumbai
- **Payment**: Razorpay test mode success / failure / timeout

### 8.3 Visual Regression (Chromatic/Playwright)
- Homepage sections (10)
- Product detail states (default, loading, sold out, sale)
- Cart states (empty, items, promo applied, error)
- Checkout steps (shipping, payment, review, success)
- Dark/Light mode parity

---

## 9. Deployment & Observability

### 9.1 Vercel Configuration
- Region: `bom1` (Mumbai)
- Edge Functions: Middleware for geo-redirects, A/B testing
- Analytics: Vercel Analytics + Custom Events (cart_add, checkout_start, purchase)
- Logs: Structured JSON, correlated with Supabase request IDs

### 9.2 Monitoring
- **Uptime**: Vercel + UptimeRobot
- **Errors**: Sentry (Next.js SDK) — source maps uploaded
- **Performance**: Vercel Speed Insights + Custom Web Vitals
- **Business**: Daily orders, conversion rate, AOV, cart abandonment

---

## 10. Phased Delivery

### Phase 1: Visual Polish (Week 1-2)
- Design system primitives overhaul
- Homepage 10 sections
- Product detail page
- Color, type, shape, motion lock

### Phase 2: UX Excellence (Week 3-5)
- Collection pages + filters
- Cart + Checkout flow
- Account pages
- Advanced motion (magnetic, parallax, sticky-stack)
- PWA: manifest, service worker, install prompt

### Phase 3: Platform Grade (Week 6-8)
- Admin dashboard complete
- Internationalization prep
- A/B test framework
- Analytics dashboard
- Load testing + optimization
- Documentation + handoff

---

**Spec Status**: Complete. Ready for implementation plan.