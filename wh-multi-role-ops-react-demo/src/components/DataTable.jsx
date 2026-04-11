export default function DataTable({ columns, rows, selectedId, onSelect }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={row.id === selectedId ? "selected" : ""}
              onClick={() => onSelect(row.id)}
            >
              {columns.map((column) => (
                <td key={`${row.id}-${column.key}`}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
