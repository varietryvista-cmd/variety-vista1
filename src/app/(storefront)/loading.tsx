import Skeleton from '@/components/ui/Skeleton';

export default function StorefrontLoading() {
  return (
    <div className="page-container py-12">
      <div className="animate-pulse space-y-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width="200px" height="32px" />
          <Skeleton variant="text" width="100px" height="24px" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton variant="card" className="aspect-[3/4]" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="50%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
