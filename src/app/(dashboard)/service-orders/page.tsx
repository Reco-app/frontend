import { ServiceOrdersStats } from "./_components/ServiceOrdersStats";
import { ServiceOrdersTable } from "./_components/ServiceOrdersTable";

export default function ServiceOrdersPage() {
  return (
    <div className="container mx-auto py-10">
      <ServiceOrdersStats />
      <ServiceOrdersTable />
    </div>
  );
}
