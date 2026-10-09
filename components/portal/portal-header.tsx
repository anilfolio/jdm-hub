"use client";

import React, { useEffect } from "react";
import { Search, Menu, Building2, Check, ChevronDown } from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { useGlobalSearch } from "@/context/global-search-context";
import { NotificationCenter } from "./notification-center";

interface PortalHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleMobile?: () => void;
}

export function PortalHeader({
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleMobile,
}: PortalHeaderProps = {}) {
  const { activeTab, activeCustomer, setActiveCustomerId, availableCustomers, filterByCustomerOnly, setFilterByCustomerOnly } = usePortal();
  const [showDealerDropdown, setShowDealerDropdown] = React.useState(false);
  const dealerMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dealerMenuRef.current && !dealerMenuRef.current.contains(e.target as Node)) {
        setShowDealerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { openSearch } = useGlobalSearch();

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "requests":
        return "Parts Requests";
      case "orders":
        return "Procurement Orders";
      case "shipments":
        return "Shipment Tracking";
      case "payments":
        return "Billing & Payments";
      case "settings":
        return "Trade Settings";
      default:
        return "Customer Portal";
    }
  };

  // Sync browser tab title with active portal section
  useEffect(() => {
    document.title = `${getTabTitle()} | JDMHUB`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile hamburger toggle (visible < lg) */}
          {onToggleMobile && (
            <button
              onClick={onToggleMobile}
              type="button"
              aria-label="Open navigation drawer"
              className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e20c0c]/30 cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Desktop collapse toggle (visible >= lg) */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              type="button"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:inline-flex p-2 -ml-2 rounded-xl text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e20c0c]/30 cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <h1 className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight truncate">
            {getTabTitle()}
          </h1>
        </div>

        {/* Right: Global Search & Notifications */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Button (Compact icon trigger) */}
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label="Open Global Search"
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-slate-500" />
          </button>

          {/* Active Trade Dealer Switcher */}
          <div className="relative" ref={dealerMenuRef}>
            <button
              type="button"
              onClick={() => setShowDealerDropdown((prev) => !prev)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-50 hover:bg-slate-100/90 rounded-xl text-xs font-bold text-slate-800 transition-colors border border-slate-200 shadow-2xs cursor-pointer"
              title="Switch Trade Workshop / Dealer Account"
            >
              <Building2 className="w-3.5 h-3.5 text-[#e20c0c] shrink-0" />
              <span className="max-w-[110px] sm:max-w-[160px] truncate text-left">
                {filterByCustomerOnly ? activeCustomer.businessName : "All Workshops (Demo)"}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${showDealerDropdown ? "rotate-180" : ""}`} />
            </button>

            {showDealerDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                  <span>Switch Dealer Account</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Synced</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
                  {availableCustomers.map((c) => {
                    const isSelected = filterByCustomerOnly && activeCustomer.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setActiveCustomerId(c.id);
                          setFilterByCustomerOnly(true);
                          setShowDealerDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-red-50 text-[#e20c0c] font-bold"
                            : "text-slate-700 hover:bg-slate-50 font-medium"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="truncate font-bold text-xs">{c.businessName}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {c.contactName} • <span className={`${c.status === "Pending Approval" ? "text-amber-600 font-bold" : ""}`}>{c.status}</span>
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#e20c0c] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterByCustomerOnly(false);
                      setShowDealerDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      !filterByCustomerOnly
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">⚡ All Dealers (Global Demo)</p>
                      <p className="text-[10px] opacity-75">View all NZ workshop requests together</p>
                    </div>
                    {!filterByCustomerOnly && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Search Trigger with ⌘K */}
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label="Open Global Search (Cmd+K)"
            className="hidden md:flex relative w-64 lg:w-80 items-center justify-between pl-10 pr-3 py-2 text-xs bg-slate-100/90 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e20c0c]/30 focus:border-[#e20c0c] transition-all text-left cursor-pointer group shadow-xs"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-slate-600 transition-colors pointer-events-none" />
            <span className="truncate">Search invoice #, quotes, parts, ref...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs shrink-0 group-hover:border-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
}
