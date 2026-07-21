import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DataTableColumn<Row> = {
  key: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  className?: string;
};

type DataTableProps<Row> = {
  columns: DataTableColumn<Row>[];
  data: Row[];
  getRowKey: (row: Row) => string | number;
  empty?: ReactNode;
  className?: string;
};

export function DataTable<Row>({
  columns,
  data,
  getRowKey,
  empty,
  className,
}: DataTableProps<Row>) {
  if (data.length === 0) {
    return <>{empty ?? null}</>;
  }

  return (
    <div className={cn("overflow-x-auto rounded-lg border border-border bg-surface", className)}>
      <table className="min-w-full text-left text-sm">
        <thead className="bg-surface-muted text-xs font-semibold uppercase text-muted-fg">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={cn("px-4 py-3", column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-body">
          {data.map((row) => (
            <tr key={getRowKey(row)} className="transition-colors hover:bg-surface-muted/60">
              {columns.map((column) => (
                <td key={column.key} className={cn("px-4 py-3 align-middle", column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
