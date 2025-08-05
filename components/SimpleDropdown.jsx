import React, { useState } from "react";
import {
  ChevronDown,
} from "lucide-react";


const SimpleDropdown = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-48">
      <button onClick={() => setOpen(!open)} className="filter-button w-full flex justify-between items-center">
        <span>{selected || label}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="filter-menu absolute mt-1 z-20">
          {options.map((opt) => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} className="w-full text-left px-4 py-2 text-sm">
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleDropdown;