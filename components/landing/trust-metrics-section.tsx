"use client";

import React from "react";
import { ShieldCheck, Plane, Clock, CheckCircle2 } from "lucide-react";

export function TrustMetricsSection() {
  const metrics = [
    {
      icon: ShieldCheck,
      title: "Direct Network",
      subtitle: "Tokyo & Nagoya Suppliers",
      desc: "Direct electronic requisition to Japanese central OEM parts depots.",
      badge: "Genuine OEM",
      iconBg: "bg-red-50 text-[#e20c0c] border-red-100",
      hoverBorder: "hover:border-red-200",
    },
    {
      icon: Plane,
      title: "Express Air Cargo",
      subtitle: "Door-to-door Freight",
      desc: "4 scheduled weekly flights from Narita with expedited customs clearance.",
      badge: "3–5 Day Courier",
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      hoverBorder: "hover:border-blue-200",
    },
    {
      icon: Clock,
      title: "< 2hr Turnaround",
      subtitle: "Rapid B2B Landed Quotes",
      desc: "Transparent total landed cost in NZD before you approve with zero surprise fees.",
      badge: "Guaranteed Price",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      hoverBorder: "hover:border-emerald-200",
    },
  ];

  return (
    <section className="relative bg-slate-50 py-10 sm:py-12 border-b border-slate-200/80 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white hover:bg-white border border-slate-200/80 ${item.hoverBorder} shadow-sm hover:shadow-xs transition-all duration-300 flex items-start gap-4 group`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 group-hover:scale-105 transition-transform ${item.iconBg}`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 truncate">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200/80 shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {item.subtitle}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
