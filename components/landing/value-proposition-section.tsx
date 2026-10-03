"use client";

import React from "react";
import { Search, Sliders, Truck, ArrowRight, CheckCircle2, Shield } from "lucide-react";

export function ValuePropositionSection() {
  const cards = [
    {
      step: "Card 01 — Source",
      title: "We Find It",
      description:
        "Tell Us What Part You Need — JDMHub Coordinates Sourcing Through Its Verified Supplier Network.",
      imageUrl:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80",
      icon: Search,
      tag: "Supplier Network Japan & Global",
      accent: "from-red-500/20 via-transparent to-transparent",
      highlight: "OEM, Genuine & Certified Aftermarket",
    },
    {
      step: "Card 02 — Manage",
      title: "We Coordinate It",
      description:
        "Review Quotes, Freight Options, Approvals, and Payments in One Connected Place.",
      imageUrl:
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
      icon: Sliders,
      tag: "Unified Approvals & Billing",
      accent: "from-blue-500/20 via-transparent to-transparent",
      highlight: "Transparent Landed Costs (Part + Freight + GST)",
    },
    {
      step: "Card 03 — Track",
      title: "You Follow It",
      description:
        "Stay Updated in Real Time From Japan Procurement Through Air Shipment and Workshop Bay Delivery.",
      imageUrl:
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      icon: Truck,
      tag: "Live Air & Sea Tracking",
      accent: "from-emerald-500/20 via-transparent to-transparent",
      highlight: "Milestone Alerts & Dispatch Tracking",
    },
  ];

  return (
    <section id="platform" className="relative bg-white py-20 lg:py-28 border-b border-slate-200/80 text-slate-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold uppercase tracking-wider text-[#e20c0c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            Core Value Proposition
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            One Request.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] to-red-600">
              One Workflow.
            </span>
          </h2>

          <div className="w-12 h-1 bg-[#e20c0c] rounded-full mx-auto my-2" />

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            From Sourcing to Delivery, JDMHub Keeps Your Procurement Journey Connected.
          </p>
        </div>

        {/* 3 Simple Imagery-Led Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.step}
                className="group relative rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 hover:bg-white overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-1.5 shadow-sm hover:shadow-xl"
              >
                {/* Top Image Container */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Step Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-900 shadow-sm">
                      {card.step}
                    </span>
                  </div>

                  {/* Icon Indicator */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 flex items-center justify-center text-[#e20c0c] shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {/* Bottom micro highlight tag */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-[11px] font-bold text-white drop-shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{card.highlight}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-2 group-hover:text-[#e20c0c] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <span>{card.tag}</span>
                    <span className="text-[#e20c0c] group-hover:translate-x-1 transition-transform inline-flex items-center">
                      &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
