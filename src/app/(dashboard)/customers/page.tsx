import { CustomersTable } from "./_components/CustomersTable";

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-primary mb-4 text-2xl font-bold">Gerenciamento de clientes</h1>
      <CustomersTable />
    </div>
  );
}
