import Skeleton from '@/components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <Skeleton variant="text" width="250px" height="40px" />
        <Skeleton variant="rect" width="120px" height="40px" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} variant="rect" height="120px" />
        ))}
      </div>

      <div className="mt-8">
        <Skeleton variant="rect" height="400px" />
      </div>
    </div>
  );
}
