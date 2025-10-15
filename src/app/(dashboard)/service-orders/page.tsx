import { ServiceOrdersTable } from "./_components/ServiceOrdersTable";

export default function ServiceOrdersPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-primary mb-4 text-2xl font-bold">Ordens de Serviço</h1>
      <ServiceOrdersTable />
    </div>
  );
}
