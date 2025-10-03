import { Skeleton } from '@/components/ui/skeleton';
import { EmployeesTableSkeleton } from './_components/EmployeesTableSkeleton';

export default function LoadingCustomers() {
  return (
    <div className="p-6">
      <header className="mb-4">
        <Skeleton className="h-8 w-48" />
      </header>
      <EmployeesTableSkeleton />
    </div>
  );
}
