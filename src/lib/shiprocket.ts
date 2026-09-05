'use server'

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken: string | null = null;

export async function getAuthToken(): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }

  const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with Shiprocket');
  }

  const data = await response.json();
  cachedToken = data.token;
  return data.token;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let token = await getAuthToken();
  
  const makeRequest = () => fetch(`${SHIPROCKET_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  let response = await makeRequest();

  if (response.status === 401) {
    cachedToken = null; // Invalidate token
    token = await getAuthToken(); // Get new token
    response = await makeRequest(); // Retry request
  }

  return response;
}

export interface ServiceabilityResult {
  available: boolean;
  estimatedDays: number;
  codAvailable: boolean;
  courierName: string;
}

export async function checkServiceability(
  pickupPincode: string,
  deliveryPincode: string,
  weight: number,
  cod: boolean
): Promise<ServiceabilityResult> {
  const response = await fetchWithAuth(
    `/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${cod ? 1 : 0}`
  );

  if (!response.ok) {
    throw new Error('Failed to check serviceability');
  }

  const data = await response.json();
  const availableCouriers = data.data?.available_courier_companies || [];
  
  if (availableCouriers.length === 0) {
    return {
      available: false,
      estimatedDays: 0,
      codAvailable: false,
      courierName: '',
    };
  }

  const bestCourier = availableCouriers[0]; // Simplified: taking the first available courier
  
  return {
    available: true,
    estimatedDays: parseInt(bestCourier.etd) || 5,
    codAvailable: cod ? bestCourier.cod === 1 : false,
    courierName: bestCourier.courier_name,
  };
}

export interface ShiprocketOrderPayload {
  order_id: string;
  order_date: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_country?: string;
  shipping_state?: string;
  shipping_email?: string;
  shipping_phone?: string;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: number;
    tax?: number;
    hsn?: number;
  }>;
  payment_method: 'Prepaid' | 'COD';
  shipping_charges: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
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
  status_code: number;
  onboarding_completed_now: number;
  awb_code: string;
  courier_company_id: string;
  courier_name: string;
}

export async function createShiprocketOrder(orderData: ShiprocketOrderPayload): Promise<ShiprocketOrderResponse> {
  const response = await fetchWithAuth('/orders/create/adhoc', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create Shiprocket order: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data;
}

export interface AWBResponse {
  awb_assign_status: number;
  response: {
    data: {
      awb_code: string;
      applied_weight: number;
      company_id: number;
      courier_company_id: number;
      courier_name: string;
      routing_code: string;
    };
  };
}

export async function generateAWB(shipmentId: string, courierId?: string): Promise<AWBResponse> {
  const payload: Record<string, string> = { shipment_id: shipmentId };
  if (courierId) {
    payload.courier_id = courierId;
  }
  
  const response = await fetchWithAuth('/courier/assign/awb', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to generate AWB');
  }

  return response.json();
}

export interface PickupResponse {
  pickup_status: number;
  response: string;
}

export async function schedulePickup(shipmentId: string): Promise<PickupResponse> {
  const response = await fetchWithAuth('/courier/generate/pickup', {
    method: 'POST',
    body: JSON.stringify({ shipment_id: shipmentId }),
  });

  if (!response.ok) {
    throw new Error('Failed to schedule pickup');
  }

  return response.json();
}

export interface TrackingResponse {
  tracking_data: Record<string, unknown>;
}

export async function trackShipment(awbCode: string): Promise<TrackingResponse> {
  const response = await fetchWithAuth(`/courier/track/awb/${awbCode}`);

  if (!response.ok) {
    throw new Error('Failed to track shipment');
  }

  return response.json();
}

export interface CancelResponse {
  status: number;
  message: string;
}

export async function cancelShipment(orderIds: string[]): Promise<CancelResponse> {
  const response = await fetchWithAuth('/orders/cancel', {
    method: 'POST',
    body: JSON.stringify({ ids: orderIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to cancel shipment');
  }

  return response.json();
}
