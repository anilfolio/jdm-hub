"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Car,
  Wrench,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface InteractiveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicle?: string;
  initialPart?: string;
}

export function InteractiveRequestModal({
  isOpen,
  onClose,
  initialVehicle,
  initialPart,
}: InteractiveRequestModalProps) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState(initialVehicle || "Toyota Hiace 2019");
  const [partName, setPartName] = useState(initialPart || "Left Front Lower Control Arm");
  const [urgency, setUrgency] = useState<"urgent" | "standard">("urgent");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialVehicle) setVehicle(initialVehicle);
    if (initialPart) setPartName(initialPart);
  }, [initialVehicle, initialPart, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle ambient light brand glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e20c0c] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#e20c0c]">
                Quick Request Demonstration
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-2">
              Need a Part?{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] to-red-600">
                Let&apos;s Source It.
              </span>
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium">
              No Catalogue Browsing Required — Enter Your Vehicle and Part Requirement to See How JDMHub Handles the Rest.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-[#e20c0c]" />
                  Vehicle Make, Model &amp; Year
                </label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g. Toyota Hiace 2019, Nissan Silvia S15..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#e20c0c] focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#e20c0c] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-[#e20c0c]" />
                  Part Description / OEM Part Number
                </label>
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="e.g. Left Front Lower Control Arm (48069-26150)"
                  required
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#e20c0c] focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#e20c0c] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Procurement Priority
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUrgency("urgent")}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      urgency === "urgent"
                        ? "bg-red-50 border-[#e20c0c] text-red-800"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#e20c0c]" />
                    Urgent (Vehicle on Hoist)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency("standard")}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      urgency === "standard"
                        ? "bg-blue-50 border-blue-500 text-blue-800"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Standard Sourcing (3-5 Days)
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white font-bold text-sm uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg shadow-red-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Simulate Sourcing Request</span>
                </button>
                <Link
                  href="/customer/requests/new"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl transition-all"
                >
                  <span>Open Portal Full Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified B2B Trade Network. Direct supplier coordination.
              </p>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Request Reference Generated
              </span>
              <h3 className="text-3xl font-black tracking-tight text-slate-900 font-mono mt-3 mb-1">
                AH-P-000123
              </h3>
              <p className="text-sm text-slate-600">
                {vehicle} &bull; {partName}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs text-slate-700">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-amber-700">Sourcing In Progress</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Assigned Hub</span>
                <span className="font-bold text-slate-900">Nagoya Regional Depot, Japan</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Estimated Quote Turnaround</span>
                <span className="font-bold text-emerald-700">&lt; 2 Hours</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/customer/requests"
                onClick={handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white font-bold text-sm uppercase tracking-wider py-3 px-6 rounded-xl shadow-md shadow-red-500/25 transition-all"
              >
                <span>View in Customer Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
