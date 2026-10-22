"use client";

const variants = {
  primary:
    "bg-[var(--green)] text-[var(--ink)] hover:bg-[#19a849] active:bg-[#159640] shadow-[0_10px_22px_rgba(29,185,84,0.22)]",
  secondary:
    "bg-white/55 text-[var(--ink)] border border-[var(--glass-border)] hover:bg-white/75",
  ghost:
    "bg-transparent text-[var(--ink-soft)] hover:bg-white/45 hover:text-[var(--ink)]",
  danger:
    "bg-[var(--danger)] text-white hover:bg-[#c23a3a] active:bg-[#ad3333]",
};

const sizes = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-xl",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2.5 rounded-2xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex select-none items-center justify-center font-medium transition-[background-color,transform,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mint)] active:translate-y-px disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
