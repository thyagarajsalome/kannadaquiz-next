import React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Badge */}
      <svg
        viewBox="0 0 40 40"
        className="w-10 h-10 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="10" fill="#b22b1d" />
        <circle cx="20" cy="20" r="14" fill="#ffffff" opacity="0.15" />
        <text
          x="20"
          y="27"
          fontFamily="var(--font-noto-kannada), system-ui, sans-serif"
          fontWeight="bold"
          fontSize="22"
          fill="#ffffff"
          textAnchor="middle"
        >
          ಕ
        </text>
      </svg>
      {/* Brand Name Text */}
      <span className="font-serif text-2xl font-bold tracking-tight text-[var(--primary)] select-none">
        Kannada<span className="text-[var(--secondary)]">Quiz</span>
      </span>
    </div>
  );
}
