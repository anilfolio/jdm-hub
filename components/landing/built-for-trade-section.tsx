"use client";

import React from "react";
import Link from "next/link";
import {
  Wrench,
  Layers,
  Handshake,
  ArrowRight,
} from "lucide-react";

export function BuiltForTradeSection() {
  const benefits = [
    {
      title: "Request Parts Easily",
      desc: "Tell Us What You Need Without Browsing a Catalogue.",
      icon: Wrench,
      highlight: "No OEM Part Number Lookups Needed — Simply Provide VIN or Rego.",
    },
    {
      title: "Stay Informed",
      desc: "Keep Requests, Quotes, Payments, and Shipments Together.",
      icon: Layers,
      highlight: "Single Central Ledger and Timeline for Every Vehicle in Your Bay.",
    },
    {
      title: "Work With One Partner",
      desc: "JDMHub Coordinates Sourcing and Logistics Through Its Network.",
      icon: Handshake,
      highlight: "Direct Japan Depots, Freight Forwarding, and Customs Handled.",
    },
  ];

  return (
    <section id="built-for-trade" className="relative bg-white py-20 lg:py-28 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold uppercase tracking-wider text-[#e20c0c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            Built for Trade
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Procurement Built{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] to-red-600">
              Around Your Business.
            </span>
          </h2>

          <div className="w-12 h-1 bg-[#e20c0c] rounded-full mx-auto my-2" />

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Engineered specifically for workshops, dealerships, and importers.
          </p>
        </div>

        {/* 2-Column Layout: HD Image left, Benefits right — Perfectly aligned heights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Taller HD Automotive Workshop Image aligned with right */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-900 shadow-xl group flex-1 min-h-[420px] sm:min-h-[500px] lg:min-h-full flex">
              <img
                src="/images/built-for-trade-hd.jpg"
                alt="High-definition automotive workshop & trade procurement"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Column: 3 Structured Benefits + Primary CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4 sm:space-y-5">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-xs hover:shadow-md space-y-2 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#e20c0c] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#e20c0c] group-hover:text-white transition-all shadow-xs">
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Benefit 0{idx + 1}
                        </span>
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#e20c0c] transition-colors">
                          {benefit.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-base text-slate-800 font-medium pl-1 leading-relaxed">
                      {benefit.desc}
                    </p>

                    <p className="text-xs text-slate-500 pl-1 leading-relaxed">
                      {benefit.highlight}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Primary CTA button linking to /register */}
            <div className="pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white font-bold text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Request a Part</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
