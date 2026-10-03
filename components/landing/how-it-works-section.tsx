"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Receipt,
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react";

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(2); // Default to QUOTE stage to demonstrate product capability

  const stages = [
    {
      id: "request",
      name: "REQUEST",
      summary: "Tell us what you need",
      icon: FileText,
      detail:
        "Submit vehicle registration or VIN and specify the required component. Attach workshop photos or part diagrams directly.",
      badge: "Customer Intake",
      statusText: "Request Logged",
      color: "from-red-500 to-rose-500",
    },
    {
      id: "source",
      name: "SOURCE",
      summary: "We find the part",
      icon: Search,
      detail:
        "JDMHub queries Tokyo and Nagoya supplier depots, verified OEM warehouses, and Japanese domestic parts networks.",
      badge: "Supplier Search",
      statusText: "Depots Queried",
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "quote",
      name: "QUOTE",
      summary: "Review price + freight",
      icon: Receipt,
      detail:
        "Receive a transparent quote with part cost, express air or sea freight, and guaranteed landed total in NZD before committing.",
      badge: "Cost Transparency",
      statusText: "Quote Ready",
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "approve",
      name: "APPROVE",
      summary: "Confirm your purchase",
      icon: CheckCircle2,
      detail:
        "Authorize the order with one click. Settle via trade account or instant payment with zero hidden currency fees.",
      badge: "1-Click Authorization",
      statusText: "Purchase Confirmed",
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "procure",
      name: "PROCURE",
      summary: "We coordinate the order",
      icon: Package,
      detail:
        "JDMHub verifies part serials, arranges packaging in Japan, clears export customs, and schedules express air freight.",
      badge: "Logistics Coordination",
      statusText: "Order Dispatched",
      color: "from-violet-500 to-purple-500",
    },
    {
      id: "deliver",
      name: "DELIVER",
      summary: "Track it to your door",
      icon: Truck,
      detail:
        "Monitor international transit and local courier handover directly to your workshop hoist bay.",
      badge: "Final Handover",
      statusText: "Bay Delivery",
      color: "from-[#e20c0c] to-red-600",
    },
  ];

  return (
    <section id="how-it-works" className="relative bg-slate-50 py-20 lg:py-28 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      {/* Background decorative */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/30 rounded-full blur-[120px]" />
        {/* Dotted pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #0f172a 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/80 text-xs font-bold uppercase tracking-wider text-[#e20c0c] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            Request Lifecycle
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            From Request{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] via-red-500 to-rose-600">
              to Delivery.
            </span>
          </h2>

          <div className="flex items-center justify-center gap-1.5 my-2">
            <div className="w-12 h-1 bg-gradient-to-r from-[#e20c0c] to-red-400 rounded-full" />
            <div className="w-3 h-1 bg-slate-300 rounded-full" />
            <div className="w-1.5 h-1 bg-slate-200 rounded-full" />
          </div>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            One simple workflow. Managed by JDMHub from start to finish.
          </p>
        </div>

        {/* Single Horizontal Journey Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-4 sm:p-6 lg:p-8 space-y-8 backdrop-blur-sm">
          {/* Horizontal Stepper Strip */}
          <div className="relative">
            {/* Connecting Track Line behind steps on desktop */}
            <div
              className="hidden lg:block absolute top-7 left-10 right-10 h-[3px] bg-slate-200 z-0 pointer-events-none rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="h-full bg-gradient-to-r from-[#e20c0c] via-red-500 to-[#e20c0c] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${(activeStep / (stages.length - 1)) * 100}%` }}
              />
            </div>

            {/* 6 Sequential Step Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isActive = activeStep === idx;
                const isPassed = idx < activeStep;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-between cursor-pointer group relative overflow-hidden ${
                      isActive
                        ? "bg-white border-[#e20c0c] ring-2 ring-[#e20c0c]/25 shadow-xl shadow-red-500/5 -translate-y-1.5"
                        : isPassed
                        ? "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5"
                        : "bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Active card top accent */}
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#e20c0c] to-red-400 rounded-t-2xl" />
                    )}

                    {/* Step Icon Badge */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-br ${stage.color} text-white shadow-lg scale-105`
                          : isPassed
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-white text-slate-500 border border-slate-200 group-hover:text-slate-800 group-hover:border-slate-300"
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      )}
                    </div>

                    {/* Step Name */}
                    <div className="space-y-1">
                      <div
                        className={`text-xs font-black uppercase tracking-wider transition-colors ${
                          isActive
                            ? "text-[#e20c0c]"
                            : isPassed
                            ? "text-slate-900"
                            : "text-slate-600"
                        }`}
                      >
                        {stage.name}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 leading-snug line-clamp-1">
                        {stage.summary}
                      </div>
                    </div>

                    {/* Micro Status Marker */}
                    <div className="mt-3">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full transition-all ${
                          isActive
                            ? "bg-red-100 text-[#e20c0c] shadow-sm"
                            : isPassed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isActive ? "Active Stage" : isPassed ? "✓ Complete" : `Stage 0${idx + 1}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Interactive Deep-Dive View — Enhanced */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-50/80 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 relative overflow-hidden">
            {/* Subtle background accent */}
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${stages[activeStep].color} rounded-l-2xl`} />
            
            <div className="space-y-3 text-center md:text-left pl-0 md:pl-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${stages[activeStep].color} text-white text-[11px] font-black uppercase tracking-wider shadow-md`}>
                  Stage 0{activeStep + 1} &bull; {stages[activeStep].name}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
                  {stages[activeStep].badge}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Reference: #AH-P-000123
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {stages[activeStep].summary}
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
                  {stages[activeStep].detail}
                </p>
              </div>
            </div>

            {/* Stepper Navigation Buttons — Enhanced */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setActiveStep((prev) => (prev > 0 ? prev - 1 : stages.length - 1))
                }
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-700 transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveStep((prev) => (prev < stages.length - 1 ? prev + 1 : 0))
                }
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e20c0c] to-[#c40b0b] hover:from-[#c40b0b] hover:to-[#9B0A0F] text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md shadow-red-500/20 hover:shadow-lg flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
