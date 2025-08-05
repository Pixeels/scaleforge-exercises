import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
} from "lucide-react";


const MultiSelectDropdown = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (value) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(updated);
  };

  // Close dropdown on outside click
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
    <div ref={dropdownRef} className="relative w-52">
      <button
        onClick={() => setOpen(!open)}
        className="filter-button w-full flex justify-between items-center"
      >
        <span>{label}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="filter-menu absolute mt-1 max-h-60 overflow-y-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${label}`}
            className="w-full px-2 py-1 text-sm bg-gray-800 text-white"
          />
          {filteredOptions.map((option) => (
            <label
              key={option}
              className="flex items-center px-2 py-1 text-sm hover:bg-gray-700 cursor-pointer text-yellow-400"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};


export default MultiSelectDropdown;
