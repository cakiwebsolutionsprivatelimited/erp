import React from 'react';

interface DateRangeFilterProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ from, to, onFromChange, onToChange }) => (
  <div className="grid gap-2 sm:grid-cols-2">
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-500">From</span>
      <input
        type="date"
        value={from}
        onChange={(event) => onFromChange(event.target.value)}
        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-500">To</span>
      <input
        type="date"
        value={to}
        onChange={(event) => onToChange(event.target.value)}
        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  </div>
);
