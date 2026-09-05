import { Metadata } from 'next';
import { getAdminCoupons } from '@/app/actions/admin/coupons';
import CouponsManager from '@/components/admin/CouponsManager';

export const metadata: Metadata = {
  title: 'Coupons & Discounts | Admin',
};

export default async function AdminCouponsPage() {
  const { data: coupons } = await getAdminCoupons();

  return (
    <div>
      <CouponsManager initialCoupons={coupons || []} />
    </div>
  );
}
