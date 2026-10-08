"use client";

import React, { useState } from "react";
import {
  Printer,
  Download,
  FileText,
  ExternalLink,
  X,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  FileDown,
  Copy,
  Check,
  Package,
  Truck,
  Plane,
} from "lucide-react";
import { PartRequest } from "@/types/shared";
import Link from "next/link";

interface InvoiceDocumentProps {
  request: PartRequest;
  onClose?: () => void;
  onPayNow?: () => void;
  isModal?: boolean;
  standaloneUrl?: string;
}

export function InvoiceDocument({
  request,
  onClose,
  onPayNow,
  isModal = false,
  standaloneUrl,
}: InvoiceDocumentProps) {
  const pay = request.payment;
  const isPaid = pay?.status === "Paid" || request.paymentStatus === "Paid";

  const invoiceNumber =
    pay?.invoiceNumber ||
    `INV-2026-${request.requestNumber.replace(/[^0-9]/g, "").padStart(6, "0")}`;

  const fileName =
    pay?.invoiceFileName || `Tax_Invoice_${invoiceNumber}.pdf`;

  const totalAmount =
    pay?.amount ||
    request.quotedValue ||
    request.customerQuote?.totalAmount ||
    485.0;

  // Calculate GST & subtotal (NZ GST is 15% inclusive: GST = Total * 15 / 115)
  const gstAmount =
    request.customerQuote?.gstAmount ||
    request.quotation?.gstAmount ||
    Number(((totalAmount * 15) / 115).toFixed(2));

  const subtotal = Number((totalAmount - gstAmount).toFixed(2));

  const freightCost =
    request.quoteAcceptance?.freightCost ||
    request.customerQuote?.freightCost ||
    (request.quoteAcceptance?.selectedFreightType === "Air"
      ? request.quotation?.airFreightCost || 85.0
      : request.quotation?.seaFreightCost || 45.0) ||
    45.0;

  const partPrice = Number(Math.max(0, subtotal - freightCost).toFixed(2));

  const hasRealPdf =
    Boolean(pay?.invoiceUrl) &&
    (pay!.invoiceUrl!.startsWith("blob:") ||
      pay!.invoiceUrl!.startsWith("http") ||
      pay!.invoiceUrl!.startsWith("data:"));

  const [viewMode, setViewMode] = useState<"document" | "pdf">("document");
  const [copiedRef, setCopiedRef] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(pay?.paymentReference || request.requestNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const formattedDueDate =
    pay?.dueDate ||
    new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-NZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formattedIssueDate = new Date().toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedAddress = (() => {
    const addr = request.deliveryAddress as any;
    if (!addr) return "Auckland, New Zealand";
    if (typeof addr === "string") return addr;
    const parts = [
      addr.streetAddress,
      addr.suburb,
      addr.city,
      addr.postalCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : addr.label || "Auckland, New Zealand";
  })();

  const isAirFreight = request.quoteAcceptance?.selectedFreightType === "Air";

  return (
    <div className="w-full flex flex-col space-y-4 sm:space-y-6">
      {/* Top Action Bar - Hidden in Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs print:hidden">
        {/* Left: Metadata */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e20c0c] to-[#ED2025] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide">
                {invoiceNumber}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border whitespace-nowrap ${
                  isPaid
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {isPaid ? "Paid in Full" : "Awaiting Settlement"}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate">
              Official IRD GST Commercial Tax Invoice • NZBN: 9429038291024
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {/* Toggle between rendered invoice and uploaded PDF if real PDF attached */}
          {hasRealPdf && (
            <div className="bg-slate-100 p-0.5 rounded-xl flex items-center text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setViewMode("document")}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                  viewMode === "document"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "hover:text-slate-900"
                }`}
              >
                Tax Invoice
              </button>
              <button
                type="button"
                onClick={() => setViewMode("pdf")}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                  viewMode === "pdf"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "hover:text-slate-900"
                }`}
              >
                PDF File
              </button>
            </div>
          )}

          {/* Print Tax Invoice */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none justify-center px-3 sm:px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            title="Print Official GST Tax Invoice"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>

          {/* Download Button */}
          {hasRealPdf && pay?.invoiceUrl ? (
            <a
              href={pay.invoiceUrl}
              download={fileName}
              className="flex-1 sm:flex-none justify-center px-3 sm:px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              title="Download official attached PDF invoice"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none justify-center px-3 sm:px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              title="Save Tax Invoice as PDF via Print Dialog"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-600" />
              <span>Save PDF</span>
            </button>
          )}

          {/* Pay Now Button if Unpaid */}
          {!isPaid && onPayNow && (
            <button
              type="button"
              onClick={onPayNow}
              className="w-full sm:w-auto justify-center px-4 py-2 bg-[#e20c0c] hover:bg-[#b80a0a] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              title="Pay Now / Settlement Instructions"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay Now (${totalAmount.toFixed(2)} NZD)</span>
            </button>
          )}

          {/* Standalone full-page link if rendered in modal */}
          {isModal && standaloneUrl && (
            <Link
              href={standaloneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors hidden sm:block"
              title="Open full page in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}

          {/* Close button if modal */}
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors ml-1 cursor-pointer"
              title="Close invoice viewer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Uploaded PDF view if user toggled to it */}
      {viewMode === "pdf" && hasRealPdf && pay?.invoiceUrl ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col w-full max-w-5xl mx-auto">
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#e20c0c] flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{fileName}</h3>
                <p className="text-xs text-slate-500">
                  Official PDF attached by JDMHUB Accounts
                </p>
              </div>
            </div>
            <a
              href={pay.invoiceUrl}
              download={fileName}
              className="px-3.5 py-1.5 bg-[#e20c0c] text-white text-xs font-bold rounded-lg hover:bg-[#b80a0a] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
          <div className="w-full h-[600px] sm:h-[750px] bg-slate-100">
            <iframe
              src={pay.invoiceUrl}
              className="w-full h-full border-none"
              title="Official Uploaded Tax Invoice PDF"
            />
          </div>
        </div>
      ) : (
        /* Official IRD-Compliant Generated GST Tax Invoice Document */
        <div
          id="jdmhub-tax-invoice"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm max-w-4xl mx-auto w-full p-4 sm:p-8 md:p-10 text-slate-900 font-sans relative overflow-hidden print:border-none print:shadow-none print:p-0 print:max-w-none"
        >
          {/* Top Brand Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#e20c0c] via-red-600 to-slate-900 print:hidden" />

          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-200">
            {/* Left: JDMHUB Branding */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#e20c0c] flex items-center justify-center text-white font-black text-sm tracking-wider shadow-sm">
                  JD
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                    JDM<span className="text-[#e20c0c]">HUB</span>
                  </h1>
                  <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">
                    Procurement &amp; Global Logistics NZ
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-0.5 mt-2.5 leading-relaxed">
                <p className="font-bold text-slate-800">
                  JDMHUB Procurement NZ Ltd
                </p>
                <p>14 Customs St East, Auckland CBD 1010, New Zealand</p>
                <p className="flex flex-wrap gap-x-2">
                  <span>
                    <strong className="text-slate-700">NZBN:</strong> 9429038291024
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-700">GST:</strong> 112-984-291
                  </span>
                </p>
                <p>
                  Email: accounts@jdmhub.co.nz • Web: www.jdmhub.co.nz
                </p>
              </div>
            </div>

            {/* Right: Invoice Metadata & Stamp */}
            <div className="sm:text-right flex flex-col sm:items-end">
              <div className="inline-block bg-slate-900 text-white px-3.5 py-1 rounded-md text-[11px] font-black tracking-widest uppercase mb-2 shadow-xs self-start sm:self-auto">
                Commercial Tax Invoice
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex sm:justify-end gap-1.5">
                  <span className="text-slate-400 font-medium">Invoice No:</span>
                  <span className="font-black text-slate-900 tracking-wide">
                    {invoiceNumber}
                  </span>
                </div>
                <div className="flex sm:justify-end gap-1.5">
                  <span className="text-slate-400 font-medium">Date of Issue:</span>
                  <span className="font-bold text-slate-800">
                    {formattedIssueDate}
                  </span>
                </div>
                <div className="flex sm:justify-end gap-1.5">
                  <span className="text-slate-400 font-medium">Payment Due:</span>
                  <span className="font-bold text-slate-800">
                    {formattedDueDate}
                  </span>
                </div>
                <div className="flex sm:justify-end gap-1.5">
                  <span className="text-slate-400 font-medium">GST Registered:</span>
                  <span className="font-bold text-emerald-700">
                    Yes (15% Included)
                  </span>
                </div>
              </div>

              {/* Status Stamp */}
              <div className="mt-2.5 sm:mt-3 self-start sm:self-auto">
                {isPaid ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border-2 border-emerald-500 text-emerald-700 font-black text-xs uppercase tracking-wider shadow-2xs rotate-[-1.5deg]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span>PAID IN FULL</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border-2 border-amber-500 text-amber-700 font-black text-xs uppercase tracking-wider shadow-2xs rotate-[-1.5deg]">
                    <Clock className="w-3.5 h-3.5 text-amber-600 stroke-[3]" />
                    <span>AWAITING PAYMENT</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Billed To & Procurement Reference (Responsive 2-Col Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 py-5 sm:py-6 border-b border-slate-200 text-xs">
            {/* Bill To */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To (Customer Account)
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {request.customerName || "Trade Customer"}
              </p>
              {request.contactName && (
                <p className="text-slate-600">
                  <span className="text-slate-400 font-medium">Attn: </span>
                  {request.contactName}
                </p>
              )}
              <p className="text-slate-600">
                <span className="text-slate-400 font-medium">Address: </span>
                {formattedAddress}
              </p>
              {request.customerEmail && (
                <p className="text-slate-600 break-all">
                  <span className="text-slate-400 font-medium">Email: </span>
                  {request.customerEmail}
                </p>
              )}
              {request.customerPhone && (
                <p className="text-slate-600">
                  <span className="text-slate-400 font-medium">Phone: </span>
                  {request.customerPhone}
                </p>
              )}
            </div>

            {/* Consignment & Vehicle Details */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Consignment &amp; Order Reference
              </span>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500 font-medium">Request Ref:</span>
                <span className="font-bold text-slate-900">
                  {request.requestNumber}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500 font-medium">Vehicle:</span>
                <span className="font-bold text-slate-900 text-right">
                  {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500 font-medium">Chassis / VIN:</span>
                <span className="font-mono font-bold text-slate-800 text-[11px]">
                  {request.vehicle.vin}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500 font-medium">Transit Routing:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {isAirFreight
                    ? "Air Express (Tokyo -> Auckland)"
                    : "Ocean Freight (Yokohama -> Ports of Auckland)"}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items: DESKTOP Table View (Hidden on mobile < 640px) */}
          <div className="py-5 sm:py-6 border-b border-slate-200 hidden sm:block">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-3">Item / Description</th>
                  <th className="py-3 px-2 text-center">Type / Spec</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-3 text-right">Amount (NZD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Part Item */}
                <tr>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900">{request.part.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Part #: {request.part.partNumber || "Standard Genuine OEM"}
                    </p>
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {request.part.condition}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-center font-bold text-slate-900">
                    {request.part.quantity || 1}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-700">
                    ${(partPrice / (request.part.quantity || 1)).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                    ${partPrice.toFixed(2)}
                  </td>
                </tr>

                {/* Freight Item */}
                <tr>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900">
                      International Freight &amp; Logistics
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isAirFreight
                        ? "Priority Airfreight (Tokyo -> Auckland Courier Express)"
                        : "Consolidated Ocean Container Freight (Yokohama -> Ports of Auckland)"}
                    </p>
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {request.quoteAcceptance?.selectedFreightType || "Sea"}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-center font-bold text-slate-900">
                    1
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-700">
                    ${freightCost.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                    ${freightCost.toFixed(2)}
                  </td>
                </tr>

                {/* Customs & Compliance Clearance */}
                <tr>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900">
                      NZ Customs &amp; MPI Border Clearance
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Import declaration filing, tariff classification &amp; documentation
                    </p>
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      DDP
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-center font-bold text-slate-900">
                    1
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-500">
                    $0.00
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium text-emerald-600">
                    Included
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Line Items: MOBILE Card View (Visible only on < 640px) */}
          <div className="py-4 border-b border-slate-200 sm:hidden space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Itemized Invoice Lines
            </span>

            {/* Line 1: Part */}
            <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#e20c0c] shrink-0" />
                    <p className="font-bold text-slate-900 text-xs truncate">
                      {request.part.name}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-5">
                    Part #: {request.part.partNumber || "Standard Genuine OEM"}
                  </p>
                </div>
                <span className="font-extrabold text-slate-900 text-xs shrink-0">
                  ${partPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200/70 text-slate-700 uppercase">
                  {request.part.condition}
                </span>
                <span>
                  Qty: <strong className="text-slate-800">{request.part.quantity || 1}</strong> × ${(partPrice / (request.part.quantity || 1)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Line 2: Freight */}
            <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {isAirFreight ? (
                      <Plane className="w-3.5 h-3.5 text-[#e20c0c] shrink-0" />
                    ) : (
                      <Truck className="w-3.5 h-3.5 text-[#e20c0c] shrink-0" />
                    )}
                    <p className="font-bold text-slate-900 text-xs">
                      {isAirFreight ? "Air Express Transit" : "Ocean Freight Consolidation"}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-5">
                    {isAirFreight
                      ? "Tokyo -> Auckland Courier Express"
                      : "Yokohama -> Ports of Auckland"}
                  </p>
                </div>
                <span className="font-extrabold text-slate-900 text-xs shrink-0">
                  ${freightCost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200/70 text-slate-700 uppercase">
                  {request.quoteAcceptance?.selectedFreightType || "Sea"}
                </span>
                <span>Qty: 1</span>
              </div>
            </div>

            {/* Line 3: Customs & Port Clearance */}
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800 text-[11px]">
                  NZ Customs &amp; MPI Border Clearance
                </span>
              </div>
              <span className="font-bold text-emerald-700 text-[11px]">
                Included (DDP)
              </span>
            </div>
          </div>

          {/* Financial Breakdown & Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 py-5 sm:py-6 border-b border-slate-200 text-xs">
            {/* Notes / Terms */}
            <div className="sm:max-w-xs space-y-1 text-slate-500">
              <p className="font-bold text-slate-700">Payment Terms:</p>
              <p className="leading-relaxed text-[11px] sm:text-xs">
                Payment required prior to supplier consignment dispatch. Fitment is verified according to provided chassis/VIN details.
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5">
                This document is a Tax Invoice under Section 24 of the Goods and Services Tax Act 1985 (NZ).
              </p>
            </div>

            {/* Totals Table */}
            <div className="w-full sm:w-72 space-y-2 bg-slate-50/70 sm:bg-transparent p-3.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-none border-slate-200/80">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Subtotal (Excl. GST):</span>
                <span className="font-semibold text-slate-900">
                  ${subtotal.toFixed(2)} NZD
                </span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs">
                <span>GST (15% NZ):</span>
                <span className="font-semibold text-slate-900">
                  ${gstAmount.toFixed(2)} NZD
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-200">
                <span>Total Amount Due:</span>
                <span className="text-base text-[#e20c0c]">
                  ${totalAmount.toFixed(2)} NZD
                </span>
              </div>

              {/* Paid Status Breakdown */}
              <div className="pt-2 border-t border-slate-200/80 flex justify-between font-bold text-xs">
                <span className="text-slate-500">Amount Paid:</span>
                <span className={isPaid ? "text-emerald-700" : "text-slate-700"}>
                  {isPaid ? `$${totalAmount.toFixed(2)} NZD` : "$0.00 NZD"}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-xs">
                <span className="text-slate-700">Balance Outstanding:</span>
                <span className={isPaid ? "text-emerald-700" : "text-[#e20c0c]"}>
                  {isPaid ? "$0.00 NZD" : `$${totalAmount.toFixed(2)} NZD`}
                </span>
              </div>
            </div>
          </div>

          {/* Remittance Advice & Bank Deposit Details (Mobile-friendly Cards) */}
          <div className="pt-5 sm:pt-6">
            <div className="border border-dashed border-slate-300 rounded-xl p-3.5 sm:p-5 bg-slate-50/70 text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="font-black text-slate-800 uppercase tracking-wider text-[11px]">
                    Remittance Advice / Direct Credit
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  ANZ New Zealand • Swift: ANZBNZ22
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Account Name
                  </span>
                  <span className="font-bold text-slate-900 truncate block text-xs">
                    JDMHUB Procurement NZ Ltd
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Account Number
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    01-0288-0349821-00
                  </span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-300 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black text-amber-900 block">
                      Mandatory Reference
                    </span>
                    <span className="font-black text-amber-900 text-xs">
                      {pay?.paymentReference || request.requestNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="p-1 hover:bg-amber-100 rounded text-amber-700 cursor-pointer transition-colors"
                    title="Copy reference"
                  >
                    {copiedRef ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Settlement Status Note */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 text-[11px]">
                {isPaid ? (
                  <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Payment verified &amp; ledger reconciled by JDMHUB Finance. Consignment released.
                  </p>
                ) : (
                  <p className="text-slate-500">
                    Please use the mandatory reference <strong className="text-slate-800">{pay?.paymentReference || request.requestNumber}</strong> for automated ledger reconciliation.
                  </p>
                )}
                <span className="text-slate-400 font-medium">
                  Ref: {invoiceNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
