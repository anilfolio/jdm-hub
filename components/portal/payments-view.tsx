"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Building2,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  Info,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { PartRequest } from "@/types/portal";

export function PaymentsView() {
  const {
    requests,
    setIsPaymentModalOpen,
    setPaymentRequest,
    setSelectedRequest,
    openInvoiceModal,
  } = usePortal();
  const [filterStatus, setFilterStatus] = useState<"All" | "Unpaid" | "Paid">("All");

  // Requests that have payment record, are invoiceable, or in stages Invoicing onwards
  const paymentRequests = requests.filter(
    (r) =>
      r.payment ||
      [
        "Invoicing",
        "Awaiting Payment",
        "Ordered",
        "Shipped",
        "Delivered",
        "Completed",
      ].includes(r.status) ||
      r.quotedValue !== undefined
  );

  const getAmount = (r: PartRequest) => {
    return (
      r.payment?.amount ||
      r.quotedValue ||
      r.customerQuote?.totalAmount ||
      r.costCalculation?.totalCustomerQuote ||
      450.0
    );
  };

  const getInvoiceNumber = (r: PartRequest) => {
    return (
      r.payment?.invoiceNumber ||
      `INV-2026-${r.requestNumber.replace(/[^0-9]/g, "")}`
    );
  };

  const filtered = paymentRequests.filter((r) => {
    const isPaid = r.payment?.status === "Paid";
    const status = isPaid ? "Paid" : "Unpaid";
    if (filterStatus === "All") return true;
    return status === filterStatus;
  });

  const totalPaid = paymentRequests
    .filter((r) => r.payment?.status === "Paid")
    .reduce((sum, r) => sum + getAmount(r), 0);
  const totalUnpaid = paymentRequests
    .filter((r) => r.payment?.status !== "Paid")
    .reduce((sum, r) => sum + getAmount(r), 0);

  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedPayments = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleOpenPaymentModal = (req: PartRequest) => {
    setPaymentRequest(req);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Payment Status & Invoices</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View, generate, and download official JDMHUB GST tax invoices. Review settlement references and bank remittance details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 sm:p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-4 sm:gap-6 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Awaiting Settlement
              </span>
              <span className="font-bold text-amber-600 text-sm sm:text-base">${totalUnpaid.toFixed(2)} NZD</span>
            </div>
            <div className="border-l pl-4 sm:pl-6 border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Total Settled
              </span>
              <span className="font-bold text-emerald-600 text-sm sm:text-base">${totalPaid.toFixed(2)} NZD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Notice Banner */}
      <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">JDMHUB Invoicing & Accounts Receivable Handover</span>
          <p className="text-blue-800 text-[11px] leading-relaxed mt-0.5">
            Tax invoices are issued and attached by administration upon quote approval. Click on any invoice number or the <strong>Invoice</strong> button to view the official PDF, print, or download a copy.
          </p>
        </div>
      </div>

      {/* Filter Tabs (Horizontal Scrollable on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
        {(["All", "Unpaid", "Paid"] as const).map((tab) => {
          const isActive = filterStatus === tab;
          const count =
            tab === "All"
              ? paymentRequests.length
              : tab === "Paid"
              ? paymentRequests.filter((r) => r.payment?.status === "Paid").length
              : paymentRequests.filter((r) => r.payment?.status !== "Paid").length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterStatus(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#e20c0c] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
              }`}
            >
              <span>{tab === "All" ? "All Invoices" : tab}</span>
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

      {/* Invoice Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Sub-header */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{filtered.length}</span>
            <span>invoices matching &quot;{filterStatus}&quot;</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Click any row or invoice number to review payment settlement details
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 sm:py-3.5 px-4 sm:px-6">JDMHUB Invoice #</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4">Request Ref</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4">Description</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4">Amount (NZD)</th>
                <th className="py-3 sm:py-3.5 px-3 sm:px-4">Payment Status</th>
                <th className="py-3 sm:py-3.5 px-4 sm:px-6 text-right">Settlement & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="font-bold text-slate-600 text-sm">No invoice records found</p>
                    <p className="text-xs text-slate-400 mt-1">No invoices match the status &quot;{filterStatus}&quot;.</p>
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((req) => {
                  const pay = req.payment;
                  const isPaid = pay?.status === "Paid";
                  const paymentStatus: "Unpaid" | "Paid" = isPaid ? "Paid" : "Unpaid";
                  const invoiceNum = getInvoiceNumber(req);
                  const amount = getAmount(req);

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">
                        {req.payment?.invoiceUrl ? (
                          <button
                            type="button"
                            onClick={() => openInvoiceModal(req)}
                            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 hover:underline group cursor-pointer text-left"
                            title="Click to view & download official Tax Invoice"
                          >
                            <span className="font-bold">{invoiceNum}</span>
                            <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <span className="text-slate-400 font-medium italic">Pending Upload</span>
                        )}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="text-slate-700 hover:text-[#e20c0c] font-bold hover:underline cursor-pointer"
                          title="Click to view full request details"
                        >
                          {req.requestNumber}
                        </button>
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 max-w-[220px]">
                        <p className="font-semibold text-slate-800 truncate">{req.part?.name || "Component"}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {req.vehicle?.year} {req.vehicle?.make} {req.vehicle?.model}
                        </p>
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 font-bold text-slate-900 whitespace-nowrap">
                        ${amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 sm:py-4 px-3 sm:px-4 whitespace-nowrap">
                        {paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {req.payment?.invoiceUrl && (
                            <button
                              type="button"
                              onClick={() => openInvoiceModal(req)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors shadow-xs cursor-pointer"
                              title="View & Download Invoice"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-600" />
                              <span>Invoice</span>
                            </button>
                          )}
                          {paymentStatus === "Unpaid" ? (
                            <button
                              onClick={() => handleOpenPaymentModal(req)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#e20c0c] hover:bg-[#D81419] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                            >
                              Settlement Details →
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenPaymentModal(req)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-bold text-[11px] rounded-lg transition-colors shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Paid Record</span>
                            </button>
                          )}
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
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 sm:px-6 py-3.5">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} invoices
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
