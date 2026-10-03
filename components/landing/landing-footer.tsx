"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { PoweredByJdmhub } from "@/components/auth/powered-by-jdmhub";

export function LandingFooter() {
  return (
    <footer className="relative bg-slate-50 text-slate-600 border-t border-slate-200/90 selection:bg-[#e20c0c] selection:text-white">
      {/* Subtle Aerodynamic Top Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#e20c0c] to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer: Brand + Contact Details */}
        <div className="py-12 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-slate-200">
          {/* Col 1: Brand Info & Legal Links */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#e20c0c] shadow-md shadow-red-500/20 flex items-center justify-center font-black text-xl text-white tracking-tighter leading-none shrink-0 group-hover:scale-105 transition-transform">
                JD
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black italic tracking-tight text-slate-900 uppercase leading-none">
                    JDM<span className="not-italic text-[#e20c0c]">HUB</span>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider mt-0.5 uppercase">
                  Automotive Procurement
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
              Dedicated B2B cross-border automotive procurement connecting Australasian trade workshops, collision repairers, and dealerships directly with Japanese domestic OEM parts networks.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full shadow-xs w-fit">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified B2B Importer &bull; NZ GST</span>
              </div>

              {/* Legal Links */}
              <div className="inline-flex items-center gap-3 text-xs font-semibold">
                <Link
                  href="/terms"
                  className="text-slate-600 hover:text-[#e20c0c] transition-colors"
                >
                  Terms &amp; Conditions
                </Link>
                <span className="text-slate-300">&bull;</span>
                <Link
                  href="/privacy"
                  className="text-slate-600 hover:text-[#e20c0c] transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Col 2: Contact Details (Spacious 2-Column Grid Layout) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="pb-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
                Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-xs">
              {/* Phone */}
              <a
                href="tel:+6495258890"
                className="flex items-start gap-3.5 text-slate-700 hover:text-[#e20c0c] transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#e20c0c] flex items-center justify-center shrink-0 border border-red-200 group-hover:scale-105 transition-transform shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Trade Support Hotline
                  </div>
                  <div className="font-bold text-slate-900 group-hover:text-[#e20c0c] transition-colors text-sm mt-0.5">
                    +64 9 525 8890
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Priority line for workshop bays
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:trade@jdmhub.co.nz"
                className="flex items-start gap-3.5 text-slate-700 hover:text-[#e20c0c] transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#e20c0c] flex items-center justify-center shrink-0 border border-red-200 group-hover:scale-105 transition-transform shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Procurement Email
                  </div>
                  <div className="font-bold text-slate-900 group-hover:text-[#e20c0c] transition-colors text-sm mt-0.5 truncate">
                    trade@jdmhub.co.nz
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Inquiries, landed quotes &amp; orders
                  </div>
                </div>
              </a>

              {/* Logistics Desks */}
              <div className="flex items-start gap-3.5 text-slate-600">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Logistics Desks
                  </div>
                  <div className="font-semibold text-slate-900 text-xs mt-0.5">
                    Auckland Airport Logistics Park
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Tokyo &amp; Nagoya Sourcing Hubs
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5 text-slate-500">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Operational Hours
                  </div>
                  <div className="text-slate-900 font-semibold text-xs mt-0.5">
                    Mon &ndash; Fri: 8:00 AM &ndash; 6:00 PM
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    NZST (UTC+12) / JST (UTC+9)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Minimal Vector Signature */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} JDMHub Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <PoweredByJdmhub variant="minimal" />
          </div>
        </div>
      </div>
    </footer>
  );
}
