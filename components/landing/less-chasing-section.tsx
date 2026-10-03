"use client";

import React from "react";
import {
  Mail,
  FileSpreadsheet,
  MessageSquare,
  Truck,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  Sparkles,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export function LessChasingSection() {
  const beforeCards = [
    {
      title: "EMAILS",
      detail: "Scattered chains, lost attachments",
      icon: Mail,
    },
    {
      title: "SPREADSHEETS",
      detail: "Manual inputs, formula errors",
      icon: FileSpreadsheet,
    },
    {
      title: "SUPPLIER MESSAGES",
      detail: "Fragmented chats across timezones",
      icon: MessageSquare,
    },
    {
      title: "FREIGHT UPDATES",
      detail: "Untracked AWBs, mystery delays",
      icon: Truck,
    },
  ];

  const afterPillars = [
    {
      badge: "01",
      title: "One Request",
      detail: "Single Intake for Vehicle & Part Specifications",
      icon: Zap,
    },
    {
      badge: "02",
      title: "One Reference",
      detail: "Track AH-P-000123 From Japanese Warehouse to Hoist Bay",
      icon: TrendingUp,
    },
    {
      badge: "03",
      title: "One Workflow",
      detail: "Sourcing, Quoting, Freight, Payment & Tracking Unified",
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      id="workflow"
      className="relative bg-white py-20 lg:py-28 text-slate-900 border-b border-slate-200/80 overflow-hidden"
    >
      {/* Background decorative */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-red-50/30 via-transparent to-emerald-50/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Less Chasing,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] via-red-500 to-rose-600">
              More Visibility.
            </span>
          </h2>

          <div className="flex items-center justify-center gap-1.5 my-2">
            <div className="w-12 h-1 bg-gradient-to-r from-[#e20c0c] to-red-400 rounded-full" />
            <div className="w-3 h-1 bg-slate-300 rounded-full" />
            <div className="w-1.5 h-1 bg-slate-200 rounded-full" />
          </div>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Replace Scattered Emails, Spreadsheets, Supplier Messages, and Manual Follow-Ups With One
            Connected Procurement Workflow.
          </p>
        </div>

        {/* Visual Transformation: Before -> Center Connector -> After */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-4 items-center max-w-6xl mx-auto">
          {/* Left Column: BEFORE — SCATTERED & MANUAL */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#fff8f8] to-red-50/50 border border-red-200/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #e20c0c 0, #e20c0c 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} />
            
            {/* Top Bar */}
            <div className="relative flex items-center justify-between pb-2 border-b border-red-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e20c0c] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-red-700">
                  BEFORE — SCATTERED &amp; MANUAL
                </span>
              </div>
              <XCircle className="w-4 h-4 text-red-400" />
            </div>

            {/* 2x2 Grid */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {beforeCards.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-red-100/80 shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 transition-all duration-300 hover:-translate-y-0.5 group/card"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200/60 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                        <Icon className="w-4.5 h-4.5 text-red-500 stroke-[1.8]" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-full">
                        FRAGMENTED
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-black text-slate-800 uppercase tracking-tight line-through decoration-red-400/60 decoration-2">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Result Pill */}
            <div className="relative p-3.5 rounded-xl bg-red-100/70 border border-red-200/80 text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-700 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-red-800">
                RESULT: LOST TIME, DELAYED JOBS &amp; INACCURATE LANDING FEES
              </span>
            </div>
          </div>

          {/* Center Column: TRANSFORMED BY JDMHUB */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e20c0c] to-[#c40b0b] text-white flex items-center justify-center shadow-xl shadow-red-500/30 relative">
                <Zap className="w-7 h-7 fill-white stroke-[2.5]" />
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-2xl border-2 border-[#e20c0c]/30 animate-ping" style={{ animationDuration: '2s' }} />
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  TRANSFORMED BY
                </span>
                <span className="text-sm font-black italic tracking-tight text-slate-900 uppercase">
                  JDM<span className="text-[#e20c0c]">HUB</span>
                </span>
              </div>

              {/* Arrow */}
              <div className="mt-2 text-[#e20c0c]">
                <ArrowRight className="w-5 h-5 hidden lg:block animate-pulse" />
                <ArrowDown className="w-5 h-5 block lg:hidden animate-bounce" />
              </div>
            </div>
          </div>

          {/* Right Column: AFTER — THE CONNECTED JDMHUB WORKFLOW */}
          <div className="lg:col-span-5 bg-white border-2 border-emerald-400/60 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl shadow-emerald-500/5 relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-teal-50/20 pointer-events-none" />
            
            {/* Top Bar */}
            <div className="relative flex items-center justify-between pb-2 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                  AFTER — THE CONNECTED JDMHUB WORKFLOW
                </span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            {/* 3 Stacked Rows */}
            <div className="relative space-y-3">
              {afterPillars.map((pillar, idx) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 hover:border-emerald-300 transition-all duration-300 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md group/pillar"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-600 font-black text-sm flex items-center justify-center shrink-0 group-hover/pillar:scale-110 group-hover/pillar:shadow-md group-hover/pillar:shadow-emerald-500/10 transition-all">
                      <PillarIcon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">{pillar.badge}</span>
                        <h3 className="text-base font-bold tracking-tight text-slate-900">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {pillar.detail}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover/pillar:opacity-100 transition-opacity shrink-0" />
                  </div>
                );
              })}
            </div>

            {/* Bottom Connected Banner */}
            <div className="relative p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-center text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center justify-center gap-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>CONNECTED FROM SOURCING TO HOIST BAY DELIVERY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
