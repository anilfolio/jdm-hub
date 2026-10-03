"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Truck, ArrowRight, ShieldCheck, Clock, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { usePortal } from "@/context/portal-context";
import { getStatusBadgeClasses } from "@/lib/status-styles";

export function OrdersView() {
  const router = useRouter();
  const {
    requests,
    setSelectedRequest,
    setActiveTab,
    setIsNewRequestModalOpen,
    openInvoiceModal,
  } = usePortal();

  // Orders in procurement, placed, or fulfilled
  const orderRequests = requests.filter(
    (r) =>
      r.status === "Ordered" ||
      r.status === "Shipped" ||
      r.status === "Delivered" ||
      r.status === "Completed" ||
      r.status === "Invoicing" ||
      r.status === "Awaiting Payment" ||
      r.status === "Sourcing" ||
      r.supplierOrder !== undefined
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(orderRequests.length / ITEMS_PER_PAGE);
  const paginatedOrders = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return orderRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [orderRequests, currentPage]);

  const getStatusColors = (status: string) => {
    return getStatusBadgeClasses(status);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Procurement Orders</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active purchase orders released to international manufacturers & suppliers across the 9-stage lifecycle
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab("shipments")}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>Live Shipments →</span>
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>Invoices & Ledger →</span>
          </button>
        </div>
      </div>

      {orderRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-10 sm:p-12 text-center">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-700 text-sm">No active procurement orders</p>
          <p className="text-xs text-slate-400 mt-1">Submit a new parts request to initiate overseas sourcing and procurement.</p>
          <Link
            href="/customer/requests/new"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#e20c0c] hover:bg-[#D81419] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs shadow-red-500/20 active:scale-[0.98] transition-all"
          >
            New Parts Request →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Sub-header Info */}
          <div className="px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{orderRequests.length}</span>
              <span>active procurement {orderRequests.length === 1 ? "order" : "orders"}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Click any order row to review complete breakdown & tracking
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[760px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 sm:py-3.5 px-4 sm:px-6">Order / Req ID</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">PO Reference</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">Vehicle</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">Part Description</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">Supplier</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">Status</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">Order Value</th>
                  <th className="py-3 sm:py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedOrders.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-bold text-slate-900 group-hover:text-[#e20c0c] transition-colors whitespace-nowrap">
                      {req.requestNumber}
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 font-bold text-slate-700 whitespace-nowrap">
                      {req.supplierOrder?.supplierRef || (
                        <span className="text-slate-400 font-normal">Awaiting PO</span>
                      )}
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 max-w-[200px]">
                      <p className="font-medium text-slate-700 truncate" title={req.part.name}>
                        {req.part.name}
                      </p>
                      {req.supporting?.freightPreference && (
                        <p className="text-[11px] text-[#0ea5e9] font-medium mt-0.5">
                          Freight: {req.supporting.freightPreference === "Sea Freight" ? "Ocean Freight" : req.supporting.freightPreference}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 font-medium text-slate-600 whitespace-nowrap">
                      {req.supplierOrder?.supplierName ||
                        req.supplierQuotations?.find((q) => q.isSelected)?.supplierName ||
                        "JDMHUB Network"}
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${getStatusColors(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 font-bold text-slate-900 whitespace-nowrap">
                      ${(req.quotedValue || req.customerQuote?.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-right space-x-2 whitespace-nowrap">
                      {req.payment?.invoiceUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInvoiceModal(req);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-[11px] shadow-xs cursor-pointer"
                          title="View & Download Official Tax Invoice"
                        >
                          <FileText className="w-3 h-3 text-slate-500" />
                          <span>Invoice</span>
                        </button>
                      )}
                      {req.shipment ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/customer/shipments?id=${req.id}`);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200/60 font-bold rounded-lg transition-colors text-[11px] shadow-xs cursor-pointer"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Track →</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(req);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-[11px] shadow-xs cursor-pointer"
                        >
                          <span>Details →</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Responsive Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 sm:px-6 py-3.5">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, orderRequests.length)} of {orderRequests.length} orders
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
      )}
    </div>
  );
}
