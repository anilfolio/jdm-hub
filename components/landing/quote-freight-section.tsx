"use client";

import React, { useState } from "react";
import {
  Receipt,
  CheckCircle2,
  Plane,
  Ship,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

interface QuoteFreightSectionProps {
  onRequestClick?: () => void;
}

export function QuoteFreightSection({ onRequestClick }: QuoteFreightSectionProps) {
  const [approved, setApproved] = useState(false);
  const [freightType, setFreightType] = useState<"air" | "sea">("air");

  const partCost = 376.96;
  const freightCost = freightType === "air" ? 85.0 : 45.0;
  const gstCost = freightType === "air" ? 69.29 : 63.29;
  const landedCost = (partCost + freightCost + gstCost).toFixed(2);

  const tinyBenefits = [
    {
      title: "Part Cost",
      desc: "Know what you're buying.",
      icon: Receipt,
      tag: "Factory OEM Sealed",
      color: "text-[#e20c0c]",
      bg: "bg-gradient-to-br from-red-50 to-rose-50",
      borderColor: "border-red-100",
    },
    {
      title: "Freight",
      desc: "Understand the delivery option.",
      icon: Plane,
      tag: "Express Air & Sea Cargo",
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-100",
    },
    {
      title: "Landed Cost",
      desc: "See the total before approval.",
      icon: ShieldCheck,
      tag: "Zero Hidden Customs Fees",
      color: "text-emerald-600",
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
      borderColor: "border-emerald-100",
    },
  ];

  return (
    <section id="quotes-freight" className="relative bg-slate-50/60 py-20 lg:py-28 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      {/* Background decorative */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-50/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Recommended Composition: Quote UI is the Hero (~60% Left), Explanatory text & 3 Tiny Benefits (~40% Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column (~60%): Large Quote UI (Hero of this section) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-8 space-y-6 hover:shadow-3xl transition-shadow duration-300 overflow-hidden group">
              {/* Subtle top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#e20c0c] via-red-400 to-transparent rounded-t-3xl" />

              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 text-[#e20c0c] flex items-center justify-center font-black shadow-sm">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Formal Landed Quotation
                    </div>
                    <div className="text-sm font-black text-slate-900 font-mono">
                      QUOTE-128 &bull; Toyota Hiace 2019
                    </div>
                  </div>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all duration-500 ${
                    approved
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/10"
                      : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-500/10"
                  }`}
                >
                  {approved ? "✓ Quote Approved" : "Quote Ready for Review"}
                </span>
              </div>

              {/* Item Description */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-4 border border-slate-200 space-y-1 shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 uppercase">
                    OEM Front Lower Suspension Arm (LH)
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">#48069-26150</span>
                </div>
                <div className="text-xs text-slate-600">
                  Genuine Toyota factory sealed packaging. Sourced directly from Nagoya Depot, Japan.
                </div>
              </div>

              {/* Freight Options Selector — Enhanced */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Select Freight Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFreightType("air")}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-300 cursor-pointer group/freight ${
                      freightType === "air"
                        ? "bg-gradient-to-br from-red-50/70 to-rose-50/50 border-[#e20c0c] ring-2 ring-[#e20c0c]/20 text-slate-900 shadow-md shadow-red-500/5"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${freightType === "air" ? "bg-[#e20c0c] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500"}`}>
                        <Plane className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Express Air Cargo</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          3-5 Business Days
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900 font-mono">$85.00</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFreightType("sea")}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-300 cursor-pointer group/freight ${
                      freightType === "sea"
                        ? "bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border-blue-500 ring-2 ring-blue-500/20 text-slate-900 shadow-md shadow-blue-500/5"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${freightType === "sea" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500"}`}>
                        <Ship className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Consolidated Sea</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          14-21 Business Days
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900 font-mono block">$45.00</span>
                      <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" /> Save $40
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Cost Table UI Example — Enhanced */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200 text-sm">
                <div className="flex justify-between items-center text-slate-600 text-xs py-1 hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors">
                  <span>Part Cost (Genuine OEM)</span>
                  <span className="font-mono font-bold text-slate-900">${partCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 text-xs py-1 hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors">
                  <span>Freight ({freightType === "air" ? "Express Air" : "Consolidated Sea"})</span>
                  <span className="font-mono font-bold text-slate-900">${freightCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 text-xs py-1 hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors">
                  <span>NZ GST (15%)</span>
                  <span className="font-mono font-bold text-slate-900">${gstCost.toFixed(2)}</span>
                </div>

                {/* Landed Cost Row — Enhanced */}
                <div className="pt-3 pb-1 border-t-2 border-slate-900/10 flex justify-between items-center">
                  <div>
                    <span className="text-base font-black uppercase text-slate-900 tracking-wide">
                      Total Landed Cost
                    </span>
                    <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Guaranteed door-to-door, all fees included
                    </div>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-mono">
                    ${landedCost} NZD
                  </span>
                </div>
              </div>

              {/* Action Button: [ Approve Quote ] — Enhanced */}
              <div className="pt-2 space-y-2">
                {!approved ? (
                  <button
                    type="button"
                    onClick={() => setApproved(true)}
                    className="relative w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#e20c0c] to-[#c40b0b] hover:from-[#c40b0b] hover:to-[#9B0A0F] text-white font-black text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-xl shadow-red-500/25 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer overflow-hidden group/btn"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    <CheckCircle2 className="relative w-5 h-5 stroke-[2.5]" />
                    <span className="relative">Approve Quote</span>
                  </button>
                ) : (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 text-emerald-800 font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[3]" />
                      <span>Quote Approved! Order Dispatched to Fulfillment Desk</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApproved(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline block mx-auto text-center cursor-pointer transition-colors"
                    >
                      Reset Demonstration State
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (~40%): Copy + Three Tiny Benefits + Review a Quote CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/80 text-xs font-bold uppercase tracking-wider text-[#e20c0c] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
                Transparent Pricing
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
                Know the Cost{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] via-red-500 to-rose-600">
                  Before You Approve.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                Review the part, freight and landed cost before committing.
              </p>
            </div>

            {/* Three Tiny Benefits — Enhanced */}
            <div className="space-y-3 pt-2">
              {tinyBenefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className={`p-4 sm:p-5 rounded-2xl ${b.bg} border ${b.borderColor} hover:border-slate-300 transition-all duration-300 flex items-start gap-3.5 shadow-sm hover:shadow-md group hover:-translate-y-0.5`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-white ${b.color} border ${b.borderColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 tracking-tight">
                        {b.title}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {b.desc}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                        {b.tag}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Review a Quote CTA — Enhanced */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onRequestClick}
                className="relative inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#e20c0c] to-[#c40b0b] hover:from-[#c40b0b] hover:to-[#9B0A0F] py-3.5 px-6 rounded-xl shadow-md shadow-red-500/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer overflow-hidden group/cta"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700" />
                <span className="relative">Review a Quote</span>
                <ArrowRight className="relative w-4 h-4 stroke-[2.5] group-hover/cta:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
