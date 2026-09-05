# Deployment Guide

This guide outlines the steps required to deploy Variety Vista to production using Vercel (for the frontend/API) and Supabase (for the database and authentication).

## Prerequisites

- A GitHub repository containing the Variety Vista source code.
- A [Vercel](https://vercel.com/) account.
- A [Supabase](https://supabase.com/) account.
- (Optional) Accounts for Razorpay (payments) and Shiprocket (shipping) if integrating those features.

## Step 1: Set up Production Supabase

1. Log in to [Supabase](https://supabase.com/) and create a new project.
2. In the dashboard, navigate to **Project Settings > API** to find your `Project URL` and `anon public key`.
3. You will also need the `service_role` secret key for backend actions (do NOT expose this to the frontend).
4. Run your database migrations on the production database. You can do this by linking your local Supabase CLI to your remote project and pushing the migrations:
   ```bash
   supabase link --project-ref your-project-ref
   supabase db push
   ```

## Step 2: Configure Supabase Authentication

1. Go to **Authentication > Providers** in Supabase and ensure Email is enabled.
2. Go to **Authentication > URL Configuration**.
3. Set the **Site URL** to your production domain (e.g., `https://varietyvista.com`).
4. Add any necessary redirect URIs (e.g., `https://varietyvista.com/auth/callback`).

## Step 3: Deploy to Vercel

1. Log in to your Vercel dashboard and click **Add New... > Project**.
2. Import your GitHub repository for Variety Vista.
3. In the **Environment Variables** section, you MUST add all the variables from your `.env.local` file. 

Here are the required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://varietyvista.com

# Razorpay (Optional - if using)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Shiprocket (Optional - if using)
SHIPROCKET_EMAIL=your_email
SHIPROCKET_PASSWORD=your_password
```

4. Click **Deploy**. Vercel will build and deploy the Next.js application.

## Step 4: Final Checks

1. Once Vercel finishes deploying, visit the production URL.
2. Verify that images load correctly.
3. Attempt to create a new user account to verify authentication.
4. Go to `/admin` to verify that the RLS policies and admin views are functioning.

## Troubleshooting

- **Database Errors**: Double-check that `supabase db push` ran successfully and all tables exist in your production database.
- **Auth Redirects**: If logging in redirects you to `localhost`, ensure your Supabase Auth Site URL is correctly set to your production domain.
- **Server Errors (500)**: Check the Vercel Logs tab for detailed error traces. Ensure your `SUPABASE_SERVICE_ROLE_KEY` is correct.
