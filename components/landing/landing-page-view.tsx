"use client";

import React, { useState } from "react";
import { LandingHeader } from "./landing-header";
import { HeroSection } from "./hero-section";
import { TrustMetricsSection } from "./trust-metrics-section";
import { ValuePropositionSection } from "./value-proposition-section";
import { HowItWorksSection } from "./how-it-works-section";
import { LessChasingSection } from "./less-chasing-section";
import { QuoteFreightSection } from "./quote-freight-section";
import { TrackRequestSection } from "./track-request-section";
import { BuiltForTradeSection } from "./built-for-trade-section";
import { FinalCtaSection } from "./final-cta-section";
import { LandingFooter } from "./landing-footer";
import { InteractiveRequestModal } from "./interactive-request-modal";

export function LandingPageView() {
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ vehicle?: string; part?: string }>({});

  const handleOpenRequest = (prefillData?: { vehicle?: string; part?: string }) => {
    if (prefillData) {
      setPrefill(prefillData);
    }
    setRequestModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#e20c0c] selection:text-white">
      {/* Sticky Brand Navigation Header */}
      <LandingHeader onRequestClick={() => handleOpenRequest()} />

      {/* Main Content Assembly */}
      <main className="flex-1">
        {/* 01. HERO */}
        <HeroSection onRequestClick={() => handleOpenRequest()} />

        {/* 02. TRUST & SPEED METRICS STRIP */}
        <TrustMetricsSection />

        {/* 03. VALUE PROPOSITION */}
        <ValuePropositionSection />

        {/* 03. HOW IT WORKS */}
        <HowItWorksSection />

        {/* 04. LESS CHASING & WORKFLOW */}
        <LessChasingSection />

        {/* 05. QUOTE & FREIGHT */}
        <QuoteFreightSection />

        {/* 06. TRACK YOUR REQUEST */}
        <TrackRequestSection />

        {/* 07. BUILT FOR AUTOMOTIVE BUSINESSES */}
        <BuiltForTradeSection />

        {/* 08. FINAL CTA */}
        <FinalCtaSection onRequestClick={(data) => handleOpenRequest(data)} />
      </main>

      {/* 09. FOOTER */}
      <LandingFooter />

      {/* Interactive Request A Part Modal */}
      <InteractiveRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        initialVehicle={prefill.vehicle}
        initialPart={prefill.part}
      />
    </div>
  );
}
