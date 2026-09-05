import type { Metadata } from 'next';
import TrackOrderView from './TrackOrderView';

export const metadata: Metadata = {
  title: 'Track Your Order | Variety Vista Denim',
  description: 'Track the real-time shipping status and delivery milestones of your Variety Vista denim order.',
};

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; query?: string }>;
}) {
  const params = await searchParams;
  const initialQuery = params.order || params.query || '';

  return (
    <div className="py-20 md:py-28 bg-[#FAFAF9]">
      <div className="page-container">
        <TrackOrderView initialQuery={initialQuery} />
      </div>
    </div>
  );
}
