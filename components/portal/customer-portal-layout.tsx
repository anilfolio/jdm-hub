"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { PortalSidebar } from "./portal-sidebar";
import { PortalHeader } from "./portal-header";
import { NewRequestModal } from "./new-request-modal";
import { RequestDetailsModal } from "./request-details-modal";
import { PaymentModal } from "./payment-modal";
import { usePortal } from "@/context/portal-context";
import { Clock, ShieldAlert } from "lucide-react";

interface CustomerPortalLayoutProps {
  children?: React.ReactNode;
}

export function CustomerPortalLayout({ children }: CustomerPortalLayoutProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { activeCustomer, selectedRequest, setSelectedRequest, setSelectedRequestDetailsTab, setActiveTab, activeTab, requests } = usePortal();

  // Close mobile drawer whenever pathname or activeTab changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, activeTab]);

  // Read URL query parameters to auto-open request (e.g. ?request=req-000128&tab=quote)
  useEffect(() => {
    if (typeof window === "undefined" || !requests || requests.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const reqId = params.get("request") || params.get("id");
    const tabParam = params.get("tab");
    if (reqId) {
      const normalized = reqId.toLowerCase();
      const legacyMap: Record<string, string> = {
        "req-000123": "jdhub-0001",
        "autohub-p-000123": "jdhub-0001",
        "req-000145": "jdhub-0002",
        "autohub-p-000145": "jdhub-0002",
        "req-000138": "jdhub-0003",
        "autohub-p-000138": "jdhub-0003",
        "req-000128": "jdhub-0004",
        "autohub-p-000128": "jdhub-0004",
        "req-000137": "jdhub-0005",
        "autohub-p-000137": "jdhub-0005",
        "req-000125": "jdhub-0006",
        "autohub-p-000125": "jdhub-0006",
        "req-000120": "jdhub-0007",
        "autohub-p-000120": "jdhub-0007",
        "req-000115": "jdhub-0008",
        "autohub-p-000115": "jdhub-0008",
        "req-000110": "jdhub-0009",
        "autohub-p-000110": "jdhub-0009",
        "req-000188": "jdhub-0010",
        "autohub-p-000188": "jdhub-0010",
        "req-000199": "jdhub-0011",
        "autohub-p-000199": "jdhub-0011",
        "req-000200": "jdhub-0012",
        "autohub-p-000200": "jdhub-0012",
        "req-000201": "jdhub-0013",
        "autohub-p-000201": "jdhub-0013",
      };
      const mapped = legacyMap[normalized] || normalized;
      const found = requests.find(
        (r) =>
          r.id.toLowerCase() === normalized ||
          r.requestNumber.toLowerCase() === normalized ||
          r.id.toLowerCase() === mapped ||
          r.requestNumber.toLowerCase() === mapped
      );
      if (found) {
        setSelectedRequest(found);
        if (tabParam) {
          setSelectedRequestDetailsTab(tabParam);
        }
      }
    }
  }, [requests, setSelectedRequest, setSelectedRequestDetailsTab]);

  // Listen for search item selection in customer portal
  useEffect(() => {
    const handleOpenCustomerRequest = (e: Event) => {
      const customEvent = e as CustomEvent<{ requestId: string; tab?: string }>;
      if (!customEvent.detail?.requestId) return;
      const targetId = customEvent.detail.requestId.toLowerCase();
      const req = requests.find((r) => r.id.toLowerCase() === targetId || r.requestNumber.toLowerCase() === targetId);
      if (req) {
        setSelectedRequest(req);
        if (customEvent.detail.tab) {
          setSelectedRequestDetailsTab(customEvent.detail.tab);
        }
        setActiveTab("requests");
      }
    };

    window.addEventListener("JDMHUB:open-customer-request", handleOpenCustomerRequest);
    return () => window.removeEventListener("JDMHUB:open-customer-request", handleOpenCustomerRequest);
  }, [requests, setSelectedRequest, setSelectedRequestDetailsTab, setActiveTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 w-full overflow-x-hidden">
      {/* Dark Sidebar with Mobile Drawer */}
      <PortalSidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area - ml-0 on mobile/tablet, lg:ml-64/20 on desktop */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-h-screen min-w-0 max-w-full overflow-x-hidden ml-0 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
      >
        {/* Top Sticky Header */}
        <PortalHeader
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0 flex flex-col">
        {/* CUSTOMER ACCOUNT STATUS BANNER */}
        {activeCustomer?.status === "Pending Approval" && (
          <div className="mb-5 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                    Trade Account Under Review
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {activeCustomer.businessName}
                  </span>
                </div>
                <p className="text-xs text-amber-950 font-medium mt-1 leading-relaxed">
                  Your trade account application is currently being verified by the JDMHUB Trade Desk. Sourcing specialists will commence supplier negotiations once your trade credentials are confirmed.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 self-start sm:self-auto shrink-0">
              Review in Progress
            </span>
          </div>
        )}

        {activeCustomer?.status === "Suspended" && (
          <div className="mb-5 bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3 animate-in fade-in duration-200">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-rose-900 block">
                Trade Account Suspended
              </span>
              <span className="text-xs text-rose-800 block mt-0.5">
                Your account is currently suspended. Please contact JDMHUB Operations (ops@jdmhub.co.nz) to resolve outstanding invoices.
              </span>
            </div>
          </div>
        )}
          {selectedRequest ? <RequestDetailsModal /> : children}
        </main>
      </div>

      {/* Interactive Global Modals */}
      <NewRequestModal />
      <PaymentModal />
    </div>
  );
}
