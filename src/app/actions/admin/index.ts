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
      total: dailyTotal,
      orders: dailyOrders.length
    };
  });

  // Order Status Distribution
  const statusCounts = orders.reduce((acc: Record<string, number>, order) => {
    const status = order.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
    value
  }));

  // 2. Total Products
  const { count: productsCount, error: productsError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (productsError) {
    console.error('Error fetching products count:', productsError);
  }

  // 3. Top Products by Revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      quantity,
      line_total,
      product:products(title)
    `)
    .gte('created_at', thirtyDaysAgo.toISOString());

  let topProducts: Array<{ name: string; revenue: number; orders: number }> = [];

  if (!itemsError && orderItems) {
    const productStats = orderItems.reduce((acc: Record<string, { revenue: number; orders: number }>, item) => {
      const title = (item.product as any)?.title || 'Unknown';
      if (!acc[title]) {
        acc[title] = { revenue: 0, orders: 0 };
      }
      acc[title].revenue += item.line_total || 0;
      acc[title].orders += item.quantity || 0;
      return acc;
    }, {});

    topProducts = Object.entries(productStats)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([name, data]) => ({
        name: name.length > 25 ? name.slice(0, 22) + '...' : name,
        revenue: data.revenue,
        orders: data.orders
      }));
  }

  // 4. Recent Orders
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
    chartData,
    statusData,
    topProducts
  };
}
