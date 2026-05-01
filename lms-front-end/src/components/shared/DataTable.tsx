import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
}: Readonly<DataTableProps<T>>) {
  if (data.length === 0) {
    return (
      <div className="border-t border-charcoal/15 py-16 text-center">
        <p className="font-heading text-xl text-warm-grey italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-charcoal/15">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 text-overline whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="border-b border-charcoal/5 hover:bg-charcoal/2 transition-colors duration-300"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-4 px-4 text-sm text-charcoal">
                  {col.render
                    ? col.render(item)
                    : (function () {
                      const val = (item as Record<string, unknown>)[col.key];
                      if (typeof val === 'string') return val;
                      if (typeof val === 'number' || typeof val === 'boolean') return val.toString();
                      return '';
                    })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
