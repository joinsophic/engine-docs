export const Table = ({ columns = [], data = [], idKey, title }) => {
  const keyField = idKey || columns[0]?.key;

  const getColWidth = (col, index) => {
    if (col.width) return col.width;
    return index === 0 ? "auto" : "minmax(0, 1fr)";
  };

  const gridTemplate = columns.map(getColWidth).join(" ");

  return (
    <div
      className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden"
      style={{ display: "grid", gridTemplateColumns: gridTemplate }}
    >
      {/* Title */}
      {title && (
        <div
          className="py-3 px-4 font-semibold text-md text-gray-700 border-b border-gray-200"
          style={{ gridColumn: "1 / -1" }}
        >
          {title}
        </div>
      )}
      {/* Column Headers */}
      {columns.map((col) => (
        <div
          key={`header-${col.key}`}
          className="py-3 px-4 font-semibold text-[12px] text-gray-600 uppercase whitespace-nowrap bg-gray-50 border-b border-gray-200"
        >
          {col.header}
        </div>
      ))}
      {/* Rows */}
      {data.map((row, rowIndex) =>
        columns.map((col, colIndex) => (
          <div
            key={`${row[keyField]}-${col.key}`}
            id={colIndex === 0 ? row[keyField] : undefined}
            className={`py-3 px-4 text-gray-600 leading-relaxed border-b border-gray-100 ${
              colIndex === 0 ? "whitespace-nowrap" : ""
            } ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
          >
            {col.render ? col.render(row[col.key]) : row[col.key]}
          </div>
        ))
      )}
    </div>
  );
};
