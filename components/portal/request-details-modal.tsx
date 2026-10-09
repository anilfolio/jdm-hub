"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Car,
  Package,
  Clock,
  ShieldCheck,
  Send,
  Truck,
  CheckCircle2,
  FileCheck2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Check,
  Calendar,
  MessageSquare,
  FileText,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Headphones,
  Copy,
  Download,
  ShoppingBag,
  Camera,
  RefreshCw,
  CornerDownRight,
  RotateCcw,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { InvoiceDocument } from "@/components/shared/invoice-document";
import { LegalModal } from "@/components/auth/legal-modal";
import {
  PartRequest,
  RequestStatus,
  ShipmentMilestone,
  QuoteAcceptanceAudit,
  RevisionReasonCategory,
} from "@/types/portal";
import { DEFAULT_PART_IMAGE, handleImageError } from "@/lib/default-images";

export function RequestDetailsModal() {
  const router = useRouter();
  const {
    requests,
    selectedRequest,
    setSelectedRequest,
    acceptQuote,
    rejectQuote,
    requestQuoteRevision,
    addNoteReply,
    sendMessage,
    setIsPaymentModalOpen,
    setPaymentRequest,
    setActiveTab: setPortalTab,
    activeCustomer,
    openInvoiceModal,
    selectedRequestDetailsTab,
    setSelectedRequestDetailsTab,
  } = usePortal();

  // Navigation tabs: overview | quote | shipment | invoice | messages
  const [activeTab, setActiveTab] = useState<"overview" | "quote" | "shipment" | "invoice" | "messages">(
    (selectedRequestDetailsTab as any) || "overview"
  );
  const [showDirectContactModal, setShowDirectContactModal] = useState(false);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  // Quote acceptance verification state
  const [isAcceptingQuote, setIsAcceptingQuote] = useState(false);
  const [verifyVehicle, setVerifyVehicle] = useState(false);
  const [verifyPart, setVerifyPart] = useState(false);
  const [verifyAddress, setVerifyAddress] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false); // Single static acceptance checkbox
  const [termsAcceptedAt, setTermsAcceptedAt] = useState<string | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Quote reject state
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("Local source found faster in NZ");
  const [rejectNotes, setRejectNotes] = useState("");

  // Quote revision state
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);
  const [revisionCategory, setRevisionCategory] = useState<RevisionReasonCategory>("freight_mode");
  const [revisionBudget, setRevisionBudget] = useState("");
  const [revisionFreight, setRevisionFreight] = useState<"Air Freight" | "Sea Freight">("Sea Freight");
  const [revisionPartPreference, setRevisionPartPreference] = useState<"Genuine OEM" | "Aftermarket Quality" | "Used / Tested Grade A">("Aftermarket Quality");
  const [revisionNotes, setRevisionNotes] = useState("");

  // Direct Note reply state
  const [replyingNoteId, setReplyingNoteId] = useState<string | null>(null);
  const [noteReplyContent, setNoteReplyContent] = useState("");

  // In-app conversation chat input
  const [inAppChatInput, setInAppChatInput] = useState("");

  const [selectedFreightType, setSelectedFreightType] = useState<"Air" | "Sea" | null>(null);
  const [quotePhotoLightbox, setQuotePhotoLightbox] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);

  const openLightbox = (photos: string[], index: number = 0) => {
    if (!photos || photos.length === 0) return;
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setQuotePhotoLightbox(photos[index]);
  };

  const formatTimelineTime = (raw: string | undefined): string => {
    if (!raw) return "";
    try {
      if (
        /^\d{1,2}:\d{2}\s?(AM|PM)/i.test(raw) ||
        raw.includes("AM") ||
        raw.includes("PM") ||
        raw.includes("Today") ||
        raw.includes("Yesterday") ||
        raw.includes("Scheduled")
      ) {
        return raw;
      }
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        const timeStr = d.toLocaleTimeString("en-NZ", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const dateStr = d.toLocaleDateString("en-NZ", {
          day: "numeric",
          month: "short",
        });
        return `${timeStr.toUpperCase()} • ${dateStr}`;
      }
    } catch {
      // fallback
    }
    return raw;
  };

  const getMilestoneIcon = (milestone: string, isCompleted: boolean, isCurrent: boolean) => {
    switch (milestone) {
      case "Received At Shipping Facility":
        return <Package className={`w-3.5 h-3.5 ${isCompleted ? "text-blue-600" : isCurrent ? "text-blue-600" : "text-slate-400"}`} />;
      case "In Transit":
        return <Truck className={`w-3.5 h-3.5 ${isCompleted ? "text-cyan-600" : isCurrent ? "text-cyan-600" : "text-slate-400"}`} />;
      case "Arrived in NZ":
        return <MapPin className={`w-3.5 h-3.5 ${isCompleted ? "text-purple-600" : isCurrent ? "text-purple-600" : "text-slate-400"}`} />;
      case "Out For Delivery":
        return <Truck className={`w-3.5 h-3.5 ${isCompleted ? "text-amber-600" : isCurrent ? "text-amber-600" : "text-slate-400"}`} />;
      case "Delivered":
        return <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? "text-emerald-600" : isCurrent ? "text-emerald-600" : "text-slate-400"}`} />;
      default:
        return <Clock className={`w-3.5 h-3.5 ${isCompleted ? "text-slate-600" : isCurrent ? "text-blue-600" : "text-slate-400"}`} />;
    }
  };

  // Sync active tab based on selected request status
  React.useEffect(() => {
    if (selectedRequestDetailsTab && ["overview", "quote", "shipment", "invoice"].includes(selectedRequestDetailsTab)) {
      setActiveTab(selectedRequestDetailsTab as any);
      return;
    }
    if (!selectedRequest) return;
    const req = requests.find((r) => r.id === selectedRequest.id) || selectedRequest;
    if (req.status === "Quoted" && (req.quotation || req.customerQuote)) {
      setActiveTab("quote");
    } else if ((req.status === "Shipped" || req.status === "Delivered") && req.shipment) {
      setActiveTab("shipment");
    } else {
      setActiveTab("overview");
    }
  }, [selectedRequest?.id, selectedRequest?.status, selectedRequestDetailsTab, requests]);

  if (!selectedRequest) return null;

  const req = requests.find((r) => r.id === selectedRequest.id) || selectedRequest;

  // The 9-stage customer-facing lifecycle (Skipping [Approved])
  const LIFECYCLE_STAGES: RequestStatus[] = [
    "Submitted",
    "Sourcing",
    "Quoted",
    "Invoicing",
    "Awaiting Payment",
    "Ordered",
    "Shipped",
    "Delivered",
    "Completed",
  ];

  // The internal shipment milestones
  const SHIPMENT_MILESTONES: ShipmentMilestone[] = [
    "Received At Shipping Facility",
    "In Transit",
    "Arrived in NZ",
    "Out For Delivery",
  ];

  const currentStageIndex = (() => {
    const idx = LIFECYCLE_STAGES.indexOf(req.status);
    if (idx !== -1) return idx;
    if (req.status === "Approved") return LIFECYCLE_STAGES.indexOf("Invoicing");
    if (req.status === "Ready for Dispatch") {
      return LIFECYCLE_STAGES.indexOf("Ordered");
    }
    return -1;
  })();

  const handleStageClick = (stage: RequestStatus) => {
    if (stage === "Submitted" || stage === "Sourcing") {
      setActiveTab("overview");
    } else if (stage === "Quoted") {
      if (req.quotation || req.customerQuote) {
        setActiveTab("quote");
      } else {
        setActiveTab("overview");
      }
    } else if (stage === "Invoicing" || stage === "Awaiting Payment") {
      setActiveTab("invoice");
      setSelectedRequestDetailsTab?.("invoice");
    } else if (["Ordered", "Shipped", "Delivered", "Completed"].includes(stage)) {
      if (req.shipment) {
        setActiveTab("shipment");
      } else {
        setActiveTab("overview");
      }
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedContact(label);
    setTimeout(() => setCopiedContact(null), 2000);
  };

  const handleConfirmAcceptance = () => {
    if (!verifyVehicle || !verifyPart || !verifyAddress || !acceptTerms || !selectedFreightType) return;

    const audit: QuoteAcceptanceAudit = {
      acceptedAt: new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }),
      acceptedBy: activeCustomer?.contactName || req.contactName || "Customer",
      userRole: `Authorized Representative (${activeCustomer?.businessName || req.customerName || "Trade Customer"})`,
      termsAccepted: true, // Static acceptance verified
      termsAcceptedAt: termsAcceptedAt || new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }),
      ipAddress: "112.213.120.14", // Mocked for MVP
      vehicleVerified: true,
      partVerified: true,
      addressVerified: true,
      selectedFreightType: selectedFreightType!,
      freightCost: selectedFreightType === "Air" ? (req.quotation?.airFreightCost || req.customerQuote?.airFreightCost || 0) : (req.quotation?.seaFreightCost || req.customerQuote?.seaFreightCost || req.quotation?.freightCost || req.customerQuote?.freightCost || 45.0),
    };

    acceptQuote(req.id, audit);
    setIsAcceptingQuote(false);
    // Switch directly to the Tax Invoice tab within the current view (no floating popup modal)
    setActiveTab("invoice");
    setSelectedRequestDetailsTab?.("invoice");
  };

  const handleConfirmReject = () => {
    const finalReason = rejectNotes.trim() ? `${rejectReason} — Note: ${rejectNotes.trim()}` : rejectReason;
    rejectQuote(req.id, finalReason);
    setIsRejecting(false);
  };

  const handleConfirmRevision = () => {
    const categoryLabels: Record<RevisionReasonCategory, string> = {
      freight_mode: "Switch Freight Mode (Sea / Air)",
      aftermarket_alternative: "Lower-cost Aftermarket / Used Alternative",
      price_budget: "Counter-Offer / Target Budget",
      part_specification: "Part Specification / Condition Change",
      quantity: "Change Requested Quantity",
      other: "Custom Revision Request",
    };

    requestQuoteRevision(req.id, {
      category: revisionCategory,
      categoryLabel: categoryLabels[revisionCategory],
      targetBudget: revisionBudget ? parseFloat(revisionBudget) : undefined,
      requestedFreightPreference: revisionCategory === "freight_mode" ? revisionFreight : undefined,
      requestedPartPreference: revisionCategory === "aftermarket_alternative" ? revisionPartPreference : undefined,
      notes: revisionNotes.trim() || `Customer requested ${categoryLabels[revisionCategory]}`,
    });

    setIsRequestingRevision(false);
    setRevisionBudget("");
    setRevisionNotes("");
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-200">
      <div className="bg-white w-full rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        {/* Header */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={() => {
                setSelectedRequest(null);
                setSelectedRequestDetailsTab?.("overview");
              }}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs active:scale-95"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#0C101A] text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                JD
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                    {req.requestNumber}
                  </h2>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold uppercase bg-slate-200/90 text-slate-800 whitespace-nowrap">
                    {req.status}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                  {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • Submitted on {req.dateSubmitted}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Contact Desk Button */}
            <button
              type="button"
              onClick={() => setShowDirectContactModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
              title="Contact Operations Desk"
            >
              <Phone className="w-3.5 h-3.5 text-[#e20c0c]" />
              <span className="hidden sm:inline">Support Desk</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedRequest(null);
                setSelectedRequestDetailsTab?.("overview");
              }}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Visual Lifecycle Stepper Bar (hidden on mobile) */}
        <div className="hidden md:block px-6 py-3 bg-[#111f4e] text-white shrink-0 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {LIFECYCLE_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stage} className="flex items-center flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => handleStageClick(stage)}
                    className="flex flex-col items-center cursor-pointer group hover:opacity-90 transition-opacity"
                    title={`Click to view details for ${stage}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all group-hover:scale-110 ${
                        isPast
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-[#e20c0c] text-white ring-4 ring-red-500/20 animate-pulse"
                          : "bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-white"
                      }`}
                    >
                      {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1 whitespace-nowrap transition-colors ${
                        isCurrent
                          ? "text-white font-bold"
                          : isPast
                          ? "text-emerald-400 font-medium group-hover:text-emerald-300"
                          : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      {stage}
                    </span>
                  </button>

                  {idx < LIFECYCLE_STAGES.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1.5 ${
                        isPast ? "bg-emerald-500" : "bg-slate-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Ultra-Premium Status & Stage Bar (visible only on mobile) */}
        <div className="block md:hidden bg-[#111f4e] text-white px-3.5 py-2.5 shrink-0 border-b border-indigo-950">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#e20c0c] animate-pulse shrink-0" />
              <span className="text-[11px] font-bold text-slate-300">
                Stage {currentStageIndex + 1} of {LIFECYCLE_STAGES.length}:
              </span>
              <span className="text-xs font-black text-white truncate">
                {req.status}
              </span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 shrink-0">
              {Math.round(((currentStageIndex + 1) / LIFECYCLE_STAGES.length) * 100)}% Complete
            </span>
          </div>

          {/* Smooth Gradient Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-[#e20c0c] rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(10, Math.round(((currentStageIndex + 1) / LIFECYCLE_STAGES.length) * 100))}%`,
              }}
            />
          </div>

          {/* Mobile Swipeable Stage Chips with active indicator */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {LIFECYCLE_STAGES.map((stage) => {
              const idx = LIFECYCLE_STAGES.indexOf(stage);
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => handleStageClick(stage)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap flex items-center gap-1 shrink-0 transition-colors ${
                    isCurrent
                      ? "bg-[#e20c0c] text-white ring-1 ring-white/30"
                      : isPast
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isPast && <Check className="w-2.5 h-2.5" />}
                  <span>{stage}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Navigation Tabs (Enhanced Mobile Scroll with Gradient Mask) */}
        <div className="relative border-b border-slate-200 bg-white shrink-0">
          <div className="flex px-2 sm:px-6 text-xs font-bold text-slate-600 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveTab("overview");
                setSelectedRequestDetailsTab?.("overview");
              }}
              className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0 whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-[#e20c0c] text-[#e20c0c]"
                  : "border-transparent hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Overview &amp; Vehicle</span>
            </button>

            {(req.quotation || req.customerQuote) && (
              <button
                onClick={() => {
                  setActiveTab("quote");
                  setSelectedRequestDetailsTab?.("quote");
                }}
                className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0 whitespace-nowrap ${
                  activeTab === "quote"
                    ? "border-[#e20c0c] text-[#e20c0c]"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Quotation &amp; Pricing</span>
                {req.status === "Quoted" && (
                  <span className="w-2 h-2 rounded-full bg-[#e20c0c]" />
                )}
              </button>
            )}

            {req.shipment && (
              <button
                onClick={() => {
                  setActiveTab("shipment");
                  setSelectedRequestDetailsTab?.("shipment");
                }}
                className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0 whitespace-nowrap ${
                  activeTab === "shipment"
                    ? "border-[#e20c0c] text-[#e20c0c]"
                    : "border-transparent hover:text-slate-900"
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Shipment Milestones</span>
              </button>
            )}

            {(req.payment ||
              req.quoteAcceptance ||
              ["Invoicing", "Awaiting Payment", "Ordered", "Shipped", "Delivered", "Completed"].includes(
                req.status
              )) && (
              <button
                onClick={() => {
                  setActiveTab("invoice");
                  setSelectedRequestDetailsTab?.("invoice");
                }}
                className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0 whitespace-nowrap ${
                  activeTab === "invoice"
                    ? "border-[#e20c0c] text-[#e20c0c]"
                    : "border-transparent hover:text-slate-900 text-slate-700"
                }`}
                title="View & Download Official GST Tax Invoice"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Tax Invoice</span>
                {req.payment?.invoiceNumber ? (
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold font-mono">
                    <span className="hidden sm:inline">{req.payment.invoiceNumber}</span>
                    <span className="sm:hidden">INV</span>
                  </span>
                ) : (
                  <span className="text-[10px] bg-red-50 text-[#e20c0c] px-1.5 py-0.5 rounded font-bold">
                    NEW
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab("messages");
                setSelectedRequestDetailsTab?.("messages");
              }}
              className={`py-3 px-3 sm:px-4 border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0 whitespace-nowrap ${
                activeTab === "messages"
                  ? "border-[#e20c0c] text-[#e20c0c]"
                  : "border-transparent hover:text-slate-900"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Messages &amp; Thread</span>
              {(req.messages?.length || 0) > 0 && (
                <span className="text-[10px] bg-red-100 text-[#e20c0c] px-1.5 py-0.2 rounded-full font-bold">
                  {req.messages?.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 md:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-6">
          {/* TAB 1: OVERVIEW & VEHICLE DETAILS */}
          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Top Quick Status Alert */}
              {req.status === "Invoicing" ? (
                <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-indigo-950">
                        Quote Accepted — Invoicing in Progress
                      </h4>
                      <p className="text-[11px] text-indigo-800 mt-0.5 leading-relaxed">
                        JDMHUB operations is generating and attaching your official GST tax invoice. You will be notified once ready for settlement.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("invoice");
                      setSelectedRequestDetailsTab?.("invoice");
                    }}
                    className="w-full sm:w-auto px-4 py-2 sm:py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm text-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                  >
                    View Invoice Tab →
                  </button>
                </div>
              ) : req.actionRequired && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">
                        Action Required: {req.actionRequired}
                      </h4>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        Please review quotation or approve payment to avoid logistics delays.
                      </p>
                    </div>
                  </div>
                  {req.status === "Quoted" && (
                    <button
                      onClick={() => setActiveTab("quote")}
                      className="w-full sm:w-auto px-4 py-2 sm:py-1.5 bg-[#e20c0c] hover:bg-[#D81419] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm text-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                    >
                      Review Quote →
                    </button>
                  )}
                  {req.status === "Awaiting Payment" && req.payment?.status !== "Paid" && (
                    <button
                      onClick={() => {
                        setPaymentRequest(req);
                        setIsPaymentModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-4 py-2 sm:py-1.5 bg-[#e20c0c] hover:bg-[#D81419] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm text-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                    >
                      Record Settlement (Unpaid) →
                    </button>
                  )}
                </div>
              )}

              {/* Revision Requested Alert Banner */}
              {req.customerResponse === "Revision Requested" && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                        <span>Quote Revision &amp; Counter-Offer Logged</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                          Pending Revision v2
                        </span>
                      </h4>
                      <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                        You requested a revision ({req.quoteRevisionRequest?.categoryLabel || "Specification alternative"}). JDMHUB operations is preparing revised pricing.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("quote")}
                    className="w-full sm:w-auto px-4 py-2 sm:py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm text-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                  >
                    View Revision Details →
                  </button>
                </div>
              )}

              {/* Quotation Ready Highlight Banner in Overview */}
              {(req.quotation || req.customerQuote) && (
                <div className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50/90 via-white to-slate-50 border border-red-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#e20c0c] text-white">
                        Quotation Ready
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {(req.quotation || req.customerQuote)?.oemNumber ? `OEM Ref: ${(req.quotation || req.customerQuote)?.oemNumber}` : "Verified Part"}
                      </span>
                      {req.status === "Quoted" && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Awaiting Customer Action
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {(req.quotation || req.customerQuote)?.itemDescription}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 italic">
                      &ldquo;{(req.quotation || req.customerQuote)?.notes || "Genuine OEM part inspected and verified by JDMHUB sourcing specialist."}&rdquo;
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                    {/* Thumbnail previews */}
                    {(() => {
                      const qPhotos = (req.quotation?.quotePhotos || req.customerQuote?.quotePhotos || req.customerQuoteVersions?.[0]?.quotePhotos || []);
                      if (qPhotos.length === 0) return null;
                      return (
                        <div className="flex -space-x-2 overflow-hidden items-center py-1">
                          {qPhotos.slice(0, 3).map((p: string, idx: number) => (
                            <img
                              key={idx}
                              src={p}
                              alt="Quote part preview"
                              className="inline-block h-10 w-10 rounded-lg ring-2 ring-white object-cover shadow-xs cursor-pointer hover:scale-110 transition-transform"
                              onError={handleImageError}
                              onClick={() => {
                                setLightboxPhotos(qPhotos);
                                setLightboxIndex(idx);
                                setQuotePhotoLightbox(p);
                              }}
                            />
                          ))}
                          {qPhotos.length > 3 && (
                            <span className="flex items-center justify-center h-10 w-10 rounded-lg ring-2 ring-white bg-slate-800 text-white text-[10px] font-bold">
                              +{qPhotos.length - 3}
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    <button
                      onClick={() => setActiveTab("quote")}
                      className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>View Quote &amp; Photos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Vehicle Specifications */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Car className="w-4 h-4 text-[#e20c0c]" />
                    <span>Vehicle Information</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-start gap-3 border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 shrink-0">Make &amp; Model:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {req.vehicle.make} {req.vehicle.model} ({req.vehicle.year})
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-3 border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 shrink-0">VIN / Chassis:</span>
                      <span className="font-bold text-slate-800 font-mono break-all text-right">
                        {req.vehicle.vin}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-3 border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 shrink-0">Registration Plate:</span>
                      <span className="font-bold text-slate-800 uppercase font-mono text-right">
                        {req.vehicle.registration || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-3 border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 shrink-0">Engine / Drivetrain:</span>
                      <span className="text-slate-800 text-right">
                        {req.vehicle.engine || "—"} • {req.vehicle.driveConfig || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-slate-500 shrink-0">Transmission:</span>
                      <span className="text-slate-800 text-right">
                        {req.vehicle.transmission || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Part Requirements */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Package className="w-4 h-4 text-[#e20c0c]" />
                    <span>Part Specifications</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-start gap-3 border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 shrink-0">Part Name:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {req.part.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-3 border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 shrink-0">Part Number:</span>
                      <span className="font-bold text-slate-800 font-mono break-all text-right">
                        {req.part.partNumber || "OEM Catalog Lookup Required"}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-3 border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 shrink-0">Quantity:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {req.part.quantity} Unit(s)
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-3 border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 shrink-0">Preference:</span>
                      <span className="font-semibold text-slate-800 text-right">
                        {req.part.preference}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-slate-500 shrink-0">Condition:</span>
                      <span className="font-semibold text-emerald-700 text-right">
                        {req.part.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Notes */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                    <MapPin className="w-4 h-4 text-[#e20c0c]" />
                    <span>Delivery Address &amp; Logistics</span>
                  </div>
                  {(() => {
                    const addr = typeof req.deliveryAddress === "string"
                      ? { label: "Delivery Address", streetAddress: req.deliveryAddress, suburb: "", city: "", postalCode: "", recipientName: req.contactName || "Customer", phone: req.customerPhone || "" }
                      : req.deliveryAddress || { label: "Delivery Address", streetAddress: "—", suburb: "", city: "", postalCode: "", recipientName: "—", phone: "—" };
                    return (
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <p className="font-bold text-slate-800">
                          {addr.label || "Delivery Address"}
                        </p>
                        <p>
                          {addr.streetAddress}{addr.suburb ? `, ${addr.suburb}` : ""}
                        </p>
                        {(addr.city || addr.postalCode) && (
                          <p>
                            {addr.city} {addr.postalCode}
                          </p>
                        )}
                        {(addr.recipientName || addr.phone) && (
                          <p className="text-slate-500 mt-1">
                            Recipient: {addr.recipientName} {addr.phone ? `(${addr.phone})` : ""}
                          </p>
                        )}
                        {req.supporting?.freightPreference && (
                          <p className="text-slate-800 mt-2 pt-2 border-t border-slate-200/60 font-semibold inline-flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-[#0ea5e9]" />
                            <span>Freight Preference: <span className="text-[#0ea5e9]">{req.supporting.freightPreference === "Sea Freight" ? "Ocean Freight" : req.supporting.freightPreference}</span></span>
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                    <FileText className="w-4 h-4 text-[#e20c0c]" />
                    <span>Customer Notes</span>
                  </div>
                  <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                    &ldquo;{req.supporting?.notes || "No special instructions provided."}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUOTATION & ACCEPTANCE */}
          {activeTab === "quote" && (req.quotation || req.customerQuote) && (() => {
            const quote = req.quotation || req.customerQuote!;
            const adminPhotos: string[] = (
              (quote.quotePhotos && quote.quotePhotos.length > 0) ? quote.quotePhotos :
                (req.customerQuote?.quotePhotos && req.customerQuote.quotePhotos.length > 0) ? req.customerQuote.quotePhotos :
                  (req.customerQuoteVersions?.find((v: any) => v.quotePhotos && v.quotePhotos.length > 0)?.quotePhotos) || []
            );
            const customerPhotos: string[] = req.supporting?.photos || [];
            const specialistNote: string = quote.notes || req.customerQuote?.notes || "";
            const customerVisibleNotes = (req.internalNotes || []).filter((n: any) => n.isCustomerVisible);

            return (
              <div className="space-y-4 sm:space-y-6">
                {/* Quote Overview Card */}
                <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Official Quotation
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {quote.itemDescription}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        OEM Ref: {quote.oemNumber || req.part.partNumber || "Verified"} • Supplier Hub:{" "}
                        {quote.supplierLocation || "Japan / Global"}
                      </p>
                      {req.supporting?.freightPreference && (
                        <div className="pt-0.5">
                          <span className="text-[10px] font-bold text-[#e20c0c] bg-red-50 px-2 py-0.5 rounded border border-red-100 inline-flex items-center gap-1">
                            Freight Preference: {req.supporting.freightPreference === "Sea Freight" ? "Ocean Freight" : req.supporting.freightPreference}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-slate-100 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        Total Landed Price
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                        {selectedFreightType ? (
                          <>
                            ${(
                              (quote.subtotal +
                                (selectedFreightType === "Air"
                                  ? quote.airFreightCost || 0
                                  : quote.seaFreightCost || quote.freightCost || 0)) * 1.15
                            ).toFixed(2)}{" "}
                            <span className="text-xs font-bold text-slate-500">NZD</span>
                          </>
                        ) : (
                          <>
                            <span className="text-slate-400">— </span>
                            <span className="text-xs font-bold text-slate-400">NZD</span>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                        {selectedFreightType
                          ? "Includes 15% NZ GST & Freight"
                          : "Select freight option below"}
                      </span>
                    </div>
                  </div>

                  {/* Sourcing Specialist Advisory & Admin Notes */}
                  {(specialistNote || customerVisibleNotes.length > 0) && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-3 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-bold text-amber-950">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold block">Sourcing Specialist Advisory &amp; Admin Notes</span>
                            <span className="text-[10px] text-amber-800 font-normal">Direct notes from JDMHUB Operations &amp; Inspection Team</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 border border-amber-300 self-start sm:self-center shrink-0">
                          Verified by JDMHUB
                        </span>
                      </div>

                      {specialistNote && (
                        <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/70 text-slate-800 leading-relaxed font-normal shadow-xs">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Part Specification &amp; Fitment Advisory</span>
                          </div>
                          <p className="whitespace-pre-wrap text-xs text-slate-800 leading-relaxed">
                            {specialistNote}
                          </p>
                        </div>
                      )}

                      {customerVisibleNotes.length > 0 && (
                        <div className="space-y-2.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Operational Updates &amp; Notes
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("messages");
                                setSelectedRequestDetailsTab?.("messages");
                              }}
                              className="text-[11px] font-bold text-[#e20c0c] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Open In-App Thread</span>
                            </button>
                          </div>
                          {customerVisibleNotes.map((note: any) => (
                            <div key={note.id} className="bg-white/90 p-3 rounded-xl border border-amber-200/90 space-y-2 text-xs shadow-2xs">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                  <span>{note.author || "JDMHUB Operations"}</span>
                                  <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-medium">{note.role || "Specialist"}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 shrink-0">{note.timestamp || note.createdAt}</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{note.text || note.content}</p>

                              {/* Threaded replies */}
                              {note.replies && note.replies.length > 0 && (
                                <div className="pl-3 border-l-2 border-amber-300 space-y-1.5 mt-2 pt-1">
                                  {note.replies.map((rep: any) => (
                                    <div key={rep.id} className="bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 text-[11px]">
                                      <div className="flex items-center justify-between gap-1 font-semibold text-slate-800 mb-0.5">
                                        <span>{rep.author} <span className="text-[9px] text-slate-400 font-normal">({rep.role})</span></span>
                                        <span className="text-[9px] text-slate-400">{rep.timestamp}</span>
                                      </div>
                                      <p className="text-slate-700">{rep.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Inline Reply Form */}
                              {replyingNoteId === note.id ? (
                                <div className="pt-2 border-t border-amber-100 space-y-2">
                                  <textarea
                                    rows={2}
                                    value={noteReplyContent}
                                    onChange={(e) => setNoteReplyContent(e.target.value)}
                                    placeholder="Type your reply to this note..."
                                    className="w-full text-xs p-2 rounded-lg border border-amber-300 focus:outline-none focus:ring-1 focus:ring-[#e20c0c] bg-white"
                                  />
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReplyingNoteId(null);
                                        setNoteReplyContent("");
                                      }}
                                      className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-700 font-bold"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!noteReplyContent.trim()) return;
                                        addNoteReply(req.id, note.id, noteReplyContent.trim());
                                        setNoteReplyContent("");
                                        setReplyingNoteId(null);
                                      }}
                                      className="px-3 py-1 bg-[#e20c0c] hover:bg-[#CC162C] text-white text-[11px] font-bold rounded-lg shadow-2xs"
                                    >
                                      Send Reply
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="pt-1 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReplyingNoteId(note.id);
                                      setNoteReplyContent("");
                                    }}
                                    className="text-[11px] font-bold text-[#e20c0c] hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <CornerDownRight className="w-3 h-3" />
                                    <span>Reply to this Note</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pre-Dispatch Inspection Photos from Admin */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 text-[#e20c0c] flex items-center justify-center shrink-0">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex flex-wrap items-center gap-2">
                            <span>Pre-Dispatch Part Photos &amp; Visual Inspection</span>
                            {adminPhotos.length > 0 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {adminPhotos.length} Photo{adminPhotos.length > 1 ? "s" : ""} Available
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Verified physical inspection photos uploaded by the sourcing hub prior to dispatch.
                          </p>
                        </div>
                      </div>

                      {adminPhotos.length > 0 && (
                        <span className="text-[11px] text-slate-400 italic">
                          Tap any image to expand
                        </span>
                      )}
                    </div>

                    {adminPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
                        {adminPhotos.map((photo: string, idx: number) => (
                          <div
                            key={idx}
                            className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-square bg-slate-900 cursor-pointer active:scale-95 transition-transform"
                            onClick={() => openLightbox(adminPhotos, idx)}
                          >
                            <img
                              src={photo}
                              alt={`Admin inspection photo ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-95 group-hover:opacity-100"
                              onError={handleImageError}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 sm:p-2.5">
                              <span className="text-[10px] font-bold text-white flex items-center gap-1 w-full">
                                <span>Photo {idx + 1} of {adminPhotos.length}</span>
                                <ExternalLink className="w-3 h-3 text-slate-300 ml-auto" />
                              </span>
                            </div>
                            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-[9px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
                              Admin Sourced
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-1.5">
                        <Camera className="w-6 h-6 text-slate-400 mx-auto" />
                        <p className="text-xs font-semibold text-slate-700">Visual Inspection Pending Arrival</p>
                        <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                          High-resolution physical inspection photos will be uploaded by JDMHUB operations upon warehouse arrival before international dispatch.
                        </p>
                      </div>
                    )}

                    {/* Customer Reference Photos Comparison */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Customer Reference Photos (Submitted at Request)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {customerPhotos.length > 0
                            ? `${customerPhotos.length} reference photo${customerPhotos.length > 1 ? "s" : ""}`
                            : "Default reference spec"}
                        </span>
                      </div>
                      {customerPhotos.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {customerPhotos.map((photo: string, idx: number) => (
                            <div
                              key={idx}
                              className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100 cursor-pointer active:scale-95 transition-transform"
                              onClick={() => openLightbox(customerPhotos, idx)}
                            >
                              <img
                                src={photo}
                                alt={`Customer reference ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                onError={handleImageError}
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ExternalLink className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="absolute bottom-1 left-1 text-[8px] font-bold text-white bg-black/60 px-1 rounded">
                                Ref #{idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <div
                            className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 cursor-pointer hover:border-red-300 transition-colors shadow-xs"
                            onClick={() => openLightbox([DEFAULT_PART_IMAGE], 0)}
                          >
                            <img
                              src={DEFAULT_PART_IMAGE}
                              alt="Default OEM Reference"
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">OEM Catalog Schematic Reference</p>
                            <p className="text-[11px] text-slate-500">Standard factory fitment diagram. No custom workshop photos attached at submission.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Freight Selection Options */}
                  {req.status === "Quoted" && !req.quoteAcceptance ? (
                    <div id="freight-selection-section" className="space-y-3 pt-2">
                      {/* Required Selection Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#e20c0c]" />
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Your Freight Option</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${selectedFreightType
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-[#e20c0c] border-red-200 animate-pulse'
                          }`}>
                          {selectedFreightType ? '✓ Selected' : '⚠ Required'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        {/* Air Freight Option */}
                        <div
                          onClick={() => setSelectedFreightType("Air")}
                          className={`relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 active:scale-[0.99] ${selectedFreightType === "Air"
                            ? "border-[#e20c0c] bg-red-50/30 shadow-lg shadow-red-500/10 ring-1 ring-[#e20c0c]/20"
                            : selectedFreightType === null
                              ? "border-slate-300 bg-white hover:border-[#e20c0c]/50 hover:shadow-md"
                              : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                        >
                          {/* Radio indicator */}
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedFreightType === "Air" ? "border-[#e20c0c]" : "border-slate-300"
                            }`}>
                            {selectedFreightType === "Air" && <div className="w-2.5 h-2.5 bg-[#e20c0c] rounded-full" />}
                          </div>

                          <div className="flex items-center gap-2.5 mb-3">
                            <div className={`p-2 rounded-xl ${selectedFreightType === "Air" ? "bg-red-100 text-[#e20c0c]" : "bg-slate-100 text-slate-500"}`}>
                              <Send className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-900 block">Air Express</span>
                              <span className="text-[10px] text-slate-500">Fastest priority route</span>
                            </div>
                          </div>
                          <div className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                            ${((quote.subtotal + (quote.airFreightCost || 0)) * 1.15).toFixed(2)}
                            <span className="text-xs font-bold text-slate-500 ml-1">NZD</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold">7–10 business days</span> transit
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Priority international air cargo. Landed door-to-door.
                          </p>
                        </div>

                        {/* Sea Freight Option */}
                        <div
                          onClick={() => setSelectedFreightType("Sea")}
                          className={`relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 active:scale-[0.99] ${selectedFreightType === "Sea"
                            ? "border-[#e20c0c] bg-red-50/30 shadow-lg shadow-red-500/10 ring-1 ring-[#e20c0c]/20"
                            : selectedFreightType === null
                              ? "border-slate-300 bg-white hover:border-[#e20c0c]/50 hover:shadow-md"
                              : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                        >
                          {/* Radio indicator */}
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedFreightType === "Sea" ? "border-[#e20c0c]" : "border-slate-300"
                            }`}>
                            {selectedFreightType === "Sea" && <div className="w-2.5 h-2.5 bg-[#e20c0c] rounded-full" />}
                          </div>

                          <div className="flex items-center gap-2.5 mb-3">
                            <div className={`p-2 rounded-xl ${selectedFreightType === "Sea" ? "bg-red-100 text-[#e20c0c]" : "bg-slate-100 text-slate-500"}`}>
                              <Truck className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-900 block">Sea Freight</span>
                              <span className="text-[10px] text-emerald-600 font-semibold">Budget-friendly route</span>
                            </div>
                          </div>
                          <div className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                            ${((quote.subtotal + (quote.seaFreightCost || quote.freightCost || 0)) * 1.15).toFixed(2)}
                            <span className="text-xs font-bold text-slate-500 ml-1">NZD</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold">25–40 business days</span> transit
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Economy ocean route. Landed door-to-door.
                          </p>
                          {/* Savings badge */}
                          {(quote.airFreightCost && (quote.seaFreightCost || quote.freightCost)) && (
                            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Save ${(((quote.airFreightCost - (quote.seaFreightCost || quote.freightCost || 0)) * 1.15)).toFixed(2)} NZD
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Validation prompt when no freight selected */}
                      {!selectedFreightType && (
                        <p className="text-[11px] text-[#e20c0c] font-medium text-center py-1">
                          Please select a freight option above to continue
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {req.quoteAcceptance?.selectedFreightType === "Air" ? (
                            <Send className="w-4 h-4 text-[#e20c0c]" />
                          ) : (
                            <Truck className="w-4 h-4 text-[#e20c0c]" />
                          )}
                          <span className="text-xs font-bold text-slate-900">
                            Selected Freight: {req.quoteAcceptance?.selectedFreightType || "Sea"}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                            Locked
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          ${(req.quoteAcceptance?.freightCost || quote.freightCost || 0).toFixed(2)} NZD
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Acceptance Record if already accepted */}
                  {req.quoteAcceptance && (
                    <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Quote Accepted &amp; Order Logged</span>
                        </div>
                        {req.payment && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border self-start sm:self-center ${req.payment.status === "Paid"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                              }`}
                          >
                            Payment: {req.payment.status}
                          </span>
                        )}
                      </div>
                      <p className="text-emerald-700 leading-relaxed">
                        Accepted by {req.quoteAcceptance.acceptedBy} (
                        {req.quoteAcceptance.userRole}) on{" "}
                        {req.quoteAcceptance.acceptedAt}.
                        {req.payment?.invoiceUrl && (
                          <>
                            {" "}JDMHUB Invoice Ref:{" "}
                            <strong className="font-mono">{req.payment.invoiceNumber}</strong> (Issued by JDMHUB Operations).
                          </>
                        )}
                      </p>

                      {/* Accounts Receivable Invoice Handover Action Box - only once invoice PDF uploaded */}
                      {req.payment?.invoiceUrl && (
                        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-emerald-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Accounts Receivable Invoice Handover
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                              <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                                {req.payment?.invoiceNumber || `INV-2026-${req.requestNumber.replace(/[^0-9]/g, "").padStart(4, "0")}`}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                &bull; Total: ${(req.payment?.amount || req.customerQuote?.totalAmount || req.quotedValue || 450).toFixed(2)} NZD
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("invoice");
                                setSelectedRequestDetailsTab?.("invoice");
                              }}
                              className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Invoice Tab</span>
                            </button>
                            <a
                              href={req.payment.invoiceUrl}
                              download={req.payment.invoiceFileName || `Tax_Invoice_${req.payment.invoiceNumber || req.requestNumber}.pdf`}
                              className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                              title="Download official attached PDF invoice"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Supplier Order Handover Active Box */}
                      {req.supplierOrder && (
                        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-indigo-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                              <ShoppingBag className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span>Supplier Order Handover Active</span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                              Purchase Order <strong className="font-mono text-slate-800">{req.supplierOrder.supplierRef}</strong> released to {req.supplierOrder.supplierName}. Handover Route: <span className="font-semibold text-slate-700">{req.supplierOrder.handoverMode || "Consolidated via JDMHUB Hub"}</span>.
                            </p>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-center shrink-0">
                            PO Placed ({req.supplierOrder.orderDate})
                          </span>
                        </div>
                      )}
                      <div className="mt-2 pt-3 border-t border-emerald-200/60 text-[11px] text-emerald-700 flex flex-col gap-1.5">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Particular Terms of Trade digitally accepted by customer on {req.quoteAcceptance.termsAcceptedAt || req.quoteAcceptance.acceptedAt} {req.quoteAcceptance.ipAddress && `(IP: ${req.quoteAcceptance.ipAddress})`}.</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Order Parameters Verified (Vehicle, Part, Delivery Address).</span>
                        </div>
                      </div>
                      {req.status === "Invoicing" ? (
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-emerald-200/60">
                          <div className="flex items-start gap-2 text-xs text-indigo-900 font-medium">
                            <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <span>Official Tax Invoice is being prepared and attached by operations. Ready for settlement shortly.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("invoice");
                              setSelectedRequestDetailsTab?.("invoice");
                            }}
                            className="text-xs text-indigo-700 font-bold hover:underline cursor-pointer shrink-0"
                          >
                            Preview Invoice Tab →
                          </button>
                        </div>
                      ) : (!req.payment || req.payment.status === "Unpaid") ? (
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-emerald-200/60">
                          <button
                            onClick={() => {
                              setPaymentRequest(req);
                              setIsPaymentModalOpen(true);
                            }}
                            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#e20c0c] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Record Settlement (Status: Unpaid) →</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(null);
                              setPortalTab("payments");
                            }}
                            className="text-xs text-emerald-900 font-bold hover:underline cursor-pointer shrink-0 py-1"
                          >
                            View Billing &amp; Payments Tab →
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Revision Requested Status Banner on Quote Tab */}
                  {req.customerResponse === "Revision Requested" && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-bold text-amber-950">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                            <RefreshCw className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-amber-950">
                              Quote Revision Request Logged (Pending Revision v2)
                            </h4>
                            <p className="text-[11px] text-amber-800 font-normal">
                              Your counter-offer parameters have been forwarded to JDMHUB Operations. Sourcing specialists are preparing a revised quote.
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 border border-amber-300 self-start sm:self-center">
                          Awaiting v2 Quote
                        </span>
                      </div>

                      <div className="bg-white/95 p-3.5 rounded-xl border border-amber-200 text-xs space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 block font-medium">Category:</span>
                            <span className="font-bold text-slate-900">{req.quoteRevisionRequest?.categoryLabel || "Revision"}</span>
                          </div>
                          {req.quoteRevisionRequest?.targetBudget && (
                            <div>
                              <span className="text-slate-400 block font-medium">Target Landed Budget:</span>
                              <span className="font-bold text-[#e20c0c]">NZ${req.quoteRevisionRequest.targetBudget.toFixed(2)}</span>
                            </div>
                          )}
                          {req.quoteRevisionRequest?.requestedFreightPreference && (
                            <div>
                              <span className="text-slate-400 block font-medium">Requested Freight:</span>
                              <span className="font-bold text-blue-900">{req.quoteRevisionRequest.requestedFreightPreference}</span>
                            </div>
                          )}
                          {req.quoteRevisionRequest?.requestedPartPreference && (
                            <div>
                              <span className="text-slate-400 block font-medium">Part Preference:</span>
                              <span className="font-bold text-slate-900">{req.quoteRevisionRequest.requestedPartPreference}</span>
                            </div>
                          )}
                        </div>

                        {req.quoteRevisionRequest?.notes && (
                          <div className="pt-2 border-t border-amber-100">
                            <span className="text-slate-400 block text-[10px] font-bold uppercase">Feedback &amp; Notes:</span>
                            <p className="text-slate-800 italic mt-0.5">&ldquo;{req.quoteRevisionRequest.notes}&rdquo;</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                        <span className="text-slate-500 text-[11px]">Need to amend requirements or ask questions?</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsRequestingRevision(true)}
                            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                          >
                            Update Counter-Offer
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("messages");
                              setSelectedRequestDetailsTab?.("messages");
                            }}
                            className="text-[11px] font-bold text-[#e20c0c] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>In-App Messages →</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons if in Quoted status */}
                  {req.status === "Quoted" && !isAcceptingQuote && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsRejecting(true)}
                          className="w-full sm:w-auto px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors text-center cursor-pointer active:scale-95"
                        >
                          Decline Quote
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsRequestingRevision(true)}
                          className="w-full sm:w-auto px-4 py-2.5 text-xs bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                          <span>Request Quote Revision / Alternative</span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("messages");
                            setSelectedRequestDetailsTab?.("messages");
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                          <span>In-App Messages</span>
                        </button>
                        <button
                          onClick={() => {
                            if (!selectedFreightType) {
                              const el = document.getElementById('freight-selection-section');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              return;
                            }
                            setIsAcceptingQuote(true);
                          }}
                          className={`w-full sm:w-auto px-6 py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${selectedFreightType
                            ? 'bg-[#e20c0c] hover:bg-[#9B0A0F] text-white shadow-red-500/25'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                            }`}
                        >
                          <FileCheck2 className="w-4 h-4" />
                          <span>Review &amp; Accept Quote</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Single Static Terms Verification Checklist Before Acceptance */}
                  {isAcceptingQuote && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-black space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="border-b border-slate-200 pb-3 sm:pb-4">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#e20c0c] shrink-0" />
                          <span>Quote Acceptance — Final Review</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Please review the details below and confirm all information is correct before accepting this quotation.
                        </p>
                      </div>

                      {/* Prominent Admin Comments in Acceptance */}
                      {(specialistNote || customerVisibleNotes.length > 0) && (
                        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900">
                            <MessageSquare className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Specialist Note from JDMHUB</span>
                          </div>
                          {specialistNote && (
                            <p className="text-amber-950 font-medium leading-relaxed whitespace-pre-wrap bg-white/70 p-3 rounded-lg border border-amber-200/60">
                              {specialistNote}
                            </p>
                          )}
                          {customerVisibleNotes.map((note: any) => (
                            <div key={note.id} className="text-amber-900 text-[11px] bg-white/50 p-2 rounded border border-amber-200/40">
                              <strong>Note:</strong> {note.content}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Prominent Admin Photos in Acceptance */}
                      {adminPhotos.length > 0 && (
                        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <Camera className="w-4 h-4 text-[#e20c0c] shrink-0" />
                              <span>Pre-Dispatch Part Photos ({adminPhotos.length})</span>
                            </div>
                            <span className="text-[10px] text-slate-500">Tap to expand</span>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5">
                            {adminPhotos.map((photo: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-square bg-slate-50 cursor-pointer active:scale-95 transition-transform"
                                onClick={() => openLightbox(adminPhotos, idx)}
                              >
                                <img
                                  src={photo}
                                  alt={`Part photo ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                  onError={handleImageError}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Selected Freight Summary */}
                      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          {selectedFreightType === "Air" ? (
                            <Send className="w-4 h-4 text-[#e20c0c] shrink-0" />
                          ) : (
                            <Truck className="w-4 h-4 text-[#e20c0c] shrink-0" />
                          )}
                          <span className="font-bold text-slate-900">
                            {selectedFreightType === "Air" ? "Air Express" : "Sea Freight"} — {selectedFreightType === "Air" ? "7–10 days" : "25–40 days"}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-[#e20c0c]">
                          ${(
                            (quote.subtotal +
                              (selectedFreightType === "Air"
                                ? quote.airFreightCost || 0
                                : quote.seaFreightCost || quote.freightCost || 0)) * 1.15
                          ).toFixed(2)} NZD
                        </span>
                      </div>

                      {/* Verification Checklist */}
                      <div className="space-y-2.5 text-xs">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verification Checklist</p>
                        {/* 1. Vehicle verification */}
                        <label className="flex items-start sm:items-center gap-2.5 sm:gap-3 cursor-pointer p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={verifyVehicle}
                            onChange={(e) => setVerifyVehicle(e.target.checked)}
                            className="w-4 h-4 rounded text-[#e20c0c] focus:ring-0 shrink-0 mt-0.5 sm:mt-0"
                          />
                          <span className="leading-relaxed">
                            <strong>Verify Vehicle Information:</strong> {req.vehicle.year}{" "}
                            {req.vehicle.make} {req.vehicle.model} (VIN:{" "}
                            <span className="font-mono break-all">{req.vehicle.vin}</span>)
                          </span>
                        </label>

                        {/* 2. Part verification */}
                        <label className="flex items-start sm:items-center gap-2.5 sm:gap-3 cursor-pointer p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={verifyPart}
                            onChange={(e) => setVerifyPart(e.target.checked)}
                            className="w-4 h-4 rounded text-[#e20c0c] focus:ring-0 shrink-0 mt-0.5 sm:mt-0"
                          />
                          <span className="leading-relaxed">
                            <strong>Verify Part Information:</strong> {req.part.name} (Qty:{" "}
                            {req.part.quantity}, {req.part.condition})
                          </span>
                        </label>

                        {/* 3. Delivery address */}
                        <label className="flex items-start sm:items-center gap-2.5 sm:gap-3 cursor-pointer p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={verifyAddress}
                            onChange={(e) => setVerifyAddress(e.target.checked)}
                            className="w-4 h-4 rounded text-[#e20c0c] focus:ring-0 shrink-0 mt-0.5 sm:mt-0"
                          />
                          <span className="leading-relaxed">
                            <strong>Verify Delivery Address:</strong>{" "}
                            {typeof req.deliveryAddress === "string"
                              ? req.deliveryAddress
                              : `${req.deliveryAddress?.streetAddress || ""}, ${req.deliveryAddress?.city || ""}`}
                          </span>
                        </label>

                        {/* 4. Single static acceptance checkbox */}
                        <div className={`p-3 rounded-xl border transition-all ${acceptTerms ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200 hover:border-slate-300"
                          }`}>
                          <label className="flex items-start sm:items-center gap-2.5 sm:gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={acceptTerms}
                              onChange={(e) => {
                                if (!acceptTerms) {
                                  e.preventDefault();
                                  setShowTermsModal(true);
                                } else {
                                  setAcceptTerms(false);
                                }
                              }}
                              onClick={(e) => {
                                if (!acceptTerms) {
                                  e.preventDefault();
                                  setShowTermsModal(true);
                                }
                              }}
                              className="w-4 h-4 rounded text-[#e20c0c] focus:ring-0 cursor-pointer shrink-0 mt-0.5 sm:mt-0"
                            />
                            <span className="text-xs text-slate-800 leading-relaxed">
                              <strong>Accept Procurement Terms:</strong> I agree to the{" "}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowTermsModal(true);
                                }}
                                className="text-[#e20c0c] font-bold hover:underline cursor-pointer"
                              >
                                Particular Terms of Trade
                              </button>{" "}
                              and Privacy Policy
                            </span>
                          </label>
                          {acceptTerms && termsAcceptedAt && (
                            <p className="text-[11px] font-medium text-emerald-700 mt-1.5 ml-6 sm:ml-7 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Particular Terms of Trade viewed and accepted ({termsAcceptedAt})</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pt-4 border-t border-slate-200">
                        <button
                          onClick={() => {
                            setIsAcceptingQuote(false);
                            setVerifyVehicle(false);
                            setVerifyPart(false);
                            setVerifyAddress(false);
                            setAcceptTerms(false);
                          }}
                          className="w-full sm:w-auto text-center justify-center text-xs sm:text-sm bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium transition-colors cursor-pointer active:scale-95"
                        >
                          ← Back to Quote
                        </button>
                        <button
                          disabled={
                            !verifyVehicle || !verifyPart || !verifyAddress || !acceptTerms
                          }
                          onClick={handleConfirmAcceptance}
                          className="w-full sm:w-auto text-center justify-center px-6 py-2.5 bg-[#e20c0c] hover:bg-[#d31318] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white font-bold text-xs sm:text-sm uppercase rounded-xl shadow-md shadow-red-500/20 transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>Confirm Acceptance &amp; Record Order</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 3: SHIPMENT TRACKING & INTERNAL LOGISTICS MILESTONES */}
          {activeTab === "shipment" && req.shipment && (
            <div className="space-y-4 sm:space-y-6">
              {/* Carrier card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Assigned Freight Carrier
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {req.shipment.carrier}
                  </h3>
                </div>

                <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-slate-100 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Estimated Delivery
                  </span>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {req.shipment.estimatedDelivery}
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center sm:justify-end gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    On Schedule
                  </span>
                </div>
              </div>

              {/* Evidence Media Block */}
              {(req.supporting?.photos || []).length > 0 && (
                <div className="p-4 sm:p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3.5 sm:space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-900 uppercase tracking-wider">
                        Supplier Verified Evidence
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        Visual evidence verified by JDMHUB before dispatch
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                    {req.supporting?.photos?.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-emerald-200 cursor-pointer active:scale-95 transition-transform" onClick={() => openLightbox(req.supporting?.photos || [], idx)}>
                        <img
                          src={url}
                          alt={`Evidence Media ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Logistics Milestones within Shipped Stage */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Internal Logistics Milestones
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    Real-time operational tracking from international facility to workshop
                  </p>
                </div>

                <div className="relative pl-6 space-y-4 sm:space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {req.shipment.milestonesHistory.map((m, idx) => {
                    const isCurrent =
                      req.shipment?.currentMilestone === m.milestone;
                    return (
                      <div key={idx} className="relative flex items-start gap-4">
                        {/* Timeline node */}
                        <div
                          className={`absolute -left-6 mt-1 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center shadow-xs transition-colors ${
                            isCurrent
                              ? "border-[#2B4499] ring-2 ring-blue-100"
                              : m.isCompleted
                                ? "border-slate-300"
                                : "border-slate-200"
                          }`}
                        >
                          {getMilestoneIcon(m.milestone, m.isCompleted, isCurrent)}
                        </div>

                        {/* Card item */}
                        <div className="flex-1 bg-slate-50/70 p-3.5 sm:p-4 rounded-xl border border-slate-200/80">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                {m.milestone}
                              </h4>
                              {m.location && (
                                <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                  {m.location}
                                </span>
                              )}
                              {isCurrent && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#2B4499]">
                                  Current Milestone
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium sm:text-right shrink-0">
                              {formatTimelineTime(m.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">Need full tracking dashboard?</span>
                  <button
                    onClick={() => {
                      const id = selectedRequest.id;
                      setSelectedRequest(null);
                      router.push(`/customer/shipments?id=${encodeURIComponent(id)}`);
                    }}
                    className="inline-flex items-center gap-1.5 font-bold text-[#e20c0c] hover:underline cursor-pointer"
                  >
                    <span>Open in Full Shipments View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TAX INVOICE (Within the tab, NOT modal) */}
          {activeTab === "invoice" && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
              <InvoiceDocument
                request={req}
                isModal={false}
                onPayNow={() => {
                  setPaymentRequest(req);
                  setIsPaymentModalOpen(true);
                }}
                standaloneUrl={`/customer/invoice/${req.id}`}
              />
            </div>
          )}

          {/* TAB 5: IN-APP REQUEST MESSAGES & DIRECT CONVERSATION */}
          {activeTab === "messages" && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#e20c0c] font-black shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                        <span>Request Message Thread — {req.requestNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                          Live Sourcing Desk
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Two-way direct communication between {activeCustomer.businessName} and JDMHUB Operations.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDirectContactModal(true)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-bold inline-flex items-center gap-1 self-start sm:self-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>External Support Desk</span>
                  </button>
                </div>

                {/* Message Stream */}
                <div className="space-y-3 min-h-[260px] max-h-[460px] overflow-y-auto p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
                  {(!req.messages || req.messages.length === 0) ? (
                    <div className="text-center py-12 text-xs text-slate-400 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-slate-700">No messages in this request yet.</p>
                      <p className="text-[11px] max-w-md mx-auto">Send an in-app inquiry below to discuss part fitment, request alternative sourcing, or ask questions directly about this vehicle order.</p>
                    </div>
                  ) : (
                    req.messages.map((msg: any) => {
                      const isCustomer = msg.senderType === "customer" || msg.senderRole === "Customer" || msg.senderName === (req.contactName || activeCustomer.contactName);
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isCustomer ? "items-end" : "items-start"} space-y-1`}
                        >
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                            <span className="font-bold text-slate-700">{msg.senderName}</span>
                            <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-slate-200">{msg.senderRole}</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <div
                            className={`p-3.5 rounded-2xl max-w-[85%] sm:max-w-[75%] text-xs leading-relaxed shadow-xs ${
                              isCustomer
                                ? "bg-red-50 text-slate-900 border border-red-200/90 rounded-tr-xs"
                                : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                            }`}
                          >
                            {msg.isRevisionRequest && (
                              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded mb-1.5 uppercase tracking-wider">
                                <RefreshCw className="w-3 h-3" />
                                <span>Quote Revision Request</span>
                              </div>
                            )}
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Quick Suggestion Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Inquiries:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      "Can we quote with Sea Freight to reduce costs?",
                      "Do you have a tested Grade A used OEM alternative?",
                      "Could you confirm the exact lead time?",
                      "Vehicle VIN and engine numbers verified with owner.",
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setInAppChatInput(chip)}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Composer */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={inAppChatInput}
                      onChange={(e) => setInAppChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!inAppChatInput.trim()) return;
                          sendMessage(req.id, inAppChatInput.trim());
                          setInAppChatInput("");
                        }
                      }}
                      placeholder={`Send a message regarding ${req.requestNumber} to JDMHUB Operations... (Press Enter to send)`}
                      className="flex-1 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e20c0c] bg-white resize-none"
                    />
                    <button
                      type="button"
                      disabled={!inAppChatInput.trim()}
                      onClick={() => {
                        if (!inAppChatInput.trim()) return;
                        sendMessage(req.id, inAppChatInput.trim());
                        setInAppChatInput("");
                      }}
                      className="px-4 py-2 bg-[#e20c0c] hover:bg-[#CC162C] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer self-end"
                    >
                      <Send className="w-4 h-4" />
                      <span className="text-xs">Send</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Messages are delivered directly to the JDMHUB operations desk and recorded on the request audit log.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Direct MVP Communication Modal (Email, Teams, Phone) */}
      {showDirectContactModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#e20c0c] flex items-center justify-center font-bold shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Direct Operations Support
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    JDMHUB Sourcing &amp; Logistics Desk
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDirectContactModal(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 leading-relaxed">
              <strong>MVP Communication Policy:</strong> Direct inquiries, price queries, and logistics updates occur directly via Email, Teams, and Phone.
            </div>

            {/* Channels List */}
            <div className="space-y-3 text-xs">
              {/* Channel 1: Email */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#e20c0c]" />
                    <span className="font-bold text-slate-900">Email Operations</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-slate-600 text-xs font-mono">
                  procurement@jdmhub.co.nz
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <a
                    href={`mailto:procurement@jdmhub.co.nz?subject=${encodeURIComponent(
                      `[JDMHUB Quote Query] ${req.requestNumber} - ${req.vehicle.year} ${req.vehicle.make} ${req.vehicle.model}`
                    )}&body=${encodeURIComponent(
                      `Hi JDMHUB Operations Team,\n\nRegarding request ${req.requestNumber} (${req.part.name}):\n\n[Please enter your inquiry here]\n\nTrade Customer: SP Motors Auckland\nContact: James Wilson`
                    )}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-[#e20c0c] hover:bg-[#D81419] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer active:scale-95 text-center"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Email Draft →</span>
                  </a>
                  <button
                    onClick={() => handleCopy("procurement@jdmhub.co.nz", "email")}
                    className="px-2.5 py-2 sm:py-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg inline-flex items-center justify-center gap-1 text-xs cursor-pointer active:scale-95"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedContact === "email" ? "Copied!" : "Copy Email"}</span>
                  </button>
                </div>
              </div>

              {/* Channel 2: Microsoft Teams */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">Microsoft Teams</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Teams Desk
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  JDMHUB Procurement Desk (Nagoya Sourcing &amp; NZ Logistics)
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://teams.microsoft.com/l/chat/0/0?users=procurement@jdmhub.co.nz"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch Teams Chat →</span>
                  </a>
                </div>
              </div>

              {/* Channel 3: Phone */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Direct Phone Support</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    7:30 AM - 6:00 PM NZST
                  </span>
                </div>
                <p className="text-slate-600 text-xs font-mono">
                  +64 9 555 0192 (Ext 2 - Trade Desk)
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <a
                    href="tel:+6495550192"
                    className="px-3 py-2 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-center"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Desk (+64 9 555 0192) →</span>
                  </a>
                  <button
                    onClick={() => handleCopy("+6495550192", "phone")}
                    className="px-2.5 py-2 sm:py-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg inline-flex items-center justify-center gap-1 text-xs cursor-pointer active:scale-95"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedContact === "phone" ? "Copied!" : "Copy Phone"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowDirectContactModal(false)}
                className="w-full sm:w-auto px-4 py-2 border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer active:scale-95"
              >
                Close Support
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: REQUEST QUOTE REVISION & COUNTER-OFFER ─── */}
      {isRequestingRevision && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Request Quote Revision &amp; Counter-Offer
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {req.requestNumber} • {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} ({req.part.name})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestingRevision(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Reference Card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Quoted Total</span>
                <span className="font-bold text-slate-900 text-sm">
                  ${(req.customerQuote?.totalAmount || req.quotedValue || 0).toFixed(2)} NZD
                </span>
                <span className="text-[10px] text-slate-500 ml-1">
                  (Air: ${req.customerQuote?.airFreightCost || 185} • Ocean: ${req.customerQuote?.seaFreightCost || 65})
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 self-start sm:self-center">
                Current Quote v{req.customerQuote?.version || 1}
              </span>
            </div>

            {/* Revision Category Selection */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-800 block">
                1. What would you like to revise or counter-offer?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "freight_mode", label: "Switch Freight Option", desc: "e.g. Switch from Air to Ocean Freight" },
                  { id: "aftermarket_alternative", label: "Aftermarket / Used Alternative", desc: "Request lower-cost verified brand" },
                  { id: "price_budget", label: "Price / Target Budget Cap", desc: "Propose maximum workshop landed budget" },
                  { id: "part_specification", label: "Part Specification / Condition", desc: "Change color, trim, or condition requirements" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setRevisionCategory(cat.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      revisionCategory === cat.id
                        ? "border-[#e20c0c] bg-red-50/20 ring-1 ring-[#e20c0c]"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs">{cat.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Sub-options */}
            {revisionCategory === "freight_mode" && (
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs space-y-2">
                <label className="font-bold text-blue-950 block">Select Preferred Logistics Routing:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRevisionFreight("Sea Freight")}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      revisionFreight === "Sea Freight"
                        ? "border-blue-600 bg-white shadow-xs font-bold text-blue-900"
                        : "border-blue-200 text-blue-700 bg-blue-50/50"
                    }`}
                  >
                    🚢 Ocean Freight (25-40 days)
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Lowest cost consolidated</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRevisionFreight("Air Freight")}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      revisionFreight === "Air Freight"
                        ? "border-blue-600 bg-white shadow-xs font-bold text-blue-900"
                        : "border-blue-200 text-blue-700 bg-blue-50/50"
                    }`}
                  >
                    ✈️ Air Express (7-10 days)
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Urgent workshop dispatch</span>
                  </button>
                </div>
              </div>
            )}

            {revisionCategory === "aftermarket_alternative" && (
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-2">
                <label className="font-bold text-emerald-950 block">Preferred Alternative Sourcing Tier:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRevisionPartPreference("Aftermarket Quality")}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      revisionPartPreference === "Aftermarket Quality"
                        ? "border-emerald-600 bg-white shadow-xs font-bold text-emerald-900"
                        : "border-emerald-200 text-emerald-800 bg-emerald-50/50"
                    }`}
                  >
                    Quality Japanese Aftermarket
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Denso, Aisin, 555, Exedy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRevisionPartPreference("Used / Tested Grade A")}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      revisionPartPreference === "Used / Tested Grade A"
                        ? "border-emerald-600 bg-white shadow-xs font-bold text-emerald-900"
                        : "border-emerald-200 text-emerald-800 bg-emerald-50/50"
                    }`}
                  >
                    Tested Grade A Used / Recycled OEM
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Verified salvage unit from Japan</span>
                  </button>
                </div>
              </div>
            )}

            {/* Target Budget Counter-Offer */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800 flex items-center justify-between">
                <span>2. Target Landed Budget (NZD incl. GST)</span>
                <span className="text-[10px] font-normal text-slate-400">Optional counter-offer cap</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="1"
                  value={revisionBudget}
                  onChange={(e) => setRevisionBudget(e.target.value)}
                  placeholder="e.g. 450"
                  className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e20c0c]"
                />
              </div>
            </div>

            {/* Feedback / Instructions Notes */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800 block">
                3. Additional Workshop Notes for Procurement Specialist:
              </label>
              <textarea
                rows={3}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="e.g., Customer is price-sensitive on this repair. Sea freight or a verified Japanese aftermarket equivalent will work well if landed under NZ$450."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e20c0c] resize-none bg-white"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setIsRequestingRevision(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevision}
                className="px-5 py-2.5 bg-[#e20c0c] hover:bg-[#CC162C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Submit Revision Request to Operations</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: DECLINE QUOTE CONFIRMATION ─── */}
      {isRejecting && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-bold shrink-0">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Decline Quotation — {req.requestNumber}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Please provide a reason to help us improve our procurement terms
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRejecting(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reasons List */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-800 block">Select primary reason:</label>
              {[
                "Found part locally faster in New Zealand",
                "Quoted price is too high / over budget",
                "Transit lead time is too long for vehicle owner",
                "Customer or vehicle owner cancelled the repair job",
                "Vehicle sold or repair deferred",
                "Other reason",
              ].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    rejectReason === reason
                      ? "border-red-500 bg-red-50/30 font-semibold text-slate-900"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="w-4 h-4 text-[#e20c0c] focus:ring-0"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {/* Helpful alternative upsell if price or transit is the problem */}
            {(rejectReason.includes("price") || rejectReason.includes("lead time") || rejectReason.includes("budget") || rejectReason.includes("high")) && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 space-y-2">
                <p className="leading-relaxed">
                  💡 <strong>Need a better price or alternative shipping?</strong> Instead of declining, you can submit a counter-offer or switch to Ocean Freight.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsRejecting(false);
                    setIsRequestingRevision(true);
                  }}
                  className="font-bold text-[#e20c0c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Switch to Request Quote Revision Instead →</span>
                </button>
              </div>
            )}

            {/* Additional notes */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800 block">
                Additional Notes (Optional):
              </label>
              <textarea
                rows={2}
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Optional feedback for JDMHUB operations..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e20c0c] resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsRejecting(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Keep Quote
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Trade & Privacy Policy Modal (Reused from auth with scroll enforcement) */}
      <LegalModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        initialDoc="terms"
        title="Particular Terms of Trade"
        onAccept={() => {
          setAcceptTerms(true);
          setTermsAcceptedAt(new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }));
        }}
      />
      {/* QUOTE PHOTO LIGHTBOX WITH PREV/NEXT NAVIGATION */}
      {quotePhotoLightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none animate-in fade-in duration-200"
          onClick={() => setQuotePhotoLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black border border-white/10 flex items-center justify-center max-h-[80vh] w-full">
              <img
                src={quotePhotoLightbox || DEFAULT_PART_IMAGE}
                alt="Part photo preview"
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
                onError={handleImageError}
              />

              {lightboxPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const prevIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
                      setLightboxIndex(prevIndex);
                      setQuotePhotoLightbox(lightboxPhotos[prevIndex]);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10 cursor-pointer"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextIndex = (lightboxIndex + 1) % lightboxPhotos.length;
                      setLightboxIndex(nextIndex);
                      setQuotePhotoLightbox(lightboxPhotos[nextIndex]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10 cursor-pointer"
                    title="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom status & Close */}
            <div className="mt-3 flex items-center justify-between w-full px-2 text-white">
              <span className="text-xs font-medium text-slate-300">
                {lightboxPhotos.length > 1
                  ? `Photo ${lightboxIndex + 1} of ${lightboxPhotos.length}`
                  : "Verified inspection photo"}
              </span>
              <button
                type="button"
                onClick={() => setQuotePhotoLightbox(null)}
                className="px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close Preview</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
