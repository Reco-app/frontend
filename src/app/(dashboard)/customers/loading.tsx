import { Skeleton } from '@/components/ui/skeleton';
import { CustomersTableSkeleton } from './_components/CustomersTableSkeleton';

export default function LoadingCustomers() {
  return (
    <div className="p-6">
      <header className="mb-4">
        <Skeleton className="h-8 w-48" />
      </header>
      <CustomersTableSkeleton />
    </div>
  );
}
