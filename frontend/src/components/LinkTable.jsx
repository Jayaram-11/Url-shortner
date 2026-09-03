// LinkTable - reusable table component for displaying URL records.
// Accepts:
//   columns   : array of { key, label } objects defining the columns to show
//   rows      : array of data objects (each row is one URL record)
//   onQrView  : optional callback(qrUrl) — when provided, adds a "QR Code" column
//               with a "View" button in each row that calls onQrView(row.qr_url)

function LinkTable({ columns, rows, onQrView }) {
  if (!rows || rows.length === 0) {
    return <p className="no-data">No records found.</p>;
  }

  const showQrColumn = typeof onQrView === "function";

  return (
    <div className="table-wrapper">
      <table className="link-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {showQrColumn && <th>QR Code</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.key}>
                  {/* Render URLs as clickable links */}
                  {col.key === "original_url" || col.key === "custom_url" ? (
                    <a
                      href={row[col.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {row[col.key]}
                    </a>
                  ) : (
                    row[col.key] ?? "-"
                  )}
                </td>
              ))}
              {showQrColumn && (
                <td>
                  {row.custom_code ? (
                    <button
                      className="btn-qr-view"
                      onClick={() => onQrView(row.custom_code)}
                    >
                      View
                    </button>
                  ) : (
                    <span className="no-data">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LinkTable;
