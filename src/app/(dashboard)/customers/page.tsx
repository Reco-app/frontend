import { CustomersTable } from "./_components/CustomersTable";

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="pb-8">
        <h1 className="text-2xl font-bold text-primary">Gerencimento de clientes</h1>
        <p className="text-muted-foreground">Cadastre e obtenha informações sobre os clientes</p>
      </div>
      <CustomersTable />
    </div>
  );
}
