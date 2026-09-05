# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router), Tailwind CSS v4, Supabase (Auth & Postgres Database), Framer Motion (motion/react).

## Users

Style-conscious 18-35 year olds looking for premium Indian streetwear denim. 

## Product Purpose

A premium e-commerce storefront allowing customers to browse streetwear collections, discover their ideal fit via a guided Fit Finder, and seamlessly purchase high-quality denim. It serves as both a high-conversion sales channel and a brand-building visual experience.

## Positioning

Premium Indian streetwear denim that fuses modern street culture with impeccable craft and fit. It provides a luxurious digital shopping experience typically reserved for high-end designer brands.

## Operating Context

Customers shop across mobile devices (primary) and desktop (secondary). The workflow spans discovery (landing, collections), evaluation (product details, Fit Finder), and transaction (guest or authenticated checkout via Razorpay, fulfillment via Shiprocket). Administrators manage the catalog and orders via a protected `/admin` dashboard.

## Capabilities and Constraints

- E-commerce catalog with variant selections (size, color).
- Interactive "Fit Finder" to guide users to their ideal denim cut.
- Guest and authenticated checkout with cart merging.
- Payment gateway integration (Razorpay) and shipping logistics (Shiprocket).
- Real-time stock decrementing via PostgreSQL triggers.

## Brand Commitments

- Brand Name: Variety Vista.
- Brand Voice: Confident, premium, culturally rooted but globally aware.
- Visuals: High-quality photography-led, relying on sophisticated typography and restrained motion.

## Evidence on Hand

- A fully functional Next.js App Router codebase.
- Custom Shadcn-style UI primitives (`src/components/ui/*`).
- Supabase migrations and RLS policies for atomic inventory management.
- Completed e-commerce flows (cart drawer, checkout, order confirmation).

## Product Principles

1. **Aesthetic Authority:** The UI must feel expensive, deliberate, and un-templated, elevating the perception of the denim.
2. **Frictionless Commerce:** The path from discovery to purchase must be instantaneous, with zero layout shifts or confusing form states.
3. **Motion with Intent:** Animation is used exclusively for tactile feedback, spatial hierarchy, or storytelling—never as decoration.

## Accessibility & Inclusion

UI elements adhere to WCAG AA contrast standards. Forms and interactive elements support keyboard navigation and screen readers. Motion respects `prefers-reduced-motion` settings.
