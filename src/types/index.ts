// ============================================
// VARIETY VISTA — TypeScript Type Definitions
// Matches Supabase database schema exactly
// ============================================

// ---- Enums ----
export type UserRole = 'customer' | 'admin';
export type Gender = 'men' | 'women' | 'unisex';
export type FitType = 'bootcut' | 'baggy' | 'straight' | 'skinny' | 'wide_leg' | 'mom' | 'flare';
export type RiseType = 'low' | 'mid' | 'high';
export type StretchType = 'rigid' | 'stretch' | 'super_stretch';
export type ProductStatus = 'draft' | 'active';
export type ImageType = 'flat' | 'on_model' | 'detail';
export type CategoryType = 'gender' | 'fit';
export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cod_pending';
export type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'rto';
export type CouponType = 'percentage' | 'fixed';
export type ProductCategory = string; // Flexible categories managed via admin panel

// ---- Table Interfaces ----

export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  tagline?: string | null;
  logo_url?: string | null;
  logo_inverted_url?: string | null;
  favicon_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  business_address?: string | null;
  currency_code: string;
  currency_symbol: string;
  tax_rate: number;
  tax_inclusive: boolean;
  announcement_messages: string[];
  cod_enabled: boolean;
  free_shipping_threshold: number;
  flat_shipping_rate: number;
  shiprocket_pickup_location?: string | null;
  social_instagram?: string | null;
  social_facebook?: string | null;
  social_twitter?: string | null;
  social_tiktok?: string | null;
  social_youtube?: string | null;
  updated_at: string;
}

export interface SeoSettings {
  id: number;
  meta_title_template?: string | null;
  default_meta_description?: string | null;
  og_default_image_url?: string | null;
  ga_tracking_id?: string | null;
  fb_pixel_id?: string | null;
  search_console_meta?: string | null;
  robots_txt?: string | null;
  updated_at: string;
}

export interface PageSeo {
  id: string;
  page_slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  description?: string | null;
  image_url?: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  gender: Gender;
  fit_type: FitType;
  wash?: string | null;
  rise?: RiseType | null;
  stretch_type?: StretchType | null;
  fabric_composition?: string | null;
  colour?: string | null;
  video_url?: string | null;
  model_info?: string | null;
  bestseller: boolean;
  new_arrival: boolean;
  featured: boolean;
  price: number;
  sale_price?: number | null;
  sale_start?: string | null;
  sale_end?: string | null;
  sku_prefix?: string | null;
  status: ProductStatus;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
  tags?: string[];
  product_category?: ProductCategory;
  created_at: string;
  updated_at: string;

  // Relations (populated via joins)
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_type: ImageType;
  sort_order: number;
  alt_text?: string | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  waist_size: number;
  inseam_length?: number | null;
  length?: string | null;
  price?: number | null; // override
  stock_quantity: number;
  created_at: string;
}

export interface SizeGuide {
  id: string;
  gender: Gender;
  waist_size: number;
  hip_range?: string | null;
  inseam_options?: Record<string, unknown> | null;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  email: string;
  shipping_address: Record<string, unknown>;
  billing_address?: Record<string, unknown> | null;
  shipping_method?: string | null;
  shipping_cost: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  coupon_code?: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  shiprocket_order_id?: string | null;
  shiprocket_shipment_id?: string | null;
  awb_code?: string | null;
  courier_name?: string | null;
  tracking_status?: string | null;
  estimated_delivery_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  items?: OrderItem[];
  timeline?: OrderTimeline[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  title: string;
  waist_size?: number | null;
  inseam_length?: number | null;
  wash?: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface OrderTimeline {
  id: string;
  order_id: string;
  status: string;
  note?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  is_verified: boolean;
  customer_photos?: string[];
  created_at: string;

  // Relation
  user?: Profile;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order_amount: number;
  usage_limit?: number | null;
  per_customer_limit: number;
  times_used: number;
  valid_from?: string | null;
  valid_to?: string | null;
  applicable_products?: string[];
  applicable_fit_types?: string[];
  is_active: boolean;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  heading?: string | null;
  subheading?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;

  product?: Product;
}

export interface MediaItem {
  id: string;
  url: string;
  filename?: string | null;
  size?: number | null;
  mime_type?: string | null;
  uploaded_by?: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

// ---- Cart Types (Client-side) ----

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  slug: string;
  title: string;
  image?: string | null;
  price: number;
  wash?: string | null;
  waistSize?: number | null;
  inseamLength?: number | null;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

// ---- Shiprocket Types ----

export interface ServiceabilityResult {
  available: boolean;
  estimatedDays: number;
  codAvailable: boolean;
  courierName: string;
  shippingCost: number;
}

export interface ShiprocketOrderPayload {
  order_id: string;
  order_date: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
  }>;
  payment_method: string;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface ShiprocketOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
}

export interface AWBResponse {
  awb_code: string;
  courier_name: string;
  applied_weight: number;
}

export interface TrackingResponse {
  tracking_data: {
    shipment_status: number;
    shipment_track: Array<{
      date: string;
      activity: string;
      location: string;
    }>;
    track_status: number;
    shipment_track_activities: Array<{
      date: string;
      status: string;
      activity: string;
      location: string;
    }>;
  };
}

// ---- Collection Types ----

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
  sort_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  products?: Product[];
}

export interface CollectionProduct {
  id: string;
  collection_id: string;
  product_id: string;
  sort_order: number;
  created_at: string;
}

// ---- Server-Side Cart Types ----

export interface ServerCart {
  id: string;
  user_id?: string | null;
  session_id?: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  items?: ServerCartItem[];
}

export interface ServerCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;

  // Relations
  product?: Product;
  variant?: ProductVariant;
}
