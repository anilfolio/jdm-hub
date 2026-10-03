"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Receipt,
  CheckCircle2,
  Truck,
  ArrowRight,
  Car,
  DollarSign,
  ShieldCheck,
  CreditCard,
  Plane,
} from "lucide-react";

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01 — Request",
      title: "Tell Us What You Need",
      desc: "Submit Your Part and Vehicle Details.",
      icon: FileText,
      smallImage:
        "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80",
      detail:
        "Input vehicle VIN, registration, make, model and the required component. Add photos or part diagrams directly.",
      badge: "Fast Submission Form",
    },
    {
      num: "02 — Source",
      title: "We Find the Part",
      desc: "JDMHub Coordinates With Suppliers to Source It.",
      icon: Search,
      smallImage:
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80",
      detail:
        "Our specialized procurement desks in Japan and Australasia query official OEM depots, dismantling networks, and verified aftermarket partners.",
      badge: "Supplier Network Japan",
    },
    {
      num: "03 — Quote",
      title: "Review the Quote",
      desc: "See Part Pricing, Freight Options, and Landed Cost.",
      icon: Receipt,
      smallImage:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80",
      detail:
        "Receive a transparent quote including part cost, air or sea freight options, and clear landed NZD totals before you commit.",
      badge: "No Hidden Costs",
    },
    {
      num: "04 — Approve",
      title: "Approve & Pay",
      desc: "Confirm Your Purchase and Complete Payment.",
      icon: CheckCircle2,
      smallImage:
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80",
      detail:
        "Accept terms with one click. Pay securely via POLi, Credit Card, or Approved Trade Account Terms.",
      badge: "1-Click Confirmation",
    },
    {
      num: "05 — Deliver",
      title: "Track Your Delivery",
      desc: "Follow Your Order Through Shipment to Bay Delivery.",
      icon: Truck,
      smallImage:
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80",
      detail:
        "Real-time milestone notifications from Tokyo packaging to air cargo customs clearance and courier delivery to your workshop bay.",
      badge: "Door-to-Door Tracking",
    },
  ];

  return (
    <section id="how-it-works" className="relative bg-slate-50 py-20 lg:py-28 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold uppercase tracking-wider text-[#e20c0c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e20c0c]" />
            How It Works
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            From Request{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e20c0c] to-red-600">
              to Delivery.
            </span>
          </h2>

          <div className="w-12 h-1 bg-[#e20c0c] rounded-full mx-auto my-2" />

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            A Simple Procurement Journey Managed Seamlessly Through One Platform.
          </p>
        </div>

        {/* Horizontal Journey Journey Nodes */}
        <div className="relative">
          {/* Connecting Track Line for Desktop */}
          <div
            className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[3px] bg-slate-200 pointer-events-none z-0"
            aria-hidden="true"
          >
            <div
              className="h-full bg-gradient-to-r from-[#e20c0c] via-blue-600 to-emerald-500 transition-all duration-500"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* 5 Step Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = activeStep === idx;

              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`group relative rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 border ${
                    isCurrent
                      ? "bg-white border-[#e20c0c] shadow-lg shadow-red-500/10 -translate-y-2 ring-2 ring-[#e20c0c]/30"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  {/* Step Number Tag */}
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 ${
                      isCurrent
                        ? "bg-[#e20c0c] text-white"
                        : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    }`}
                  >
                    {step.num}
                  </span>

                  {/* Icon Node Container with Image Thumbnail */}
                  <div className="relative mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl overflow-hidden border-2 relative flex items-center justify-center transition-all bg-gradient-to-br from-slate-800 to-slate-900 ${
                        isCurrent
                          ? "border-[#e20c0c] ring-4 ring-[#e20c0c]/15 scale-105"
                          : "border-slate-200 group-hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={step.smallImage}
                        alt={step.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Step Title & Subtitle */}
                  <h3 className="text-base font-bold tracking-tight text-slate-900 mb-1.5 group-hover:text-[#e20c0c] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed mb-3">
                    {step.desc}
                  </p>

                  {/* Micro Badge */}
                  <span className="mt-auto inline-block text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {step.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Step Deep Dive Banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#e20c0c] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md">
              0{activeStep + 1}
            </div>
            <div>
              <div className="text-xs font-bold text-[#e20c0c] uppercase tracking-wider">
                Stage {activeStep + 1} of 5 &bull; {steps[activeStep].num}
              </div>
              <h4 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
                {steps[activeStep].title}
              </h4>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
                {steps[activeStep].detail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
              type="button"
              className="px-4 py-2 rounded-xl bg-[#e20c0c] hover:bg-[#9B0A0F] text-xs font-bold uppercase tracking-wider text-white transition-colors shadow-sm"
            >
              Next Step &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
