"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { PartRequest, RequestStatus } from "@/types/portal";
import { getStatusBadgeClasses } from "@/lib/status-styles";

export function RequestsView() {
  const {
    requests,
    setSelectedRequest,
    setIsNewRequestModalOpen,
    searchQuery,
    setSearchQuery,
    setIsQuoteModalOpen,
    setQuoteRequest,
    setIsPaymentModalOpen,
    setPaymentRequest,
  } = usePortal();

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Status filter
      if (statusFilter === "Awaiting Action") {
        if (
          (!r.actionType || r.actionType === "none") &&
          r.status !== "Quoted" &&
          !(r.status === "Awaiting Payment" && r.payment?.status !== "Paid")
        )
          return false;
      } else if (statusFilter === "In Procurement") {
        if (
          r.status !== "Sourcing" &&
          r.status !== "Ordered" &&
          r.status !== "Invoicing" &&
          r.status !== "Awaiting Payment"
        )
          return false;
      } else if (statusFilter !== "All") {
        if (r.status !== statusFilter) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchReq = r.requestNumber.toLowerCase().includes(q);
        const matchMake = r.vehicle.make.toLowerCase().includes(q);
        const matchModel = r.vehicle.model.toLowerCase().includes(q);
        const matchVin = r.vehicle.vin.toLowerCase().includes(q);
        const matchPart = r.part.name.toLowerCase().includes(q);
        return matchReq || matchMake || matchModel || matchVin || matchPart;
      }

      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const getStatusBadge = (status: RequestStatus) => {
    return getStatusBadgeClasses(status);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Responsive Segmented Status Tabs & Mobile Dropdown */}
        <div className="flex-1 min-w-0">
          {/* Mobile dropdown (< sm) */}
          <div className="sm:hidden flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Filter:
            </span>
            <select
              id="status-filter-mobile"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#e20c0c] focus:ring-1 focus:ring-[#e20c0c] transition-all cursor-pointer"
            >
              {[
                "All",
                "Awaiting Action",
                "Submitted",
                "Sourcing",
                "Quoted",
                "Invoicing",
                "Awaiting Payment",
                "Ordered",
                "Shipped",
                "Delivered",
                "Completed",
                "Ready for Dispatch",
              ].map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>
          </div>

          {/* Tablet & Desktop Horizontal Scrollable Tab Pills (>= sm) */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
            {[
              "All",
              "Awaiting Action",
              "Submitted",
              "Sourcing",
              "Quoted",
              "Invoicing",
              "Awaiting Payment",
              "Ordered",
              "Shipped",
              "Delivered",
              "Completed",
            ].map((tab) => {
              const isActive = statusFilter === tab;
              const count =
                tab === "All"
                  ? requests.length
                  : tab === "Awaiting Action"
                  ? requests.filter(
                      (r) =>
                        r.status === "Quoted" ||
                        (r.status === "Awaiting Payment" && r.payment?.status !== "Paid") ||
                        (r.actionType && r.actionType !== "none")
                    ).length
                  : requests.filter((r) => r.status === tab).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#e20c0c] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/customer/requests/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-[#e20c0c] hover:bg-[#D81419] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs shadow-red-500/20 active:scale-[0.98] transition-all shrink-0 cursor-pointer self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Parts Request</span>
        </Link>
      </div>

      {/* Requests Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Sub-header Info */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{filteredRequests.length}</span>
            <span>{filteredRequests.length === 1 ? "request" : "requests"} listed</span>
            {statusFilter !== "All" && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                Filtered: {statusFilter}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            Click any row to open request details & lifecycle audit
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[760px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 sm:py-3.5 px-4 sm:px-6">Request ID</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4">Vehicle Specs</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4">Part Details</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4">Date Submitted</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4">Status</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4">Quoted Value</th>
                <th className="py-3 sm:py-3.5 px-4 sm:px-6 text-right">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-bold text-slate-600 text-sm">No requests found</p>
                    <p className="text-xs text-slate-400 mt-1">No requests match your selected filter criteria.</p>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Request Number */}
                    <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-bold text-slate-900 group-hover:text-[#e20c0c] transition-colors whitespace-nowrap">
                      {req.requestNumber}
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-800">
                        {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {req.vehicle.vin}
                      </p>
                    </td>

                    {/* Part */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 max-w-[240px]">
                      <p className="font-semibold text-slate-800 truncate" title={req.part.name}>
                        {req.part.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {req.part.quantity} • {req.part.condition}
                      </p>
                      {req.supporting?.freightPreference && (
                        <p className="text-[11px] text-[#0ea5e9] font-medium mt-0.5">
                          Freight: {req.supporting.freightPreference === "Sea Freight" ? "Ocean Freight" : req.supporting.freightPreference}
                        </p>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 whitespace-nowrap text-slate-500 text-[11px]">
                      {req.dateSubmitted}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {req.status}
                      </span>
                    </td>

                    {/* Quoted Value */}
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 font-bold text-slate-900 whitespace-nowrap">
                      {req.quotedValue ? `$${req.quotedValue.toFixed(2)}` : "Pending Quote"}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      {req.actionType === "review_quote" || req.status === "Quoted" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(req);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e20c0c] hover:bg-[#D81419] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                        >
                          Review Quote →
                        </button>
                      ) : req.actionType === "pay_now" || (req.status === "Awaiting Payment" && req.payment?.status !== "Paid") ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaymentRequest(req);
                            setIsPaymentModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e20c0c] hover:bg-[#D81419] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                        >
                          Pay Now →
                        </button>
                      ) : req.status === "Shipped" ? (
                        <span className="text-blue-600 font-bold text-[11px] inline-flex items-center gap-1 group-hover:underline">
                          <span>Track Shipment →</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 group-hover:text-[#e20c0c] font-semibold inline-flex items-center gap-1">
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Responsive Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 sm:px-6 py-3.5">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} of {filteredRequests.length} requests
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-slate-700 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
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
