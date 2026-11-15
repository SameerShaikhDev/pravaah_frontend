import React from "react";
import { CODING_LANGUAGES } from "../../constants";
export default function LanguageSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-surface border border-line rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
    >
      {CODING_LANGUAGES.map((l) => (
        <option key={l.value} value={l.value}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
