import React from "react";
export default function DataTable({ columns, rows, emptyLabel = "No records found." }) {
  if (!rows?.length) return <p className="text-sm text-ink-4 text-center py-10">{emptyLabel}</p>;
  return (
    <div className="overflow-x-auto overscroll-x-contain">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-ink-4">
            {columns.map((c) => (
              <th key={c.key} className="py-3 px-3 font-medium whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row._id || i} className="border-b border-line/60 hover:bg-ink/5 transition">
              {columns.map((c) => (
                <td key={c.key} className="py-3 px-3 text-ink-2 whitespace-nowrap">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
