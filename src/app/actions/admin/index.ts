import { createAdminClient } from '@/lib/supabase';

export async function getDashboardStats() {
  const supabase = await createAdminClient();

  // 1. Total Orders & Revenue
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, total_amount, user_id, created_at, status, payment_status')
    .neq('status', 'cancelled');

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw new Error('Failed to fetch orders');
  }

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  
  const uniqueCustomers = new Set(orders.map(o => o.user_id).filter(Boolean));
  const totalCustomers = uniqueCustomers.size;

  // Group orders by date (last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  }).reverse();

  const chartData = last7Days.map(date => {
    const dailyOrders = orders.filter(o => o.created_at.startsWith(date));
    const dailyTotal = dailyOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    return {
      name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: dailyTotal
    };
  });

  // 2. Total Products
  const { count: productsCount, error: productsError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (productsError) {
    console.error('Error fetching products count:', productsError);
  }

  // 3. Recent Orders
  const { data: recentOrders, error: recentError } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      user_id
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentError) {
    console.error('Failed to fetch recent orders for dashboard:', recentError);
  }

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts: productsCount || 0,
    recentOrders: recentOrders || [],
    chartData
  };
}
