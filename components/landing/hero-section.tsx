"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Plane,
  Clock,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface HeroSectionProps {
  onRequestClick?: () => void;
}

export function HeroSection({ onRequestClick }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50/80 to-slate-100 text-slate-900 overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-slate-200/80">
      {/* Background Graphic & Subtle Polygonal Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft automotive background texture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-multiply filter contrast-125"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=80')",
          }}
        />

        {/* Animated radial ambient glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-500/6 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s' }} />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating decorative elements */}
        <div className="absolute top-24 left-[15%] w-3 h-3 rounded-full bg-red-500/20 animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute top-40 right-[20%] w-2 h-2 rounded-full bg-blue-500/20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-[25%] w-2.5 h-2.5 rounded-full bg-emerald-500/15 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/80 text-[#e20c0c] shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e20c0c] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e20c0c]" />
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#e20c0c]">
                  B2B Automotive Procurement
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-slate-900">
                  Need a Part? <br />
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] via-red-500 to-rose-600">
                    We'll Handle the Rest.
                    {/* Shimmer effect overlay */}
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"
                      style={{
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s ease-in-out infinite',
                      }}
                    />
                  </span>
                </h1>
                {/* Speed accent blade */}
                <div className="flex items-center justify-center lg:justify-start gap-1.5 pt-2">
                  <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#e20c0c] to-red-400" />
                  <div className="w-4 h-1 rounded-full bg-slate-300" />
                  <div className="w-2 h-1 rounded-full bg-slate-200" />
                </div>
              </div>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Tell us what you need. JDMHub coordinates sourcing, quotes, freight and delivery through one connected workflow.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={onRequestClick}
                  className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#e20c0c] to-[#c40b0b] hover:from-[#c40b0b] hover:to-[#9B0A0F] text-white font-extrabold text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/35 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer overflow-hidden group"
                >
                  {/* Subtle shine sweep on hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">Request a Part</span>
                  <ArrowRight className="relative z-10 w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                </button>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#e20c0c] px-4 py-3 rounded-xl hover:bg-red-50/50 border border-transparent hover:border-red-200/50 transition-all duration-200 group cursor-pointer"
                >
                  <span>See How It Works</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

          {/* Right Column: Realistic Japanese OEM Automotive Procurement Visual */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Backlight Glow - Enhanced */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/12 via-slate-900/8 to-amber-500/8 rounded-[32px] filter blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

            {/* Main Visual Frame */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-900 shadow-2xl group transition-all duration-500 hover:shadow-red-500/15 hover:shadow-3xl">
              {/* Photorealistic Japanese Logistics & OEM Parts Image */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-[490px] xl:h-[510px] w-full overflow-hidden bg-slate-900">
                <img
                  src="/images/hero-procurement-hd.jpg"
                  alt="JDMHub Automotive Procurement - Genuine Japanese OEM parts in logistics warehouse"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle dark gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/35" />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-lg text-xs text-white">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="font-semibold tracking-wide">Tokyo Depot &bull; Direct Sourcing</span>
                </div>

                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#e20c0c] to-[#c40b0b] text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider shadow-lg shadow-red-500/25">
                  Verified OEM
                </div>

                {/* Procurement Request UI Card — Enhanced Glassmorphism */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl p-5 border border-white/80 shadow-2xl space-y-3.5 transition-transform duration-300 group-hover:-translate-y-1">
                  {/* Card Header: Brand + Stage Tag */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#e20c0c] to-[#c40b0b] text-white flex items-center justify-center font-black text-[11px] shadow-sm">
                        JD
                      </div>
                      <span className="text-xs font-black tracking-tight text-slate-900 uppercase">
                        JDM<span className="text-[#e20c0c]">Hub</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Procurement Intake
                    </span>
                  </div>

                  {/* Vehicle & Part Specifications */}
                  <div className="space-y-1">
                    <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      Toyota Hiace 2019
                    </div>
                    <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <span>Left Front Control Arm</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-slate-500 font-mono text-[11px]">OEM #48069-26150</span>
                    </div>
                  </div>

                  {/* Request ID + Live Sourcing Pill */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Reference
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        Request #AH-P-000123
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-700 shadow-xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                      </span>
                      <span>Sourcing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer Keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
