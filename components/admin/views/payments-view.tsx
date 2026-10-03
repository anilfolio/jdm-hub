"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Search,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  RotateCcw,
  Check,
  FileText,
} from "lucide-react";
import { useUnifiedData } from "@/context/unified-data-context";
import { PaymentStatusBadge } from "../status-badge";

export function PaymentsView() {
  const router = useRouter();
  const { requests, markPaymentPaid, markPaymentUnpaid } = useUnifiedData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Unpaid">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Requests that have a quoted amount or payment record
  const payableRequests = requests.filter(
    (r) =>
      r.status === "Invoicing" ||
      r.status === "Awaiting Payment" ||
      r.status === "Ordered" ||
      r.status === "Shipped" ||
      r.status === "Delivered" ||
      r.status === "Completed" ||
      !!r.payment
  );

  const filtered = payableRequests.filter((r) => {
    const payStatus = r.payment?.status || "Unpaid";
    if (statusFilter !== "All" && payStatus !== statusFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      (r.requestNumber || "").toLowerCase().includes(q) ||
      (r.customerName || "").toLowerCase().includes(q) ||
      (r.payment?.paymentReference && r.payment.paymentReference.toLowerCase().includes(q)) ||
      (r.payment?.invoiceNumber && r.payment.invoiceNumber.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedRequests = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalCollected = payableRequests
    .filter((r) => r.payment?.status === "Paid")
    .reduce((sum, r) => sum + (r.payment?.amount || r.quotedValue || 0), 0);

  const totalOutstanding = payableRequests
    .filter((r) => (r.payment?.status || "Unpaid") === "Unpaid")
    .reduce((sum, r) => sum + (r.payment?.amount || r.quotedValue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
            Total Outstanding (Unpaid)
          </span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            NZ${totalOutstanding.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Awaiting customer payment release
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
            Settled Payments (Paid)
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            NZ${totalCollected.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Cleared & unlocked for purchasing
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
              Payment Gate Rule
            </span>
            <p className="text-xs text-slate-600 mt-1">
              Supplier ordering remains strictly blocked until Payment is marked as <strong>PAID</strong>.
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded self-start mt-2">
            Section 18 Policy
          </span>
        </div>
      </div>

      {/* Filter Bar */}
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
            placeholder="Search Request #, Customer, Invoice, Reference..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e20c0c]/20 focus:border-[#e20c0c] transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
          {(["All", "Unpaid", "Paid"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setStatusFilter(filter);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === filter
                  ? "bg-[#e20c0c] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table (Section 17) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Sub-header info bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-medium">
            Showing <strong className="text-slate-800 font-bold">{filtered.length}</strong> payment record{filtered.length === 1 ? "" : "s"}
          </span>
          <span className="text-[11px] text-slate-400">
            Click any row to open request workflow
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[760px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Request #</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Customer</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-right">Amount (NZD)</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Payment Status</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Payment Reference</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Payment Date</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">Last Updated</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No payment records matching your filter.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => {
                  const pay = req.payment;
                  const isPaid = pay?.status === "Paid";
                  const amt = pay?.amount || req.quotedValue || 0;

                  return (
                    <tr
                      key={req.id}
                      onClick={() => router.push(`/admin/requests?id=${req.id}`)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 font-bold text-slate-700 hover:text-slate-800 hover:underline">
                        {req.requestNumber}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">
                        <span className="font-bold text-slate-900 block">{req.customerName}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400">
                            {pay?.invoiceNumber || `INV-${req.requestNumber.replace("JDM-P-", "").replace("AutoHub-P-", "")}`}
                          </span>
                          {pay?.invoiceUrl && (
                            <a
                              href={pay.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                              title="View PDF"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileText className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-right font-bold text-slate-900">
                        NZ${amt.toFixed(2)}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">
                        <PaymentStatusBadge status={pay?.status || "Unpaid"} size="sm" />
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-slate-700">
                        {pay?.paymentReference || req.requestNumber}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-slate-600">
                        {pay?.paidAt || (isPaid ? "Today" : "Pending")}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-slate-500 text-[11px] whitespace-nowrap">
                        {req.lastUpdated}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {!isPaid ? (
                            <button
                              type="button"
                              onClick={() => markPaymentPaid(req.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              Mark Paid
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => markPaymentUnpaid(req.id)}
                              className="px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              Revert
                            </button>
                          )}
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
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} payment records
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
