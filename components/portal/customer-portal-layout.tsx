"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { PortalSidebar } from "./portal-sidebar";
import { PortalHeader } from "./portal-header";
import { NewRequestModal } from "./new-request-modal";
import { RequestDetailsModal } from "./request-details-modal";
import { PaymentModal } from "./payment-modal";
import { usePortal } from "@/context/portal-context";

interface CustomerPortalLayoutProps {
  children?: React.ReactNode;
}

export function CustomerPortalLayout({ children }: CustomerPortalLayoutProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { selectedRequest, setSelectedRequest, setSelectedRequestDetailsTab, setActiveTab, activeTab, requests } = usePortal();

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
      const found = requests.find(
        (r) => r.id.toLowerCase() === reqId.toLowerCase() || r.requestNumber.toLowerCase() === reqId.toLowerCase()
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
          {selectedRequest ? <RequestDetailsModal /> : children}
        </main>
      </div>

      {/* Interactive Global Modals */}
      <NewRequestModal />
      <PaymentModal />
    </div>
  );
}
