import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export type DetailsCardFieldData = {
  label: string;
  value: string | number | null;
  icon: React.ReactNode;
};

interface DetailsCardInterface {
  headerTitle: string;
  headerIcon: React.ReactNode;
  fields: DetailsCardFieldData[];
}

export function DetailsCard({ headerTitle, headerIcon, fields }: DetailsCardInterface) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          {headerIcon}
          {headerTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div className="flex items-center gap-3" key={index}>
            {field.icon}
            <div>
              <p className="text-primary text-sm font-medium">{field.label}</p>
              <p className="text-muted-foreground text-sm">{field.value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
