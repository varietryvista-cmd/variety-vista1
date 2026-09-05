import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  email: string;
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    size?: string;
    imageUrl?: string;
  }>;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: string;
  estimatedDelivery?: string;
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">` : ''}
          <div>
            <p style="margin: 0; font-weight: 500; color: #111;">${item.title}</p>
            ${item.size ? `<p style="margin: 4px 0 0; font-size: 13px; color: #666;">Size: ${item.size}</p>` : ''}
            <p style="margin: 4px 0 0; font-size: 13px; color: #666;">Qty: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right; color: #111;">
        ₹${item.lineTotal.toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f4f2;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <tr>
          <td style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <!-- Header -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #111; padding: 32px;">
              <tr>
                <td style="text-align: center;">
                  <h1 style="margin: 0; color: #fff; font-size: 24px; font-weight: 600; letter-spacing: 0.05em;">Variety Vista</h1>
                  <p style="margin: 8px 0 0; color: #888; font-size: 14px;">Order Confirmation</p>
                </td>
              </tr>
            </table>

            <!-- Content -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 32px;">
              <tr>
                <td>
                  <p style="margin: 0 0 16px; color: #111; font-size: 16px;">Hi <strong>${data.customerName}</strong>,</p>
                  <p style="margin: 0 0 24px; color: #444; line-height: 1.6;">Thank you for your order! We've received your order <strong>#${data.orderNumber}</strong> and it's being processed.</p>

                  <!-- Order Summary Table -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
                    <thead>
                      <tr style="background: #f5f4f2;">
                        <th style="padding: 12px; text-align: left; color: #111; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e5e5e5;">Item</th>
                        <th style="padding: 12px; text-align: right; color: #111; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e5e5e5;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- Totals -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 8px 0; color: #444;">Subtotal</td>
                      <td style="padding: 8px 0; text-align: right; color: #444;">₹${data.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    ${data.discountAmount > 0 ? `
                    <tr>
                      <td style="padding: 8px 0; color: #059669;">Discount</td>
                      <td style="padding: 8px 0; text-align: right; color: #059669;">-₹${data.discountAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; color: #444;">Shipping</td>
                      <td style="padding: 8px 0; text-align: right; color: #444;">${data.shippingCost === 0 ? 'FREE' : '₹' + data.shippingCost.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style="border-top: 2px solid #111;">
                      <td style="padding: 12px 0 0; color: #111; font-weight: 600; font-size: 18px;">Total</td>
                      <td style="padding: 12px 0 0; text-align: right; color: #111; font-weight: 600; font-size: 18px;">₹${data.total.toLocaleString('en-IN')}</td>
                    </tr>
                  </table>

                  <!-- Shipping Address -->
                  <div style="background: #f5f4f2; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <p style="margin: 0 0 12px; color: #111; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Shipping Address</p>
                    <p style="margin: 0; color: #444; line-height: 1.8; font-size: 14px;">
                      ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
                      ${data.shippingAddress.address}<br>
                      ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}<br>
                      Phone: ${data.shippingAddress.phone}
                    </p>
                  </div>

                  <!-- Payment Method -->
                  <p style="margin: 0 0 8px; color: #111; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Payment Method</p>
                  <p style="margin: 0 0 24px; color: #444;">${data.paymentMethod === 'razorpay' ? 'Razorpay (Online)' : 'Cash on Delivery'}</p>

                  <!-- CTA -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/track-order?order=${data.orderNumber}" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">Track Your Order</a>
                      </td>
                    </tr>
                  </table>

                  <!-- Estimated Delivery -->
                  ${data.estimatedDelivery ? `
                  <p style="margin: 24px 0 0; padding-top: 24px; border-top: 1px solid #e5e5e5; color: #444; font-size: 14px; text-align: center;">
                    Estimated delivery: <strong>${data.estimatedDelivery}</strong>
                  </p>
                  ` : ''}
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f5f4f2; padding: 24px 32px;">
              <tr>
                <td style="text-align: center; color: #888; font-size: 12px; line-height: 1.6;">
                  <p style="margin: 0 0 8px;">Questions? Contact us at <a href="mailto:support@varietyvista.com" style="color: #111;">support@varietyvista.com</a></p>
                  <p style="margin: 0;">© ${new Date().getFullYear()} Variety Vista. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: 'Variety Vista <orders@varietyvista.com>',
      to: [data.email],
      subject: `Order Confirmed #${data.orderNumber} | Variety Vista`,
      html,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendShippingConfirmationEmail(
  email: string,
  orderNumber: string,
  awbCode: string,
  courierName: string,
  trackingUrl: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f4f2;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <tr>
          <td style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #111; padding: 32px;">
              <tr>
                <td style="text-align: center;">
                  <h1 style="margin: 0; color: #fff; font-size: 24px; font-weight: 600; letter-spacing: 0.05em;">Variety Vista</h1>
                  <p style="margin: 8px 0 0; color: #888; font-size: 14px;">Your Order Has Shipped</p>
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 32px;">
              <tr>
                <td>
                  <p style="margin: 0 0 16px; color: #111; font-size: 16px;">Your order <strong>#${orderNumber}</strong> is on its way!</p>
                  
                  <div style="background: #f5f4f2; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                    <p style="margin: 0 0 8px; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Tracking Number (AWB)</p>
                    <p style="margin: 0; color: #111; font-size: 24px; font-weight: 600; letter-spacing: 0.1em;">${awbCode}</p>
                    <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Courier: ${courierName}</p>
                  </div>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="text-align: center;">
                        <a href="${trackingUrl}" target="_blank" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">Track Shipment</a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 24px 0 0; padding-top: 24px; border-top: 1px solid #e5e5e5; color: #444; font-size: 14px; text-align: center;">
                    You'll receive another update when your package is out for delivery.
                  </p>
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f5f4f2; padding: 24px 32px;">
              <tr>
                <td style="text-align: center; color: #888; font-size: 12px;">
                  <p style="margin: 0;">© ${new Date().getFullYear()} Variety Vista. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: 'Variety Vista <orders@varietyvista.com>',
      to: [email],
      subject: `Your Order #${orderNumber} Has Shipped | Variety Vista`,
      html,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send shipping confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}