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
  const [selectedStage, setSelectedStage] = useState(3); // Default to "Awaiting Payment"

  const timelineStages = [
    {
      id: "submitted",
      name: "Submitted",
      status: "completed",
      icon: FileText,
      time: "08 Sep &bull; 09:15 AM",
      desc: "Request #AH-P-000123 logged with VIN & fitment specs by SP Motors.",
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
      desc: "Full door-to-door landed quotation generated: $525.00 NZD (Express Air freight included).",
      location: "JDMHub Desk",
    },
    {
      id: "awaiting-payment",
      name: "Awaiting Payment",
      status: "active",
      icon: CreditCard,
      time: "Current Active Action",
      desc: "Landed quotation approved. Awaiting trade account settlement or credit authorization to dispatch PO.",
      location: "Payment Gateway",
    },
    {
      id: "procured",
      name: "Procured",
      status: "upcoming",
      icon: Package,
      time: "Pending Payment",
      desc: "Supplier releases part to Nagoya consolidation warehouse for barcode & fitment inspection.",
      location: "Nagoya Logistics Hub",
    },
    {
      id: "shipped",
      name: "Shipped",
      status: "upcoming",
      icon: Plane,
      time: "Est. 1-2 Days Post-PO",
      desc: "Departs Narita Airport (NRT) to Auckland (AKL) via Air NZ Cargo scheduled flight.",
      location: "International Transit",
    },
    {
      id: "delivered",
      name: "Delivered",
      status: "upcoming",
      icon: Truck,
      time: "Est. 3-5 Days Total",
      desc: "Direct courier handover to Hoist Bay 2, Penrose workshop.",
      location: "Workshop Bay",
    },
  ];

  return (
    <section id="tracking" className="relative bg-slate-50 py-20 lg:py-28 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold uppercase tracking-wider text-[#e20c0c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            Live Request Tracking
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Know Where Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] to-red-600">
              Request Stands.
            </span>
          </h2>

          <div className="w-12 h-1 bg-[#e20c0c] rounded-full mx-auto my-2" />

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Track your procurement journey from sourcing to delivery.
          </p>
        </div>

        {/* Large Progress Timeline Container */}
        <div className="max-w-6xl mx-auto bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-10 space-y-8">
          {/* Top Live Tracker Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                <CreditCard className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-slate-900 font-mono">
                    AH-P-000123
                  </span>
                  {/* Visually Dominant Active Status Pill */}
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40">
                    ● Awaiting Payment
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Toyota Hiace 2019 &bull; Left Front Lower Control Arm (Nagoya Depot)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right text-xs hidden sm:block">
                <div className="text-slate-400 font-medium">Destination Workshop:</div>
                <div className="font-bold text-slate-900">Penrose, Auckland (Bay 2)</div>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-md shadow-red-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Track in Portal &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Stepper Grid: Subdued Completed Stages + Visually Dominant Active Status */}
          <div className="relative">
            {/* Connecting Track Line for Desktop */}
            <div
              className="hidden lg:block absolute top-7 left-8 right-8 h-[3px] bg-slate-200 z-0 pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="h-full bg-gradient-to-r from-slate-400 via-slate-400 to-amber-500 transition-all duration-300"
                style={{ width: `${(selectedStage / (timelineStages.length - 1)) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 relative z-10">
              {timelineStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isSelected = selectedStage === idx;
                const isDone = idx < 3; // 0, 1, 2 are completed
                const isActive = idx === 3; // Dominant Active Stage: Awaiting Payment

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setSelectedStage(idx)}
                    className={`flex flex-col items-center text-center p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/40 shadow-lg scale-105 z-20"
                        : isSelected
                        ? "bg-white border-[#e20c0c] ring-2 ring-[#e20c0c]/30 shadow-md"
                        : isDone
                        ? "bg-slate-50/60 border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300"
                        : "bg-slate-50/40 border-slate-200/80 opacity-60 hover:opacity-90"
                    }`}
                  >
                    {/* Circle Node Indicator */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center mb-2.5 transition-all ${
                        isActive
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-110"
                          : isSelected
                          ? "bg-[#e20c0c] text-white"
                          : isDone
                          ? "bg-slate-200/80 text-slate-600"
                          : "bg-white text-slate-400 border border-slate-200"
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    {/* Stage Name */}
                    <div
                      className={`text-xs font-black uppercase tracking-tight ${
                        isActive
                          ? "text-amber-800 font-extrabold"
                          : isSelected
                          ? "text-slate-900"
                          : isDone
                          ? "text-slate-600 font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      {stage.name}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 truncate max-w-full">
                      {isActive ? (
                        <span className="text-amber-700 font-bold">Action Needed</span>
                      ) : isDone ? (
                        <span className="text-slate-500 font-medium">Completed</span>
                      ) : (
                        `Step 0${idx + 1}`
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Detail Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    selectedStage === 3
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-red-50 text-[#e20c0c] border border-red-200"
                  }`}
                >
                  Stage 0{selectedStage + 1}: {timelineStages[selectedStage].name}
                </span>
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {timelineStages[selectedStage].location}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span
                  className="text-xs text-slate-600"
                  dangerouslySetInnerHTML={{ __html: timelineStages[selectedStage].time }}
                />
              </div>

              <h4 className="text-xl font-bold tracking-tight text-slate-900">
                {timelineStages[selectedStage].name}
              </h4>
              <p className="text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
                {timelineStages[selectedStage].desc}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              {selectedStage === 3 ? (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-md shadow-amber-500/25 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Authorize Payment &rarr;</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedStage(3)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Focus Active Stage</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
