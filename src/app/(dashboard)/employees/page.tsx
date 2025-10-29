import EmployeePageHeader from "./_components/EmployeePageHeader";
import { EmployeeProductivityRanking } from "./_components/EmployeeProductivityRanking";
import { EmployeesTable } from "./_components/EmployeesTable";

export default function EmployeesPage() {
  return (
    <div className="container mx-auto">
      <EmployeePageHeader />
      <div className="grid md:grid-cols-6 sm:grid-cols-1 gap-4 mt-8">
        <div className="md:col-span-4 sm:col-span-1">
          <EmployeesTable />
        </div>
        <div className="md:col-span-2 sm:col-span-1 pt-4">
          <EmployeeProductivityRanking />
        </div>
      </div>
    </div>
  );
}
