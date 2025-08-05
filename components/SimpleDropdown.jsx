import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";


const SimpleDropdown = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLabel =
    options.find((opt) => opt.value === selected[0])?.label || label;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-48">
      <button
        onClick={() => setOpen(!open)}
        className="filter-button w-full flex justify-between items-center"
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="filter-menu absolute mt-1 z-20">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange([opt.value]);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-gray-800"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleDropdown;
