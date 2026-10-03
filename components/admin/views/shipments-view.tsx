"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  Plane,
  ArrowRight,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  FastForward,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";
import { ShipmentMilestone } from "@/types/shared";
import { ShipmentMilestoneBadge, StatusBadge } from "../status-badge";

const MILESTONES: ShipmentMilestone[] = [
  "Received At Shipping Facility",
  "In Transit",
  "Arrived in NZ",
  "Out For Delivery",
  "Delivered",
];

export function ShipmentsView() {
  const router = useRouter();
  const { requests, updateShipmentMilestone } = useUnifiedData();
  const [search, setSearch] = useState("");
  const [milestoneFilter, setMilestoneFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // All requests with shipments or marked as Shipped/Delivered
  const shipmentRequests = useMemo(() => {
    return requests.filter(
      (r) => r.status === "Shipped" || r.status === "Delivered" || !!r.shipment
    );
  }, [requests]);

  const filtered = useMemo(() => {
    return shipmentRequests.filter((r) => {
      if (milestoneFilter !== "All") {
        const ms = r.shipment?.currentMilestone || (r.status === "Delivered" ? "Delivered" : "In Transit");
        if (ms !== milestoneFilter) return false;
      }

      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        (r.requestNumber || "").toLowerCase().includes(q) ||
        (r.customerName || "").toLowerCase().includes(q) ||
        (r.part?.name || "").toLowerCase().includes(q) ||
        (r.shipment?.carrier && r.shipment.carrier.toLowerCase().includes(q))
      );
    });
  }, [shipmentRequests, milestoneFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedShipments = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filtered, currentPage]
  );

  const inTransitCount = shipmentRequests.filter((r) => (r.shipment?.currentMilestone || r.status) !== "Delivered").length;
  const deliveredCount = shipmentRequests.filter((r) => (r.shipment?.currentMilestone || r.status) === "Delivered").length;

  const handleQuickAdvance = (e: React.MouseEvent, reqId: string, currentMilestone?: ShipmentMilestone) => {
    e.stopPropagation();
    const curr = currentMilestone || "Received At Shipping Facility";
    const currIdx = MILESTONES.indexOf(curr);
    if (currIdx < MILESTONES.length - 1) {
      const next = MILESTONES[currIdx + 1];
      updateShipmentMilestone(reqId, next, `Quick milestone advance to ${next}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
            Total Freight Consignments
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {shipmentRequests.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            International air cargo & domestic delivery
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
            Active in Transit
          </span>
          <span className="text-2xl font-black text-cyan-600 mt-1 block">
            {inTransitCount}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Awaiting customs or final delivery
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
            Delivered to Workshop
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {deliveredCount}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Full proof of delivery confirmed
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Carrier, Tracking #, Request..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e20c0c]/20 focus:border-[#e20c0c] transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
          {(["All", "In Transit", "Arrived in NZ", "Out For Delivery", "Delivered"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setMilestoneFilter(filter);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                milestoneFilter === filter
                  ? "bg-[#e20c0c] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Sub-header info bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-medium">
            Showing <strong className="text-slate-800 font-bold">{filtered.length}</strong> shipment consignment{filtered.length === 1 ? "" : "s"}
          </span>
          <span className="text-[11px] text-slate-400">
            Select milestone dropdown to update tracking status in real time
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[760px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Request #</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Customer</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Part</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Carrier</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Shipment Status</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Estimated Delivery</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Last Updated</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No active shipments matching your filter.
                  </td>
                </tr>
              ) : (
                paginatedShipments.map((req) => {
                  return (
                    <tr
                      key={req.id}
                      onClick={() => router.push(`/admin/requests?id=${req.id}`)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 font-bold text-slate-700 hover:text-slate-800 hover:underline">
                        {req.requestNumber}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 font-bold text-slate-900">{req.customerName}</td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-slate-800">
                        <span className="font-medium line-clamp-1">{req.part.name}</span>
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-slate-700 font-semibold">
                        {req.shipment?.carrier || "Standard Freight"}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">
                        {req.shipment?.currentMilestone ? (
                          <ShipmentMilestoneBadge milestone={req.shipment.currentMilestone} />
                        ) : (
                          <StatusBadge status={req.status} size="sm" />
                        )}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-slate-600 font-medium">
                        {req.shipment?.estimatedDelivery || "5-7 Business Days"}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-slate-500 text-[11px] whitespace-nowrap">
                        {req.lastUpdated}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <select
                            value={req.shipment?.currentMilestone || (req.status === "Delivered" ? "Delivered" : "In Transit")}
                            onChange={(e) => {
                              const newMs = e.target.value as ShipmentMilestone;
                              updateShipmentMilestone(req.id, newMs, `Milestone updated to ${newMs}`);
                            }}
                            className="text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:border-[#e20c0c] rounded-lg px-2 py-1 shadow-xs focus:ring-1 focus:ring-[#e20c0c] cursor-pointer"
                            title="Select status to advance or reverse milestone"
                          >
                            {MILESTONES.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/requests?id=${req.id}`)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Responsive Pagination Footer */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 sm:px-6 py-3.5">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider text-center sm:text-left">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} consignments
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
              >
                Previous
              </button>
              <span className="text-[11px] font-bold text-slate-700 px-2 uppercase tracking-wider">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
