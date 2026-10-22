"use client";

import { useId } from "react";

export default function Input({
  label,
  error,
  hint,
  className = "",
  id,
  as = "input",
  rows = 6,
  ...props
}) {
  const autoId = useId();
  const inputId = id || autoId;
  const Element = as === "textarea" ? "textarea" : "input";

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--ink)]">
          {label}
        </label>
      ) : null}
      <Element
        id={inputId}
        rows={as === "textarea" ? rows : undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={`w-full rounded-xl border bg-white/55 px-3.5 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-soft)]/55 transition-[border-color,background-color,box-shadow] duration-200 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[var(--green)]/35 ${
          as === "textarea" ? "py-3 leading-relaxed" : "h-11"
        } ${error ? "border-[var(--danger)]" : "border-[var(--glass-border)]"} ${className}`}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-[var(--danger)]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-sm text-[var(--ink-soft)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
