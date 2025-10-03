import { EmployeesTable } from './_components/EmployeesTable';

export default function EmployeesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-primary mb-4 text-2xl font-bold">Gerenciamento de Funcionários</h1>
      <EmployeesTable />
    </div>
  );
}
