# AGENTS.md — Variety Vista

## Quick Commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Supabase local | `supabase start` (applies migrations + seeds) |

## Architecture

**Framework**: Next.js 15 App Router, React 19, TypeScript strict
**Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`), Shadcn-style UI primitives in `src/components/ui/`
**Database/Auth**: Supabase (PostgreSQL + Auth) — RLS policies on all tables
**Payments**: Razorpay (test keys in `.env.local`)
**Shipping**: Shiprocket
**Analytics**: Vercel Analytics

### Route Groups
- `(storefront)` — customer-facing shop (home, collections, products, account, cart, checkout)
- `(auth)` — login, signup, password recovery
- `admin` — protected merchant dashboard (products, collections, orders, customers, settings)

### Key Directories
```
src/
├── app/                    # App Router pages + layouts
│   ├── (storefront)/       # public shop routes
│   ├── (auth)/             # auth routes
│   └── admin/              # admin dashboard
├── components/
│   ├── ui/                 # design system primitives (Button, Modal, etc.)
│   ├── storefront/         # shop-level components
│   ├── admin/              # admin forms
│   └── client/             # client-only components
├── lib/
│   ├── supabase.ts         # server client (createServerClient)
│   ├── supabase-client.ts  # browser client (createBrowserClient)
│   ├── razorpay.ts         # Razorpay helpers
│   ├── shiprocket.ts       # Shiprocket helpers
│   └── utils.ts            # cn(), formatCurrency(), etc.
├── hooks/                  # useCart, useWishlist, useDebounce, useServiceability
��── types/index.ts          # shared TypeScript types
supabase/
├── migrations/             # 001_initial, 002_collections_carts, 003_atomic_inventory
��── seed.sql                # dev data (products, variants, coupons, etc.)
```

## Database Conventions

- **Enums** defined in SQL: `user_role`, `gender_type`, `fit_type`, `rise_type`, `stretch_type`, `product_status`, `image_type`, `category_type`, `payment_method_type`, `payment_status_type`, `fulfillment_status_type`, `coupon_type`
- **RLS** enabled on all tables; admin access via `is_admin()` helper
- **Atomic inventory**: `decrement_stock_on_order()` trigger on `order_items` insert with row lock + exception on insufficient stock
- **Cart merging**: anonymous carts use `session_id`; authenticated carts use `user_id`
- **Order numbers**: `VV-10001` sequence via `generate_order_number()` trigger

## Auth & Access Control

- Supabase Auth (email/password, Google OAuth)
- Middleware: none — auth checks in Server Components via `createServerClient()`
- Admin role = `profiles.role = 'admin'` (checked via `is_admin()` SQL function)
- Protected admin routes: server-side check in `src/app/admin/layout.tsx`

## Environment Variables

Required (see `.env.local` for placeholders):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
SHIPROCKET_EMAIL
SHIPROCKET_PASSWORD
SHIPROCKET_PICKUP_LOCATION
NEXT_PUBLIC_APP_URL
```

## Image Domains (next.config.mjs)

Allowed remote patterns: `**.supabase.co`, `placehold.co`, `images.unsplash.com`

## Redirects

- `/shop` → `/collections/all`
- `/jeans` → `/collections/all`
- `/jeans/:category` → `/collections/:category`

## Development Gotchas

1. **Supabase local dev**: Run `supabase start` before `npm run dev`. Migrations auto-apply; seed runs on first start.
2. **No middleware** — auth state lives in Server Components; use `supabase.auth.getUser()` in layouts/pages.
3. **Cart merging**: guest cart (localStorage/session) merges to server cart on login via `useCart` hook.
4. **Atomic stock**: `order_items` insert will **throw** if stock insufficient — handle in checkout Server Action.
5. **Razorpay**: Test mode only in `.env.local`; webhook endpoint at `/api/webhooks/razorpay`.
6. **Fonts**: Self-hosted Geist VF in `src/app/fonts/` (no external font requests).
7. **Security headers**: Set in `vercel.json` (CSP not configured — add if needed).

## Testing & Quality

- No test suite configured. Add Vitest/Jest if needed.
- Lint: `npm run lint` (Next.js ESLint config)
- Typecheck: `tsc --noEmit` (via `npm run build`)

## Deployment

- Target: Vercel (region `bom1` per `vercel.json`)
- Build command: `npm run build`
- Env vars: set all production values in Vercel dashboard
- Supabase: link production project; run migrations via Supabase CLI or dashboard

## Key Files to Reference

| Purpose | File |
|---------|------|
| Product schema | `supabase/migrations/001_initial_schema.sql` |
| Cart/Collection schema | `supabase/migrations/002_collections_and_carts.sql` |
| Atomic inventory fix | `supabase/migrations/003_atomic_inventory.sql` |
| Dev seed data | `supabase/seed.sql` |
| Server Supabase client | `src/lib/supabase.ts` |
| Browser Supabase client | `src/lib/supabase-client.ts` |
| Admin layout (auth guard) | `src/app/admin/layout.tsx` |
| Cart hook (merge logic) | `src/hooks/useCart.tsx` |
| Checkout Server Action | `src/app/(storefront)/checkout/actions.ts` |
| Razorpay helpers | `src/lib/razorpay.ts` |
| Shiprocket helpers | `src/lib/shiprocket.ts` |