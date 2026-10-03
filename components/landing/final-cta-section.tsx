"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, LogIn, ShieldCheck, Check } from "lucide-react";

interface FinalCtaSectionProps {
  onRequestClick?: (data?: { vehicle?: string; part?: string }) => void;
}

export function FinalCtaSection({ onRequestClick }: FinalCtaSectionProps) {
  return (
    <section className="relative py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-slate-50 via-white to-red-50/30 border-t border-slate-200/80 overflow-hidden text-slate-900">
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Light Minimalist Card Container */}
        <div className="relative rounded-3xl sm:rounded-[36px] bg-white border border-slate-200/90 p-8 sm:p-12 lg:p-16 shadow-xl shadow-slate-200/50 text-center overflow-hidden">
          {/* Subtle Speed Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#e20c0c] to-transparent rounded-full" />

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold uppercase tracking-wider text-[#e20c0c] mb-5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            Direct Trade Sourcing
          </div>

          {/* Catchy Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15] mb-4">
            Ready to Streamline Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] to-red-600">
              Parts Procurement?
            </span>
          </h2>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            Direct Japanese OEM parts, express air cargo, and guaranteed landed pricing — coordinated directly to your workshop hoist bay.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#e20c0c] hover:bg-[#c10a0a] text-white font-bold text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>Request a Part</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-sm uppercase tracking-wider py-4 px-7 rounded-xl border border-slate-200 transition-colors"
            >
              <span>Sign In to Portal</span>
              <LogIn className="w-4 h-4 text-slate-500" />
            </Link>
          </div>

          {/* Minimal 1-line Proof Highlights */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Genuine Factory OEM
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              3–5 Day Express Air Cargo
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              NZBN &amp; GST Invoiced
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
