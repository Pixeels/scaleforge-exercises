import { useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, startOfWeek, endOfWeek, subDays, startOfToday, endOfToday } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css"; // Base styles (we'll override with Tailwind)

const presets = [
  { label: "Today", range: [startOfToday(), endOfToday()] },
  { label: "This week", range: [startOfWeek(new Date()), endOfWeek(new Date())] },
  { label: "Last week", range: [startOfWeek(subDays(new Date(), 7)), endOfWeek(subDays(new Date(), 7))] },
  { label: "This month", range: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()] },
  { label: "Last month", range: [new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), new Date(new Date().getFullYear(), new Date().getMonth(), 0)] },
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

  const applySelection = () => {
    onChange({ from: range[0].startDate, to: range[0].endDate });
    setShowPicker(false);
  };

  return (
    <div className="relative w-60">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="filter-button w-full flex justify-between items-center"
      >
        <span>Date Registered</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showPicker && (
        <div className="absolute z-50 mt-2 bg-[#0f172a] text-white rounded-lg shadow-lg border border-gray-700 p-4 w-[32rem]">
          <div className="flex gap-4">
            {/* Presets */}
            <div className="flex flex-col gap-2 w-1/4 text-sm">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() =>
                    setRange([{ startDate: p.range[0], endDate: p.range[1], key: "selection" }])
                  }
                  className="text-left px-3 py-1 rounded hover:bg-yellow-500 hover:text-black transition"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="w-3/4">
              <DateRange
                ranges={range}
                onChange={(item) => setRange([item.selection])}
                showMonthAndYearPickers={true}
                rangeColors={["#fbbd2c"]}
                className="rounded-lg overflow-hidden"
                months={2}
                direction="horizontal"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowPicker(false)}
                  className="px-4 py-1 text-sm text-white bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={applySelection}
                  className="px-4 py-1 text-sm bg-yellow-400 text-black rounded hover:bg-yellow-500"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
