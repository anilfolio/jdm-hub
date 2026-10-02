"use client";

import React from "react";

interface PoweredByJdmhubProps {
  variant?: "dark" | "light" | "minimal";
  className?: string;
  brandName?: string;
}

/**
 * High-performance, razor-sharp vector signature for "Powered by JDMHUB".
 * Eliminates raster PNG image dependencies and renders crisp typography with aerodynamic speed accents.
 */
export function PoweredByJdmhub({
  variant = "dark",
  className = "",
  brandName = "JDMHUB",
}: PoweredByJdmhubProps) {
  const prefix = brandName.length > 3 ? brandName.slice(0, 3) : brandName;
  const suffix = brandName.length > 3 ? brandName.slice(3) : "";

  // Minimal inline signature (used for compact copyright lines and footers)
  if (variant === "minimal") {
    return (
      <div
        className={`inline-flex items-center select-none ${className}`}
        aria-label={`Powered by ${brandName}`}
      >
        <span className="text-[10px] font-black italic tracking-wider text-slate-500 uppercase mr-1.5">
          POWERED BY
        </span>
        <span className="inline-flex items-baseline">
          <span className="font-black italic tracking-tight text-[#e20c0c] text-[12px] leading-none uppercase">
            {prefix}
            <span className="not-italic font-black text-[#e20c0c]">{suffix}</span>
          </span>
          <span className="text-[7px] font-bold text-[#e20c0c] ml-0.5 leading-none">
            ™
          </span>
        </span>
      </div>
    );
  }

  // Light variant (used on light authentication panels and mobile footers)
  if (variant === "light") {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all duration-200 select-none group ${className}`}
        aria-label={`Powered by ${brandName} - Automotive Procurement Platform`}
      >
        <span className="text-[11px] font-black italic tracking-wider text-slate-600 uppercase whitespace-nowrap">
          POWERED BY
        </span>
        <div className="relative inline-flex flex-col justify-center">
          {/* Top aerodynamic bar accent */}
          <div className="w-8 h-[2px] bg-[#e20c0c] rounded-full mb-[1.5px]" />

          <div className="inline-flex items-start leading-none">
            <span className="font-black italic tracking-tight text-[#e20c0c] text-sm leading-none uppercase">
              {prefix}
              <span className="not-italic font-black text-[#e20c0c]">{suffix}</span>
            </span>
            <span className="text-[7px] font-black text-[#e20c0c] ml-0.5 leading-none">
              ™
            </span>
          </div>

          {/* Bottom aerodynamic speed arrow underline */}
          <div className="flex items-center mt-[1.5px] w-full">
            <div className="h-[2px] flex-1 bg-[#e20c0c] rounded-l-full" />
            <div className="w-0 h-0 border-y-[2.5px] border-y-transparent border-l-[5px] border-l-[#e20c0c]" />
          </div>
        </div>
      </div>
    );
  }

  // Dark variant (used on rich red / dark brand panel surfaces)
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white hover:bg-white shadow-sm hover:shadow transition-all duration-200 select-none group ${className}`}
      aria-label={`Powered by ${brandName} - Automotive Procurement Platform`}
    >
      <span className="text-[12px] sm:text-[13px] font-black italic tracking-wider text-slate-700 uppercase whitespace-nowrap">
        POWERED BY
      </span>

      <div className="relative inline-flex flex-col justify-center">
        {/* Top aerodynamic bar accent */}
        <div className="w-9 sm:w-10 h-[2.5px] bg-[#e20c0c] rounded-full mb-[2px]" />

        <div className="inline-flex items-start leading-none">
          <span className="font-black italic tracking-tight text-[#e20c0c] text-base sm:text-[17px] leading-none uppercase">
            {prefix}
            <span className="not-italic font-black text-[#e20c0c]">{suffix}</span>
          </span>
          <span className="text-[8px] font-black text-[#e20c0c] ml-0.5 leading-none">
            ™
          </span>
        </div>

        {/* Bottom aerodynamic speed arrow underline */}
        <div className="flex items-center mt-[2px] w-full">
          <div className="h-[2.5px] flex-1 bg-[#e20c0c] rounded-l-full" />
          <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[6px] border-l-[#e20c0c]" />
        </div>
      </div>
    </div>
  );
}

// Backwards compatibility alias
export const PoweredByAutohub = PoweredByJdmhub;
export default PoweredByJdmhub;
