import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  subDays,
  startOfToday,
  endOfToday,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const presets = [
  { label: "Today", range: [startOfToday(), endOfToday()] },
  { label: "This week", range: [startOfWeek(new Date()), endOfWeek(new Date())] },
  { label: "Last week", range: [startOfWeek(subDays(new Date(), 7)), endOfWeek(subDays(new Date(), 7))] },
  {
    label: "This month",
    range: [
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(),
    ],
  },
  {
    label: "Last month",
    range: [
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    ],
  },
];

export default function DateRangePicker({ selected, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: selected?.from || new Date(),
      endDate: selected?.to || new Date(),
      key: "selection",
    },
  ]);
  const [activePreset, setActivePreset] = useState(null);
  const pickerRef = useRef(null); // 🆕 ref

  const handlePresetClick = (p) => {
    setRange([{ startDate: p.range[0], endDate: p.range[1], key: "selection" }]);
    setActivePreset(p.label);
  };

  const applySelection = () => {
    onChange({ from: range[0].startDate, to: range[0].endDate });
    setShowPicker(false);
  };

  // 🆕 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative w-60" ref={pickerRef}>
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="filter-button w-full flex justify-between items-center bg-[#1e293b] text-white px-4 py-2 rounded shadow"
      >
        <span>Date Registered</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showPicker && (
        <div className="drp-dropdown">
          <div className="drp-content">
            {/* Presets */}
            <div className="drp-presets">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePresetClick(p)}
                  className={`drp-preset-btn ${activePreset === p.label ? "active" : ""}`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Calendar and actions */}
            <div className="drp-calendar">
              <DateRange
                ranges={range}
                onChange={(item) => setRange([item.selection])}
                showMonthAndYearPickers={true}
                rangeColors={["#fbbd2c"]}
                months={2}
                direction="horizontal"
              />

              <div className="drp-footer">
                <div className="drp-time-display">
                  <div>
                    <span>Start:</span>
                    <div className="drp-time-box">
                      {range[0].startDate.toLocaleDateString()} 00:00:00
                    </div>
                  </div>
                  <div>
                    <span>End:</span>
                    <div className="drp-time-box">
                      {range[0].endDate.toLocaleDateString()} 00:00:00
                    </div>
                  </div>
                </div>

                <div className="drp-buttons">
                  <button onClick={() => setShowPicker(false)} className="drp-btn cancel">
                    Cancel
                  </button>
                  <button onClick={applySelection} className="drp-btn apply">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
