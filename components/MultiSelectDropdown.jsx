import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";

const MultiSelectDropdown = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [internalOptions, setInternalOptions] = useState(options);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Filter options based on debounced search term
  const filteredOptions = useMemo(() => {
    if (debouncedSearch.length >= 2) {
      return internalOptions.filter((o) =>
        o.toLowerCase().includes(debouncedSearch)
      );
    }
    return internalOptions;
  }, [internalOptions, debouncedSearch]);

  // Toggle selection of a value
  const toggle = (value) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(updated);
    setSearch(""); // Clear search after selection
  };

  // Search new option if it doesn't exist (case insensitive)
  const searchOption = () => {
    const trimmedSearch = search.trim();
    const exists = internalOptions.some(
      (opt) => opt.toLowerCase() === trimmedSearch.toLowerCase()
    );
    if (trimmedSearch && !exists) {
      const newOptions = [...internalOptions, trimmedSearch];
      setInternalOptions(newOptions);
      toggle(trimmedSearch);
      setSearch("");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Autofocus input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Function to highlight matching search term inside option label
  const renderOptionLabel = (option) => {
    const lowerOption = option.toLowerCase();
    const index = lowerOption.indexOf(debouncedSearch);
    if (index === -1 || debouncedSearch.length < 2) {
      return option;
    }
    return (
      <>
        {option.substring(0, index)}
        <span className="bg-yellow-300 text-black">{option.substring(index, index + debouncedSearch.length)}</span>
        {option.substring(index + debouncedSearch.length)}
      </>
    );
  };

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block w-52 z-50"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-owns={`${label}-listbox`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="filter-button flex justify-between items-center"
        aria-label={`${label} dropdown`}
        aria-controls={`${label}-listbox`}
      >
        <span>{label}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div
          className="filter-menu bg-gray-900 border border-gray-700 rounded mt-1 max-h-60 overflow-auto"
          role="listbox"
          id={`${label}-listbox`}
          tabIndex={-1}
        >
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${label}`}
            className="px-2 py-1 text-sm bg-gray-800 text-white w-full outline-none"
            aria-label={`Search ${label}`}
          />

          {filteredOptions.length === 0 && debouncedSearch ? (
            <div
              onClick={searchOption}
              className="filter-menu-create flex items-center cursor-pointer px-2 py-1 text-yellow-400 hover:bg-gray-700"
              role="option"
              aria-selected="false"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  searchOption();
                }
              }}
            >
              <Search size={17} className="mr-1" />
              Search "{search}"
            </div>
          ) : (
            filteredOptions.map((option) => (
              <label
                key={option}
                className="flex items-center px-2 py-1 text-sm hover:bg-gray-700 cursor-pointer text-yellow-400"
                role="option"
                aria-selected={selected.includes(option)}
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selected.includes(option)}
                  onChange={() => toggle(option)}
                />
                {renderOptionLabel(option)}
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
