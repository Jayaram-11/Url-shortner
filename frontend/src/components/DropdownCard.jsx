// DropdownCard - a collapsible card used in the URL Shortener page.
// Shows a title; clicking it expands/collapses the children content.

import { useState } from "react";

function DropdownCard({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown-card">
      <button
        className="dropdown-card-header"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <span className="dropdown-arrow">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="dropdown-card-body">{children}</div>}
    </div>
  );
}

export default DropdownCard;
