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
} from "lucide-react";

export function LessChasingSection() {
  const beforeItems = [
    {
      title: "Emails",
      detail: "Scattered chains, lost attachments",
      icon: Mail,
    },
    {
      title: "Spreadsheets",
      detail: "Manual inputs, formula errors",
      icon: FileSpreadsheet,
    },
    {
      title: "Supplier Messages",
      detail: "Fragmented chats across timezones",
      icon: MessageSquare,
    },
    {
      title: "Freight Updates",
      detail: "Untracked AWBs, mystery delays",
      icon: Truck,
    },
  ];

  const afterPillars = [
    {
      badge: "01",
      title: "One Request",
      detail: "Single Intake for Vehicle & Part Specifications",
    },
    {
      badge: "02",
      title: "One Reference",
      detail: "Track AH-P-000123 From Japanese Warehouse to Hoist Bay",
    },
    {
      badge: "03",
      title: "One Workflow",
      detail: "Sourcing, Quoting, Freight, Payment & Tracking Unified",
    },
  ];

  return (
    <section id="workflow" className="relative bg-slate-50 py-20 lg:py-28 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold uppercase tracking-wider text-[#e20c0c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            Workflow Transformation
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Less Chasing,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] to-red-600">
              More Visibility.
            </span>
          </h2>

          <div className="w-12 h-1 bg-[#e20c0c] rounded-full mx-auto my-2" />

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Replace Scattered Emails, Spreadsheets, Supplier Messages, and Manual Follow-Ups With One Connected Procurement Workflow.
          </p>
        </div>

        {/* Visual Transformation Before -> After Grid (Highly visual, zero paragraphs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Before Column (Red/Muted Warning Tone) */}
          <div className="lg:col-span-5 bg-red-50/50 border border-red-200/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                  Before — Scattered &amp; Manual
                </span>
              </div>
              <XCircle className="w-4 h-4 text-red-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {beforeItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-white border border-red-100/80 shadow-xs flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="w-5 h-5 text-red-500" />
                      <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                        Fragmented
                      </span>
                    </div>
                    <div>
                      <div className="text-base font-black text-slate-800 uppercase line-through decoration-red-400">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-red-100/60 border border-red-200 text-center text-xs font-bold text-red-800 uppercase tracking-wide">
              Result: Lost Time, Delayed Jobs &amp; Inaccurate Landing Fees
            </div>
          </div>

          {/* Central Animated Transformation Connector */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#e20c0c] text-white flex items-center justify-center shadow-xl shadow-red-500/30 transform hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div className="mt-3 text-center">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  TRANSFORMED BY
                </span>
                <div className="text-sm font-black italic tracking-tight text-slate-900 uppercase">
                  JDM<span className="not-italic text-slate-800">HUB</span>
                </div>
              </div>

              {/* Down Arrow for Mobile / Right Arrow for Desktop */}
              <div className="mt-2 text-[#e20c0c] animate-bounce">
                <span className="block lg:hidden">
                  <ArrowDown className="w-5 h-5" />
                </span>
                <span className="hidden lg:block">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>

          {/* After Column (JDMHub Unified Workflow) */}
          <div className="lg:col-span-5 bg-white border-2 border-[#e20c0c] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl shadow-red-500/10 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  After — The Connected JDMHub Workflow
                </span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="space-y-3">
              {afterPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#e20c0c]/40 flex items-center gap-4 transition-all shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-[#e20c0c] font-black text-sm flex items-center justify-center shrink-0">
                    {pillar.badge}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">{pillar.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Connected From Sourcing to Hoist Bay Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
