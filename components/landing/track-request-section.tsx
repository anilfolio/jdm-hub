"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Receipt,
  CheckCircle2,
  CreditCard,
  Package,
  Plane,
  Truck,
  ArrowRight,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";

export function TrackRequestSection() {
  const [selectedStage, setSelectedStage] = useState(6); // Default on "Shipped"

  const timelineStages = [
    {
      id: "submitted",
      name: "Submitted",
      status: "completed",
      icon: FileText,
      time: "08 Sep &bull; 09:15 AM",
      desc: "Request AH-P-000123 logged with VIN & fitment images by SP Motors.",
      location: "Customer Portal",
    },
    {
      id: "sourcing",
      name: "Sourcing",
      status: "completed",
      icon: Search,
      time: "08 Sep &bull; 10:45 AM",
      desc: "Japan procurement desk located brand new OEM control arm at Toyota Nagoya depot.",
      location: "Nagoya, Japan",
    },
    {
      id: "quote-ready",
      name: "Quote Ready",
      status: "completed",
      icon: Receipt,
      time: "08 Sep &bull; 11:30 AM",
      desc: "Full door-to-door landed quotation generated: $485.00 NZD (Air freight included).",
      location: "JDMHub Desk",
    },
    {
      id: "approved",
      name: "Approved",
      status: "completed",
      icon: CheckCircle2,
      time: "08 Sep &bull; 01:20 PM",
      desc: "Workshop service advisor confirmed quote. Terms of trade accepted.",
      location: "Customer Portal",
    },
    {
      id: "paid",
      name: "Paid",
      status: "completed",
      icon: CreditCard,
      time: "08 Sep &bull; 02:00 PM",
      desc: "Payment confirmed. Factory Purchase Order released to supplier.",
      location: "Automated Gateway",
    },
    {
      id: "procured",
      name: "Procured",
      status: "completed",
      icon: Package,
      time: "09 Sep &bull; 04:30 PM",
      desc: "Part received at Nagoya consolidation warehouse. Fitment & barcode verified.",
      location: "Nagoya Logistics Hub",
    },
    {
      id: "shipped",
      name: "Shipped",
      status: "active",
      icon: Plane,
      time: "11 Sep &bull; 08:00 AM",
      desc: "Departed Narita Airport (NRT) to Auckland (AKL) via Air NZ Cargo NZ90.",
      location: "In International Transit",
    },
    {
      id: "delivered",
      name: "Delivered",
      status: "upcoming",
      icon: Truck,
      time: "13 Sep &bull; Est. 10:30 AM",
      desc: "Scheduled for direct courier handover to Hoist Bay 2, SP Motors Penrose.",
      location: "Auckland, New Zealand",
    },
  ];

  return (
    <section id="tracking" className="relative bg-slate-50 py-20 lg:py-28 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold uppercase tracking-wider text-[#e20c0c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            Live Shipment Tracking
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Know What&apos;s Happening,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] to-red-600">
              Every Step of the Way.
            </span>
          </h2>

          <div className="w-12 h-1 bg-[#e20c0c] rounded-full mx-auto my-2" />

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Track Your Request Through Every Milestone — From Japan Depots to Hoist Bay Delivery.
          </p>
        </div>

        {/* Large Progress Timeline Container */}
        <div className="max-w-6xl mx-auto bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-10 space-y-10">
          {/* Top Live Tracker Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#e20c0c] text-white flex items-center justify-center font-black shadow-md">
                <Plane className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-slate-900 font-mono">
                    AH-P-000123
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    In Flight &bull; Air Cargo NZ90
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Toyota Hiace 2019 &bull; Left Front Lower Control Arm
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs hidden sm:block">
                <div className="text-slate-500">Destination:</div>
                <div className="font-bold text-slate-900">Auckland, NZ (Penrose)</div>
              </div>
              <Link
                href="/customer/shipments"
                className="inline-flex items-center gap-2 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-md shadow-red-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Track Your Request &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Horizontal / Grid Timeline with 8 Stages */}
          <div className="relative">
            {/* Connecting Track Line for Desktop */}
            <div
              className="hidden xl:block absolute top-7 left-8 right-8 h-[3px] bg-slate-200 z-0 pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-500 to-[#e20c0c] transition-all duration-300"
                style={{ width: `${(selectedStage / (timelineStages.length - 1)) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4 relative z-10">
              {timelineStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isSelected = selectedStage === idx;
                const isDone = idx < selectedStage;
                const isCurrent = idx === selectedStage;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setSelectedStage(idx)}
                    className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all cursor-pointer ${isSelected
                        ? "bg-white border-[#e20c0c] ring-2 ring-[#e20c0c]/30 scale-105 shadow-lg"
                        : isDone
                          ? "bg-slate-50 border-emerald-200 hover:border-emerald-300"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                      }`}
                  >
                    {/* Circle Node Indicator */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2.5 transition-all ${isCurrent
                          ? "bg-[#e20c0c] text-white shadow-md shadow-red-500/30"
                          : isDone
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-white text-slate-400 border border-slate-200"
                        }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    {/* Stage Name */}
                    <div
                      className={`text-xs font-black uppercase tracking-tight ${isSelected
                          ? "text-slate-900"
                          : isDone
                            ? "text-slate-800"
                            : "text-slate-500"
                        }`}
                    >
                      {stage.name}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 truncate max-w-full">
                      Step {idx + 1} of 8
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Detail Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#e20c0c] border border-red-200">
                  Stage {selectedStage + 1} Detail
                </span>
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#e20c0c]" />
                  {timelineStages[selectedStage].location}
                </span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-xs text-slate-600" dangerouslySetInnerHTML={{ __html: timelineStages[selectedStage].time }} />
              </div>

              <h4 className="text-xl font-bold tracking-tight text-slate-900">
                {timelineStages[selectedStage].name}
              </h4>
              <p className="text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
                {timelineStages[selectedStage].desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
