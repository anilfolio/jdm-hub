"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  X,
  Building2,
  CheckCircle2,
  ArrowRight,
  Plane,
  Ship,
  Clock,
  Globe,
  Radio,
  Send,
  Headphones,
  Check,
  ChevronRight,
  Boxes,
} from "lucide-react";
import { PoweredByJdmhub } from "@/components/auth/powered-by-jdmhub";

export function LandingFooter() {
  const [modalType, setModalType] = useState<"about" | "contact" | null>(null);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <>
      <footer className="relative bg-[#060911] text-slate-400 overflow-hidden border-t border-slate-800/80 selection:bg-[#e20c0c] selection:text-white">
        {/* Aerodynamic Top Gradient Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#e20c0c] to-transparent opacity-80" />

        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e20c0c]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TIER 1: Creative Live Telemetry / Procurement Network Strip */}
          <div className="py-10 border-b border-slate-800/70">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Global Procurement Network Status:{" "}
                  <span className="text-emerald-400 font-bold">Synchronized &amp; Active</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-[#e20c0c]" />
                  Tokyo: <span className="text-white font-mono font-bold">JST (UTC+9)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-[#e20c0c]" />
                  Auckland: <span className="text-white font-mono font-bold">NZST (UTC+12)</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Telemetry Card 1 */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#e20c0c]/10 text-[#e20c0c] flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Direct OEM
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                  Tokyo &amp; Nagoya Desks
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time electronic requisition to Toyota, Nissan, Honda &amp; Subaru central depots.
                </p>
              </div>

              {/* Telemetry Card 2 */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Plane className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    3–5 Day Air
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  Priority Air Cargo
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  4 scheduled flights per week from Narita with customs pre-cleared landed declarations.
                </p>
              </div>

              {/* Telemetry Card 3 */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Ship className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Ocean Sea Freight
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  Container Consolidations
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bi-weekly sailings for engines, half-cuts, heavy chassis panels &amp; bulk assemblies.
                </p>
              </div>

              {/* Telemetry Card 4 */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Commercial Standard
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  Guaranteed Landed Cost
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fixed NZD landed quotes with door-to-bay tracking and zero unexpected wharfage fees.
                </p>
              </div>
            </div>
          </div>

          {/* TIER 2: Main Bento Content Area */}
          <div className="py-14 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 border-b border-slate-800/70">
            {/* Col 1: Brand & Manifest Alert (Span 4 on lg) */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl border-2 border-white/20 bg-[#e20c0c] shadow-lg shadow-[#e20c0c]/20 flex items-center justify-center font-black text-xl text-white tracking-tighter leading-none shrink-0 group-hover:scale-105 transition-transform">
                  JD
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black italic tracking-tight text-white uppercase leading-none">
                      JDM<span className="not-italic text-slate-200">HUB</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 tracking-wider mt-0.5 uppercase">
                    Automotive Procurement
                  </span>
                </div>
              </Link>

              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                The dedicated B2B cross-border automotive procurement engine connecting Australasian trade workshops, collision centres, and dealerships directly with Japanese domestic parts networks.
              </p>

              {/* Creative Weekly Container Manifest Signup Box */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-[#e20c0c] animate-pulse" />
                    Trade Container Manifests
                  </span>
                  <span className="text-[10px] text-slate-400">Weekly Digest</span>
                </div>

                {isSubscribed ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Your workshop email has been registered for incoming manifests.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2">
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={subscribedEmail}
                        onChange={(e) => setSubscribedEmail(e.target.value)}
                        placeholder="workshop@trade.co.nz"
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e20c0c] focus:ring-1 focus:ring-[#e20c0c] transition-all pr-9"
                      />
                      <button
                        type="submit"
                        aria-label="Subscribe to Manifests"
                        className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#e20c0c] hover:bg-[#c10a0a] text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      Strictly B2B Trade Workshops Only &bull; Zero Spam
                    </div>
                  </form>
                )}
              </div>

              {/* Sourcing Hubs Indicator */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                  🇯🇵 Tokyo Desk
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                  🇯🇵 Nagoya Hub
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                  🇳🇿 Auckland Depot
                </span>
              </div>
            </div>

            {/* Col 2: Platform Links (Span 2 on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
                Platform
              </h3>
              <ul className="space-y-3 text-xs">
                <li>
                  <Link href="/customer/requests" className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                    <span>Part &amp; VIN Requests</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition-colors" />
                  </Link>
                </li>
                <li>
                  <a href="#quotes-freight" className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                    <span>Landed Quotations</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition-colors" />
                  </a>
                </li>
                <li>
                  <Link href="/customer/payments" className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                    <span>Multi-Currency Escrow</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition-colors" />
                  </Link>
                </li>
                <li>
                  <Link href="/customer/shipments" className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                    <span>Consignment Tracking</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition-colors" />
                  </Link>
                </li>
                <li className="pt-2">
                  <Link
                    href="/customer/dashboard"
                    className="inline-flex items-center gap-1.5 text-[#e20c0c] hover:text-red-400 font-bold transition-colors group"
                  >
                    <span>Customer Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Company & Governance Links (Span 2 on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
                Company
              </h3>
              <ul className="space-y-3 text-xs">
                <li>
                  <button
                    onClick={() => setModalType("about")}
                    className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer flex items-center justify-between w-full group"
                  >
                    <span>About JDMHub</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition-colors" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType("contact")}
                    className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer flex items-center justify-between w-full group"
                  >
                    <span>Contact Operations</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition-colors" />
                  </button>
                </li>
                <li>
                  <Link href="/admin/requests" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <span>Admin Workspace</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-400 hover:text-white transition-colors flex items-center justify-between group">
                    <span>Apply for Trade Account</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-medium">B2B</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Creative Direct Trade Helpdesk Card (Span 4 on lg) */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#e20c0c]/15 text-[#e20c0c] border border-[#e20c0c]/30 flex items-center justify-center">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Direct Trade Desk</h4>
                      <p className="text-[11px] text-slate-400">Auckland &bull; Tokyo Coordinated</p>
                    </div>
                  </div>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Require urgent chassis verification, emergency express air cargo, or bulk container allocation?
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  <a
                    href="tel:+6495258890"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#e20c0c] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Trade Hotline</span>
                      <span className="font-semibold text-white">+64 9 525 8890</span>
                    </div>
                  </a>

                  <a
                    href="mailto:trade@jdmhub.co.nz"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#e20c0c] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Priority Email</span>
                      <span className="font-semibold text-white">trade@jdmhub.co.nz</span>
                    </div>
                  </a>
                </div>

                <button
                  onClick={() => setModalType("contact")}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                >
                  <span>Open Contact Details</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* TIER 3: Bottom Bar (Copyright, Registry, Powered By) */}
          <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span>&copy; {new Date().getFullYear()} JDMHub Ltd. All rights reserved.</span>
              <span className="hidden sm:inline text-slate-700">&bull;</span>
              <span className="text-slate-400">NZBN: 9429033812001</span>
              <span className="hidden sm:inline text-slate-700">&bull;</span>
              <span className="text-slate-400">GST: 118-294-882</span>
            </div>

            <div className="flex items-center gap-6">
              <PoweredByJdmhub variant="minimal" />
            </div>
          </div>
        </div>
      </footer>

      {/* About Modal with Enhanced Dark Luxury Aesthetic */}
      {modalType === "about" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setModalType(null)}
        >
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e20c0c] text-white font-black text-sm flex items-center justify-center shadow-lg shadow-[#e20c0c]/30">
                JD
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">About JDMHub</h3>
                <p className="text-xs text-slate-400">B2B Automotive Cross-Border Infrastructure</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              JDMHub was developed to solve the friction of international parts procurement for trade workshops, collision repairers, and automotive dealerships across Australasia.
            </p>

            <p className="text-xs text-slate-300 leading-relaxed">
              By connecting Japanese supplier networks, direct factory OEM depots, and international air and sea logistics under a single unified platform, JDMHub eliminates catalogue guessing, currency confusion, and untracked freight.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Platform Commitments:
              </div>
              <div className="text-slate-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Guaranteed total landed costs before payment &bull; Zero surprise wharfage
              </div>
              <div className="text-slate-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Full door-to-door tracking from Tokyo central depot to your workshop bay
              </div>
              <div className="text-slate-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Dedicated automotive sourcing specialists in Japan &amp; New Zealand
              </div>
            </div>

            <button
              onClick={() => setModalType(null)}
              className="w-full py-3 bg-[#e20c0c] hover:bg-[#c10a0a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal with Enhanced Dark Luxury Aesthetic */}
      {modalType === "contact" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setModalType(null)}
        >
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e20c0c] text-white font-black text-sm flex items-center justify-center shadow-lg shadow-[#e20c0c]/30">
                JD
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Contact Trade Operations</h3>
                <p className="text-xs text-slate-400">Direct Australasia &bull; Japan Sourcing Desks</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Our B2B procurement desks operate in both New Zealand and Japan to coordinate time-critical parts sourcing, catalogue validation, and express freight consignments.
            </p>

            <div className="space-y-3 text-xs">
              <a
                href="mailto:trade@jdmhub.co.nz"
                className="p-3.5 bg-slate-950/80 hover:bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3.5 transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#e20c0c]/15 text-[#e20c0c] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Email Procurement Desk</div>
                  <div className="font-semibold text-white group-hover:text-red-400 transition-colors">
                    trade@jdmhub.co.nz
                  </div>
                </div>
              </a>

              <a
                href="tel:+6495258890"
                className="p-3.5 bg-slate-950/80 hover:bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3.5 transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#e20c0c]/15 text-[#e20c0c] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Trade Support Hotline</div>
                  <div className="font-semibold text-white group-hover:text-red-400 transition-colors">
                    +64 9 525 8890 (Auckland Trade Hub)
                  </div>
                </div>
              </a>

              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#e20c0c]/15 text-[#e20c0c] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Operating Hubs</div>
                  <div className="font-semibold text-white">
                    Auckland Airport Logistics Park &bull; Nagoya Chubu Logistics Hub, Japan
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalType(null)}
              className="w-full py-3 bg-[#e20c0c] hover:bg-[#c10a0a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </>
  );
}

