"use client";

import React from "react";
import { Search, Sliders, Truck, ArrowRight, CheckCircle2, Shield } from "lucide-react";

export function ValuePropositionSection() {
  const cards = [
    {
      step: "01 — Find",
      title: "We Find It",
      description:
        "Tell us the part you need. We coordinate sourcing through our supplier network.",
      imageUrl: "/images/journey-part-sourcing.jpg",
      icon: Search,
      tag: "Stage 1: Part Sourcing",
      accent: "from-red-500/20 via-transparent to-transparent",
      highlight: "OEM, Genuine & Dismantler Depots",
      gradientBorder: "from-[#e20c0c]/20 to-transparent",
    },
    {
      step: "02 — Coordinate",
      title: "We Coordinate It",
      description:
        "We manage quotes, freight and procurement through one connected workflow.",
      imageUrl: "/images/journey-procurement.jpg",
      icon: Sliders,
      tag: "Stage 2: Procurement & Freight",
      accent: "from-blue-500/20 via-transparent to-transparent",
      highlight: "Landed Quotes, Customs & Air Cargo",
      gradientBorder: "from-blue-500/20 to-transparent",
    },
    {
      step: "03 — Follow",
      title: "You Follow It",
      description:
        "Track your request from approval through shipment and delivery.",
      imageUrl: "/images/journey-bay-delivery.jpg",
      icon: Truck,
      tag: "Stage 3: Bay Delivery",
      accent: "from-emerald-500/20 via-transparent to-transparent",
      highlight: "Milestone Alerts & Workshop Bay Handover",
      gradientBorder: "from-emerald-500/20 to-transparent",
    },
  ];

  return (
    <section id="platform" className="relative bg-white py-20 lg:py-28 border-b border-slate-200/80 text-slate-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-50/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/80 text-xs font-bold uppercase tracking-wider text-[#e20c0c] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            The JDMHub Journey
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            One Request.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] via-red-500 to-rose-600">
              One Workflow.
            </span>
          </h2>

          <div className="flex items-center justify-center gap-1.5 my-3">
            <div className="w-12 h-1 bg-gradient-to-r from-[#e20c0c] to-red-400 rounded-full" />
            <div className="w-3 h-1 bg-slate-300 rounded-full" />
            <div className="w-1.5 h-1 bg-slate-200 rounded-full" />
          </div>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            From Sourcing to Delivery, JDMHub Keeps Your Procurement Journey Connected.
          </p>
        </div>

        {/* 3 Simple Imagery-Led Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.step}
                className="group relative rounded-3xl bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 hover:bg-white overflow-hidden flex flex-col transition-all duration-500 transform hover:-translate-y-2 shadow-sm hover:shadow-2xl"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Top Image Container */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                  {/* Gradient Overlays - Enhanced */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Step Pill - Glassmorphism */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/50 text-[11px] font-black uppercase tracking-wider text-slate-900 shadow-lg">
                      {card.step}
                    </span>
                  </div>

                  {/* Icon Indicator - Enhanced */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-white/50 flex items-center justify-center text-[#e20c0c] shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {/* Bottom micro highlight tag */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-[11px] font-bold text-white drop-shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{card.highlight}</span>
                  </div>
                </div>

                {/* Card Content - Enhanced */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-2 group-hover:text-[#e20c0c] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <span>{card.tag}</span>
                    <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#e20c0c] flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:shadow-red-500/20">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </span>
                  </div>
                </div>

                {/* Bottom accent line on hover */}
                <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${card.gradientBorder} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
