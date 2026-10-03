"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, LogIn, ShieldCheck, Check, Sparkles } from "lucide-react";

interface FinalCtaSectionProps {
  onRequestClick?: (data?: { vehicle?: string; part?: string }) => void;
}

export function FinalCtaSection({ onRequestClick }: FinalCtaSectionProps) {
  return (
    <section className="relative py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-slate-50 via-white to-red-50/30 border-t border-slate-200/80 overflow-hidden text-slate-900">
      {/* Animated Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-red-500/5 rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating decorative dots */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-16 left-[20%] w-2 h-2 rounded-full bg-red-500/15 animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute top-32 right-[15%] w-1.5 h-1.5 rounded-full bg-blue-500/15 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-[30%] w-2 h-2 rounded-full bg-emerald-500/15 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Card Container */}
        <div className="relative rounded-3xl sm:rounded-[36px] bg-white border border-slate-200/90 p-8 sm:p-12 lg:p-16 shadow-2xl shadow-slate-200/50 text-center overflow-hidden group hover:shadow-3xl transition-shadow duration-500">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#e20c0c] to-transparent" />
          
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #e20c0c 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/80 text-xs font-bold uppercase tracking-wider text-[#e20c0c] mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Direct Trade Sourcing
          </div>

          {/* Catchy Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15] mb-4">
            Need a Part?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] via-red-500 to-rose-600">
              Start With a Request.
            </span>
          </h2>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            Tell JDMHub what you need. We&apos;ll coordinate the rest.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => onRequestClick?.()}
              className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#e20c0c] to-[#c40b0b] hover:from-[#c40b0b] hover:to-[#9B0A0F] text-white font-extrabold text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/35 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer overflow-hidden group/btn"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              <span className="relative">Request a Part</span>
              <ArrowRight className="relative w-4 h-4 stroke-[2.5] group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-sm uppercase tracking-wider py-4 px-7 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-sm"
            >
              <span>Sign In</span>
              <LogIn className="w-4 h-4 text-slate-500" />
            </Link>
          </div>

          {/* Trust Line Underneath — Enhanced */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center text-xs text-slate-500 font-medium">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-slate-500 font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Secure Portal
              </span>
              <span className="text-slate-300">&bull;</span>
              <span>Built for Trade Customers</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-700 font-bold">JDMHub Network</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
