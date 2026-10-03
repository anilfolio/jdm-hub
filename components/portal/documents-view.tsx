"use client";

import React, { useState } from "react";
import {
  FolderArchive,
  FileText,
  Download,
  Search,
  FileCheck2,
  ShieldCheck,
  Building2,
  ExternalLink,
  Check,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";

export function DocumentsView() {
  const { requests, activeCustomer, setSelectedRequest, setActiveTab, openInvoiceModal } = usePortal();
  const [docSearch, setDocSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const docs = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      category: "Tax Invoice" | "Quotation" | "Customs & Compliance" | "Fitment Verification" | "Legal & Warranty";
      date: string;
      size: string;
      ref: string;
      vehicleInfo?: string;
      partInfo?: string;
      amount?: string;
    }> = [];

    // Official terms
    list.push({
      id: "policy-terms",
      title: "JDMHUB Trade Customer Procurement Terms v2.4",
      category: "Legal & Warranty",
      date: "01 Aug 2026",
      size: "520 KB",
      ref: "POLICY",
    });

    requests.forEach((req) => {
      const veh = `${req.vehicle?.year || ""} ${req.vehicle?.make || ""} ${req.vehicle?.model || ""}`.trim();
      const prt = req.part?.name || "Component";
      const amt = req.quotedValue || req.customerQuote?.totalAmount || 0;

      // 1. Tax Invoice only if official real PDF invoice attached by admin
      if (req.payment?.invoiceUrl) {
        const invNum = req.payment.invoiceNumber || `INV-2026-${req.requestNumber.replace(/[^0-9]/g, "")}`;
        list.push({
          id: `inv-${req.id}`,
          title: `Tax Invoice ${invNum} (${veh} - ${prt})`,
          category: "Tax Invoice",
          date: req.payment.invoicedAt || req.dateSubmitted || "08 Sep 2026",
          size: "Official PDF",
          ref: req.requestNumber,
          vehicleInfo: veh,
          partInfo: prt,
          amount: amt ? `$${amt.toFixed(2)} NZD` : undefined,
        });
      }

      // 2. Quotation Spec Sheet if quoted or costCalculations exist
      if (
        req.quotedValue ||
        req.customerQuote ||
        req.costCalculation ||
        ["Quoted", "Invoicing", "Awaiting Payment", "Ordered", "Shipped", "Delivered", "Completed"].includes(req.status)
      ) {
        list.push({
          id: `quote-${req.id}`,
          title: `Official Quotation Spec Sheet ${req.requestNumber} (${veh} OEM ${prt})`,
          category: "Quotation",
          date: req.dateSubmitted || "08 Sep 2026",
          size: "245 KB",
          ref: req.requestNumber,
          vehicleInfo: veh,
          partInfo: prt,
          amount: amt ? `$${amt.toFixed(2)} NZD` : undefined,
        });
      }

      // 3. Customs / Waybill if Shipped / Delivered / Completed
      if (req.shipment || ["Shipped", "Delivered", "Completed"].includes(req.status)) {
        const carrier = req.shipment?.carrier || "DHL Express Airfreight";
        list.push({
          id: `customs-${req.id}`,
          title: `NZ Customs MPI Clearance & Consignment (${carrier})`,
          category: "Customs & Compliance",
          date: req.shipment?.dispatchedAt ? req.shipment.dispatchedAt.split("T")[0] : "07 Sep 2026",
          size: "412 KB",
          ref: req.requestNumber,
          vehicleInfo: veh,
          partInfo: prt,
        });
      }
    });

    return list;
  }, [requests]);

  const handleDownload = (doc: (typeof docs)[0]) => {
    if (doc.category === "Tax Invoice") {
      const target = requests.find((r) => r.requestNumber === doc.ref);
      if (target) {
        openInvoiceModal(target);
        setToastMessage(`Opening Official Tax Invoice for ${doc.ref}`);
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }
    }

    if (doc.category === "Tax Invoice") {
      const target = requests.find((r) => r.requestNumber === doc.ref);
      if (target?.payment?.invoiceUrl) {
        const link = document.createElement("a");
        link.href = target.payment.invoiceUrl;
        link.download = target.payment.invoiceFileName || `${doc.title.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setToastMessage(`Downloaded "${doc.title}"`);
        setTimeout(() => setToastMessage(null), 3500);
        return;
      }
    }

    const fileContent = `========================================================
JDMHUB OFFICIAL PROCUREMENT RECORD
========================================================
Document Title : ${doc.title}
Category       : ${doc.category}
Reference      : ${doc.ref}
Date Issued    : ${doc.date}
Document Size  : ${doc.size}
Customer       : ${activeCustomer?.businessName || "SP Motors Ltd"} (${activeCustomer?.contactName || "Contact"})
Delivery Addr  : ${activeCustomer?.deliveryAddress || "Auckland, New Zealand"}
Vehicle        : ${doc.vehicleInfo || "Trade Vehicle Specified"}
Part / Scope   : ${doc.partInfo || "Procured Component"}
Financial Val  : ${doc.amount || "Refer to Schedule"}
Audited By     : JDMHUB Procurement Operations
Status         : Verified Official Record
========================================================
This document is generated from the JDMHUB Trade Portal.
For formal queries contact ops@jdmhub.co.nz
========================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/[^a-zA-Z0-9-_]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`Downloaded "${doc.title}"`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.category.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.ref.toLowerCase().includes(docSearch.toLowerCase())
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;
  React.useEffect(() => {
    setCurrentPage(1);
  }, [docSearch]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedDocs = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  return (
    <div className="space-y-6 relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl font-bold text-xs animate-in slide-in-from-top-3 fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <FolderArchive className="w-4 h-4" />
            <span>Compliance & Records</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Procurement Documents</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official GST tax invoices, supplier packing slips, and export documentation
          </p>
        </div>

        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents or request ID..."
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#e20c0c] focus:ring-1 focus:ring-[#e20c0c] transition-all"
          />
          {docSearch && (
            <button
              onClick={() => setDocSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Operational Invoicing Notice */}
      <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-blue-950 block">JDMHUB Invoicing Notice</span>
          <p className="text-blue-800 text-[11px] leading-relaxed mt-0.5">
            Official GST tax invoices are generated outside this portal within JDMHUB's core operational system. The portal records invoice references and tracks payment status (<strong>Unpaid</strong> / <strong>Paid</strong>).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 text-xs overflow-hidden">
        {paginatedDocs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="font-bold text-slate-600 text-sm">No documents found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query.</p>
          </div>
        ) : (
          paginatedDocs.map((d) => (
            <div
              key={d.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{d.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-[11px] text-slate-500 mt-1">
                    <button
                      onClick={() => {
                        if (d.category === "Tax Invoice") setActiveTab("payments");
                        else if (d.category === "Quotation") setActiveTab("requests");
                        else if (d.category === "Customs & Compliance") setActiveTab("shipments");
                      }}
                      className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-semibold text-slate-700 transition-colors cursor-pointer"
                      title={`View in ${d.category} section`}
                    >
                      {d.category} →
                    </button>
                    <span>{d.date}</span>
                    <span>•</span>
                    <span>{d.size}</span>
                    {d.ref !== "POLICY" ? (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => {
                            const target = requests.find((r) => r.requestNumber === d.ref);
                            if (target) setSelectedRequest(target);
                            else setActiveTab("requests");
                          }}
                          className="text-[#e20c0c] font-bold hover:underline cursor-pointer"
                          title="Open linked request details"
                        >
                          {d.ref}
                        </button>
                      </>
                    ) : (
                      <>
                        <span>•</span>
                        <span className="text-slate-500 font-bold">{d.ref}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {d.category === "Tax Invoice" && (
                  <button
                    onClick={() => {
                      const target = requests.find((r) => r.requestNumber === d.ref);
                      if (target) openInvoiceModal(target);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-xs transition-colors shadow-xs cursor-pointer"
                    title="View official Tax Invoice"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                )}
                <button
                  onClick={() => handleDownload(d)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))
        )}

        {/* Responsive Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60 px-4 sm:px-6 py-3.5 border-t border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} docs
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
