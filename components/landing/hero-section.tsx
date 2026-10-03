"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Plane,
  Clock,
  ChevronDown,
} from "lucide-react";

interface HeroSectionProps {
  onRequestClick?: () => void;
}

export function HeroSection({ onRequestClick }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-slate-200/80">
      {/* Background Graphic & Subtle Polygonal Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft automotive background texture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-multiply filter contrast-125"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=80')",
          }}
        />

        {/* Soft radial ambient glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#e20c0c] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#e20c0c] animate-ping" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#e20c0c]">
                  B2B Automotive Procurement
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-slate-900">
                  Need a Part? <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] via-red-600 to-rose-700">
                    We’ll Handle the Rest.
                  </span>
                </h1>
                {/* Speed accent blade */}
                <div className="flex items-center justify-center lg:justify-start gap-1.5 pt-2">
                  <div className="w-16 h-1 rounded-full bg-[#e20c0c]" />
                  <div className="w-3 h-1 rounded-full bg-slate-300" />
                  <div className="w-1.5 h-1 rounded-full bg-slate-200" />
                </div>
              </div>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                JDMHub Helps Automotive Businesses Source Parts, Manage Quotes, Coordinate Freight, and Track Delivery — All in One Place.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white font-black text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/35 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <span>Request a Part</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-sm uppercase tracking-wider py-4 px-7 rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all"
                >
                  <span>How It Works</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </a>
              </div>
            </div>

          {/* Right Column: Realistic Japanese OEM Automotive Logistics Visual */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-red-600/15 via-slate-900/10 to-amber-500/10 rounded-3xl filter blur-2xl pointer-events-none" />

            {/* Main Visual Frame */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-900 shadow-2xl group transition-all duration-300 hover:shadow-red-500/10">
              {/* Photorealistic AI-Generated Automotive Parts Image */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-[480px] xl:h-[500px] w-full overflow-hidden bg-slate-900">
                <img
                  src="/images/hero-procurement-hd.jpg"
                  alt="JDMHub Automotive Procurement - Genuine Japanese OEM parts in logistics warehouse"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/30" />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-lg text-xs text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold tracking-wide">Direct Tokyo &amp; Nagoya Depots</span>
                </div>

                <div className="absolute top-4 right-4 bg-[#e20c0c] text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider shadow-md">
                  Verified OEM
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#e20c0c] text-white flex items-center justify-center font-black text-xs shadow-xs">
                        JD
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">B2B Trade Procurement</div>
                        <div className="text-[11px] text-slate-500">Genuine Factory Components &bull; Express Air Freight</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active Dispatch
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600">
                    <span>Tokyo Depot &rarr; Auckland Delivery</span>
                    <span className="font-bold text-slate-900">Door-to-Door Logistics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
