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
} from "lucide-react";

export function QuoteFreightSection() {
  const [approved, setApproved] = useState(false);
  const [freightType, setFreightType] = useState<"air" | "sea">("air");

  const partCost = 376.96;
  const freightCost = freightType === "air" ? 85.0 : 45.0;
  const gstCost = freightType === "air" ? 63.04 : 57.04;
  const landedCost = (partCost + freightCost + gstCost).toFixed(2);

  return (
    <section id="quotes-freight" className="relative bg-white py-20 lg:py-28 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold uppercase tracking-wider text-[#e20c0c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            Clear Quotes &amp; Freight
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Know the Cost{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] to-red-600">
              Before You Approve.
            </span>
          </h2>

          <div className="w-12 h-1 bg-[#e20c0c] rounded-full mx-auto my-2" />

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Review the Part, Freight Options, and Total Landed Cost Before Moving Forward.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          {/* Left Column: UI Quotation Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-white border-2 border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-[#e20c0c] flex items-center justify-center font-black shadow-xs">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500">Formal Landed Quotation</div>
                    <div className="text-sm font-black text-slate-900 font-mono">QUOTE-128 &bull; Toyota Hiace 2019</div>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    approved
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {approved ? "Quote Approved" : "Quote Ready for Review"}
                </span>
              </div>

              {/* Item Description */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 uppercase">OEM Front Lower Suspension Arm (LH)</span>
                  <span className="text-slate-500 font-mono">48069-26150</span>
                </div>
                <div className="text-xs text-slate-600">
                  Genuine Toyota factory sealed packaging. Sourced from Nagoya Depot, Japan.
                </div>
              </div>

              {/* Freight Options Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Select Freight Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFreightType("air")}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      freightType === "air"
                        ? "bg-red-50/60 border-[#e20c0c] text-slate-900 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Plane className="w-4 h-4 text-[#e20c0c]" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Express Air Cargo</div>
                        <div className="text-[10px] text-slate-500">3-5 Business Days</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">$85.00</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFreightType("sea")}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      freightType === "sea"
                        ? "bg-blue-50 border-blue-500 text-slate-900 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Ship className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Consolidated Sea</div>
                        <div className="text-[10px] text-slate-500">14-21 Business Days</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">$45.00</span>
                  </button>
                </div>
              </div>

              {/* Cost Table UI Example */}
              <div className="space-y-2 pt-2 border-t border-slate-200 text-sm">
                <div className="flex justify-between items-center text-slate-600 text-xs">
                  <span>Part Cost (Genuine OEM)</span>
                  <span className="font-mono font-bold text-slate-900">${partCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 text-xs">
                  <span>Freight ({freightType === "air" ? "Express Air" : "Consolidated Sea"})</span>
                  <span className="font-mono font-bold text-slate-900">${freightCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 text-xs">
                  <span>NZ GST (15%)</span>
                  <span className="font-mono font-bold text-slate-900">${gstCost.toFixed(2)}</span>
                </div>

                {/* Landed Cost Row */}
                <div className="pt-3 pb-1 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-base font-black uppercase text-slate-900 tracking-wide">
                      Total Landed Cost
                    </span>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      Guaranteed door-to-door, all fees included
                    </div>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                    ${landedCost} NZD
                  </span>
                </div>
              </div>

              {/* Action Button: [ Approve Quote ] */}
              <div className="pt-2 space-y-2">
                {!approved ? (
                  <button
                    type="button"
                    onClick={() => setApproved(true)}
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white font-black text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-xl shadow-red-500/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    <span>Approve Quote</span>
                  </button>
                ) : (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-full py-4 px-6 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-bold text-sm text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[3]" />
                      <span>Quote Approved! Order Dispatched to Fulfillment Desk</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApproved(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline block mx-auto text-center cursor-pointer"
                    >
                      Reset Demonstration State
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Key Commercial Benefits */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 shadow-xs">
                <div className="p-2 rounded-xl bg-red-50 text-[#e20c0c] shrink-0 border border-red-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Guaranteed Landed Price</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    No surprise customs clearance, storage or broker invoices. The quote you approve is the exact final amount you pay.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 shadow-xs">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">48-Hour Price Lock</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Quotes stay locked for 48 hours to give your service advisors ample time to obtain workshop customer authorization.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 shadow-xs">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Single Tax Invoice</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Consolidated GST invoice delivered directly into your portal. Ready for immediate accounting sync or credit terms settlement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
