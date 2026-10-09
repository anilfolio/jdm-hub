"use client";

import React from "react";
import {
  Printer,
  Download,
  Building2,
  Package,
  Car,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  FileText,
  Truck,
  Plane,
} from "lucide-react";
import { PartRequest } from "@/types/shared";

interface SupplierPoDocumentProps {
  request: PartRequest;
  onClose?: () => void;
  isModal?: boolean;
}

export function SupplierPoDocument({
  request,
  onClose,
  isModal = false,
}: SupplierPoDocumentProps) {
  const order = request.supplierOrder;
  const poNumber = order?.supplierRef || `PO-${request.requestNumber.replace(/[^0-9]/g, "").padStart(6, "0")}`;
  const orderDate = order?.orderDate || new Date().toISOString().split("T")[0];
  const supplierName = order?.supplierName || "Nagoya JDM Spares Co., Ltd.";
  
  const cost = order?.cost || (request.quotedValue ? request.quotedValue * 0.7 : 350);
  const freight = order?.freight || 45;
  const total = cost + freight;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const content = (
    <div className="bg-white text-slate-900 font-sans p-6 sm:p-10 max-w-4xl mx-auto shadow-lg rounded-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:max-w-none">
      {/* Top Header Actions (hidden in print) */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider bg-slate-900 text-white px-3 py-1 rounded-full">
            発注書 / Purchase Order
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">
            {poNumber}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PO (A4)</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* PO Document Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-[#e20c0c]">
              JDM<span className="text-slate-900 not-italic">HUB</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 px-2 py-0.5 border border-slate-200 rounded">
              Trade Global
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            JDMHUB Procurement NZ Ltd<br />
            142 Great South Road, Penrose<br />
            Auckland 1061, New Zealand<br />
            NZBN: 9429048123891 • GST: 134-889-201<br />
            Email: <span className="text-slate-900 font-medium">orders@jdmhub.co.nz</span>
          </p>
        </div>

        <div className="sm:text-right">
          <div className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
            発注書
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Official Purchase Order
          </div>
          <div className="text-xs font-mono space-y-1">
            <p><strong className="text-slate-700">PO Ref:</strong> <span className="font-bold text-[#e20c0c]">{poNumber}</span></p>
            <p><strong className="text-slate-700">Date Issued:</strong> {orderDate}</p>
            <p><strong className="text-slate-700">Internal Ref:</strong> {request.requestNumber}</p>
            <p><strong className="text-slate-700">Handover Hub:</strong> Narita Export Consolidation</p>
          </div>
        </div>
      </div>

      {/* Parties Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            発注先 / Japanese Supplier Vendor
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">{supplierName}</h4>
          <p className="text-slate-600 leading-relaxed font-mono">
            {order?.supplierRef ? `Vendor Quote Ref: ${order.supplierRef}` : "Authorized Sourcing Tier-1 Partner"}<br />
            Export Forwarding: Tokyo / Nagoya Regional Hub<br />
            Contact: Overseas Procurement Desk
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            最終納品先 / Destination Workshop &amp; Hoist Bay
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">{request.customerName}</h4>
          <p className="text-slate-600 leading-relaxed">
            Attn: {request.contactName} ({request.customerPhone})<br />
            {request.deliveryAddress.streetAddress}<br />
            {request.deliveryAddress.suburb ? `${request.deliveryAddress.suburb}, ` : ""}{request.deliveryAddress.city} {request.deliveryAddress.postalCode}, NZ<br />
            <span className="font-semibold text-slate-800">Delivery Note:</span> {request.deliveryAddress.deliveryInstructions || "Deliver to main hoist bay"}
          </p>
        </div>
      </div>

      {/* Vehicle Specification Intake */}
      <div className="py-5 border-b border-slate-200">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-slate-500" />
          <span>対象車両仕様 / Verified Target Vehicle Specifications</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">Make &amp; Model</span>
            <span className="font-bold text-slate-900">{request.vehicle.year} {request.vehicle.make} {request.vehicle.model}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">Chassis / VIN</span>
            <span className="font-bold text-slate-900 text-[#e20c0c]">{request.vehicle.vin}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">Engine / Transmission</span>
            <span className="text-slate-800">{request.vehicle.engine || "Standard OEM"} • {request.vehicle.transmission || "Manual/Auto"}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">NZ Rego Plate</span>
            <span className="text-slate-800">{request.vehicle.registration || "Unregistered / In-Transit"}</span>
          </div>
        </div>
      </div>

      {/* Line Item Table */}
      <div className="py-6 border-b border-slate-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b-2 border-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-left">
              <th className="pb-2">Item / 部品詳細</th>
              <th className="pb-2">OEM Number</th>
              <th className="pb-2">Condition</th>
              <th className="pb-2 text-center">Qty</th>
              <th className="pb-2 text-right">Agreed Amount (NZD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3.5 pr-2">
                <span className="font-bold text-slate-900 block">{request.part.name}</span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Fitment: {request.vehicle.make} {request.vehicle.model} ({request.vehicle.year})
                </span>
              </td>
              <td className="py-3.5 font-mono text-slate-700">
                {request.part.partNumber || "Verified OEM Fitment"}
              </td>
              <td className="py-3.5">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                  {request.part.condition || "Genuine OEM"}
                </span>
              </td>
              <td className="py-3.5 text-center font-bold font-mono">
                {request.part.quantity || 1}
              </td>
              <td className="py-3.5 text-right font-mono font-bold text-slate-900">
                ${cost.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="py-2.5 text-slate-600">
                Japanese Domestic Forwarding &amp; Port Handling Fee
              </td>
              <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                ${freight.toFixed(2)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-900">
              <td colSpan={4} className="pt-3 font-bold text-slate-900 uppercase">
                Total PO Commitment (NZD):
              </td>
              <td className="pt-3 text-right font-mono text-base font-black text-slate-900">
                ${total.toFixed(2)} NZD
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Export Handover & Packing Manifest */}
      <div className="py-5 border-b border-slate-200 text-xs">
        <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-slate-600" />
          <span>出荷・梱包仕様 / Handover &amp; Packaging Instructions</span>
        </h5>
        <div className="bg-amber-50/60 border border-amber-200 p-3.5 rounded-xl text-amber-950 space-y-1.5 leading-relaxed">
          <p>• <strong>Consolidation Point:</strong> Narita International Airport Airfreight Consolidation Bay / Yokohama Port CFS.</p>
          <p>• <strong>Marking Requirements:</strong> Affix weatherproof consignment label referencing <code className="font-bold text-[#e20c0c]">{poNumber}</code> and <code className="font-bold">{request.requestNumber}</code> on all master cartons.</p>
          <p>• <strong>NZ MPI Biosecurity:</strong> Ensure all automotive mechanical parts are cleaned of oil/dirt contaminants as per New Zealand Ministry for Primary Industries border clearance standards.</p>
        </div>
      </div>

      {/* Footer Sign-off */}
      <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <div>
          Authorized by <strong className="text-slate-700">JDMHUB Operations NZ</strong> • Electronically Executed
        </div>
        <div className="font-mono text-[10px]">
          Ref: {request.id} • Generated: {new Date().toISOString()}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
        <div className="w-full max-w-4xl my-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
