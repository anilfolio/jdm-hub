"use client";

import React from "react";
import Link from "next/link";
import {
  Wrench,
  Layers,
  Handshake,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface BuiltForTradeSectionProps {
  onRequestClick?: () => void;
}

export function BuiltForTradeSection({ onRequestClick }: BuiltForTradeSectionProps) {
  const benefits = [
    {
      title: "Request Parts Easily",
      desc: "Tell us what you need instead of searching through a parts catalogue.",
      icon: Wrench,
      highlight: "Simply provide your vehicle VIN or rego and part description.",
      color: "from-red-500 to-rose-500",
      iconBg: "bg-gradient-to-br from-red-50 to-rose-50",
      iconBorder: "border-red-200",
      iconColor: "text-[#e20c0c]",
    },
    {
      title: "Stay Informed",
      desc: "Keep requests, quotes, payments and shipments connected.",
      icon: Layers,
      highlight: "Unified dashboard and single tracking ledger for every workshop bay.",
      color: "from-blue-500 to-indigo-500",
      iconBg: "bg-gradient-to-br from-blue-50 to-indigo-50",
      iconBorder: "border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      title: "Work With One Partner",
      desc: "JDMHub coordinates the procurement journey through its supplier and logistics network.",
      icon: Handshake,
      highlight: "Direct Japan depots, international air cargo, and NZ customs handled.",
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-gradient-to-br from-emerald-50 to-teal-50",
      iconBorder: "border-emerald-200",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <section id="for-businesses" className="relative bg-white py-20 lg:py-28 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      {/* Background decorative */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-red-50/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-50/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/80 text-xs font-bold uppercase tracking-wider text-[#e20c0c] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            BUILT FOR AUTOMOTIVE TRADE
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Procurement That Fits{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] via-red-500 to-rose-600">
              Your Business.
            </span>
          </h2>

          <div className="flex items-center justify-center gap-1.5 my-2">
            <div className="w-12 h-1 bg-gradient-to-r from-[#e20c0c] to-red-400 rounded-full" />
            <div className="w-3 h-1 bg-slate-300 rounded-full" />
            <div className="w-1.5 h-1 bg-slate-200 rounded-full" />
          </div>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Built for automotive businesses that need parts sourced, coordinated and delivered without the usual back-and-forth.
          </p>
        </div>

        {/* 2-Column Layout: HD Image left, Benefits right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Taller HD Automotive Workshop Image */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-900 shadow-xl group flex-1 min-h-[420px] sm:min-h-[500px] lg:min-h-full flex hover:shadow-2xl transition-shadow duration-300">
              <img
                src="/images/built-for-trade-hd.jpg"
                alt="High-definition automotive workshop & trade procurement"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating badge on image */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e20c0c] to-[#c40b0b] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-red-500/20">
                  JD
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-tight">Trusted by NZ Trade Workshops</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">Direct Japan-to-NZ procurement coordination</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              </div>
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
                    className="p-6 sm:p-7 rounded-3xl bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 hover:bg-white transition-all duration-300 transform hover:-translate-y-1.5 shadow-xs hover:shadow-xl space-y-2 group relative overflow-hidden"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Left accent on hover */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${benefit.color} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-l-3xl`} />
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${benefit.iconBg} border ${benefit.iconBorder} ${benefit.iconColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Trade Advantage 0{idx + 1}
                        </span>
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#e20c0c] transition-colors duration-300">
                          {benefit.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-base text-slate-800 font-semibold pl-1 leading-relaxed">
                      {benefit.desc}
                    </p>

                    <p className="text-xs text-slate-500 pl-1 leading-relaxed">
                      {benefit.highlight}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Primary CTA button — Enhanced */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onRequestClick}
                className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#e20c0c] to-[#c40b0b] hover:from-[#c40b0b] hover:to-[#9B0A0F] text-white font-bold text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer overflow-hidden group/btn"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <span className="relative">Request a Part</span>
                <ArrowRight className="relative w-4 h-4 stroke-[2.5] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
