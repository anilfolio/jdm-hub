"use client";

import React from "react";
import { Search, Sliders, Truck, ArrowRight } from "lucide-react";

export function TrustMetricsSection() {
  const promises = [
    {
      step: "01 — WE SOURCE",
      icon: Search,
      promise: "Tell us what you need.",
      detail: "We coordinate the supplier search.",
      color: "text-[#e20c0c]",
      bg: "bg-gradient-to-br from-red-50 to-rose-50/80",
      borderColor: "border-red-200/60",
      glowColor: "shadow-red-500/5",
    },
    {
      step: "02 — WE COORDINATE",
      icon: Sliders,
      promise: "Quotes, freight, procurement and payment.",
      detail: "All unified in one workflow.",
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50/80",
      borderColor: "border-blue-200/60",
      glowColor: "shadow-blue-500/5",
    },
    {
      step: "03 — YOU TRACK",
      icon: Truck,
      promise: "Follow your request.",
      detail: "From submission to bay delivery.",
      color: "text-emerald-600",
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50/80",
      borderColor: "border-emerald-200/60",
      glowColor: "shadow-emerald-500/5",
    },
  ];

  return (
    <section className="relative bg-white py-6 sm:py-8 border-b border-slate-200/70 text-slate-900 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 via-transparent to-blue-50/30 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {promises.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`relative px-5 py-4 sm:px-6 sm:py-5 rounded-2xl ${item.bg} hover:bg-white border ${item.borderColor} hover:border-slate-300 transition-all duration-300 flex items-center gap-4 group shadow-sm hover:shadow-lg ${item.glowColor} hover:-translate-y-0.5 cursor-default`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 group-hover:scale-110 transition-all duration-300 ${item.borderColor} ${item.color} bg-white/80 backdrop-blur-sm shadow-sm`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug mt-0.5">
                    {item.promise}{" "}
                    <span className="font-normal text-slate-600">{item.detail}</span>
                  </div>
                </div>

                {/* Micro arrow indicator */}
                <ArrowRight className={`w-4 h-4 ${item.color} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 shrink-0`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
