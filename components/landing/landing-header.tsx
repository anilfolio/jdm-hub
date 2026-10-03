"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

interface LandingHeaderProps {
  onRequestClick?: () => void;
}

export function LandingHeader({ onRequestClick }: LandingHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Platform", href: "#platform" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Workflow", href: "#workflow" },
  ];

  return (
    <>
      {/* Top Demo & Portal Environment Ribbon */}
      <div className="bg-[#e20c0c] border-b border-red-700 text-[12px] py-1.5 px-4 text-white select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
          <span className="font-semibold text-white">JDMHub B2B Network Live:</span>
          <span className="hidden sm:inline text-red-100">Direct Tokyo &amp; Nagoya Parts Coordination</span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-200/80 py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="w-10 h-10 rounded-xl border-2 border-white bg-[#e20c0c] shadow-md flex items-center justify-center font-black text-xl text-white tracking-tighter leading-none shrink-0 transition-transform duration-200 group-hover:scale-105">
              JD
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black italic tracking-tight text-slate-900 uppercase leading-none">
                  JDM<span className="not-italic text-slate-800">HUB</span>
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider mt-0.5">
                Automotive Procurement
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-xs transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>Request a Part</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            type="button"
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#e20c0c] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md"
              >
                <span>Request a Part</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
