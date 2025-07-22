import React from "react";

export function FootballLoader({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className="animate-spin"
        style={{ animationDuration: "1s" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32" cy="32" r="30" fill="#fff" stroke="#222" strokeWidth="4" />
        <polygon points="32,14 40,24 32,34 24,24" fill="#222" />
        <polygon points="32,34 40,44 32,54 24,44" fill="#222" />
        <circle cx="32" cy="34" r="4" fill="#fff" stroke="#222" strokeWidth="2" />
      </svg>
    </div>
  );
} 