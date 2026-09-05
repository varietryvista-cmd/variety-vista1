# Variety Vista — Jeans That Define You

Variety Vista is a modern, premium e-commerce storefront for selling high-quality denim. Built with the Next.js App Router, Supabase, Tailwind CSS, and Shadcn/UI, this application provides a blazing fast, SEO-optimized, and highly interactive shopping experience.

## Features

- **App Router & Server Actions**: Fully utilizes Next.js 15+ features for server-side rendering, data fetching, and form mutations.
- **Supabase Backend**: PostgreSQL database, Authentication (Google, Email/Password), and Row Level Security.
- **Premium Design System**: Built with Tailwind CSS, Shadcn/UI, and Framer Motion (via `motion/react`) for fluid animations.
- **Full E-Commerce Flow**: Cart management, checkout, wishlist, and Razorpay/Shiprocket integrations.
- **Admin Dashboard**: Comprehensive CMS to manage products, variants, collections, and orders.
- **SEO Optimized**: Static sitemaps, JSON-LD structured data, dynamic OpenGraph images.
- **Accessibility**: ARIA-compliant UI components and keyboard navigation.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix Primitives)
- **Animations**: Motion (Framer Motion)
- **Database & Auth**: Supabase
- **Validation**: Zod
- **Analytics**: Vercel Analytics

## Local Development

### Prerequisites

1. Node.js (v18 or higher)
2. Supabase CLI (for local database development)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/varietyvista.git
cd varietyvista
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

### 4. Database Setup

The project uses Supabase. To run the database locally:

```bash
supabase start
```
This will automatically apply all migrations in the `supabase/migrations` folder and seed the database with initial products.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- `src/app/(storefront)`: The customer-facing shop interface.
- `src/app/(auth)`: Login, signup, and password recovery.
- `src/app/admin`: The protected merchant dashboard.
- `src/components/ui`: Reusable design system primitives.
- `src/components/storefront`: Higher-level components for the shop.
- `src/lib`: Utility functions, Supabase clients, and constants.
- `supabase/migrations`: SQL files defining the database schema and RLS policies.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying this application to Vercel and linking a production Supabase project.

---

Built with ❤️ for denim lovers.
