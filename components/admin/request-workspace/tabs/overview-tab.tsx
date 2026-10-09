"use client";

import React, { useState } from "react";
import {
  Car,
  User,
  Package,
  MapPin,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Edit2,
  Send,
  MessageSquare,
  Plus,
  Link,
  ArrowRight,
  UploadCloud,
  Printer,
  RefreshCw,
  CornerDownRight,
  Reply,
  X,
  DollarSign,
  Box,
} from "lucide-react";
import NextLink from "next/link";
import { handleImageError } from "@/lib/default-images";
import { PartRequest, RequestStatus } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";
import { StatusBadge, PaymentStatusBadge } from "../../status-badge";

interface OverviewTabProps {
  request: PartRequest;
  onNavigateToTab?: (tab: string) => void;
}

export function OverviewTab({ request, onNavigateToTab }: OverviewTabProps) {
  const { addInternalNote, addNoteReply, currentStaffUser } = useUnifiedData();

  // Note Modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [isCustomerVisible, setIsCustomerVisible] = useState(true);

  // Threaded reply state
  const [replyingToNoteId, setReplyingToNoteId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const hasRevisionRequested =
    request.customerResponse === "Revision Requested" || Boolean(request.quoteRevisionRequest);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addInternalNote(request.id, newNoteText.trim(), isCustomerVisible);
    setNewNoteText("");
    setShowNoteModal(false);
  };

  const handleSendReply = (noteId: string, isNoteCustomerVisible: boolean) => {
    if (!replyText.trim()) return;
    addNoteReply(
      request.id,
      noteId,
      replyText.trim(),
      currentStaffUser.name,
      currentStaffUser.role,
      isNoteCustomerVisible
    );
    setReplyText("");
    setReplyingToNoteId(null);
  };

  return (
    <div className="space-y-6">
      {/* ⚠️ QUOTE REVISION / COUNTER-OFFER ALERT CARD ⚠️ */}
      {hasRevisionRequested && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                    Quote Revision Requested
                  </span>
                  {(request.quoteRevisionRequest?.categoryLabel || request.quoteRevisionRequest?.category) && (
                    <span className="text-xs font-bold text-slate-800 bg-white/80 border border-amber-200 px-2 py-0.5 rounded">
                      Category: {request.quoteRevisionRequest.categoryLabel || request.quoteRevisionRequest.category}
                    </span>
                  )}
                  {request.quoteRevisionRequest?.requestedAt && (
                    <span className="text-[11px] text-amber-800 font-medium">
                      Received {request.quoteRevisionRequest.requestedAt}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  Customer requested alternative quote terms for {request.part.name}
                </h3>

                {request.quoteRevisionRequest?.notes && (
                  <div className="bg-white/90 border border-amber-200/90 rounded-xl p-3 text-xs text-amber-950 font-medium leading-relaxed">
                    &ldquo;{request.quoteRevisionRequest.notes}&rdquo;
                  </div>
                )}

                {/* Structured Parameters */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  {request.quoteRevisionRequest?.requestedFreightPreference && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg font-bold">
                      Requested Freight: {request.quoteRevisionRequest.requestedFreightPreference}
                    </span>
                  )}
                  {request.quoteRevisionRequest?.targetBudget && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg font-bold">
                      Target Budget Cap: NZ$
                      {request.quoteRevisionRequest.targetBudget.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-row md:flex-col items-center gap-2 shrink-0">
              {onNavigateToTab && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab("quote")}
                    className="w-full bg-[#e20c0c] hover:bg-[#CC162C] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Update &amp; Re-Issue Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab("messages")}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Messages</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid: Customer, Vehicle, Part, Delivery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Customer Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#e20c0c]" />
              Customer Details
            </h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Trade Account
            </span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Business Name</span>
              <span className="font-bold text-slate-900 text-sm">{request.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Person</span>
              <span className="font-semibold text-slate-800">{request.contactName}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`mailto:${request.customerEmail}`} className="hover:underline truncate">
                  {request.customerEmail}
                </a>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`tel:${request.customerPhone}`} className="hover:underline">
                  {request.customerPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Delivery Address */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2B4499]" />
              Delivery Destination
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Workshop Bay
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-900 block">{request.deliveryAddress.label}</span>
            <p className="text-slate-600 leading-relaxed">
              Attn: {request.deliveryAddress.recipientName}
              <br />
              {request.deliveryAddress.streetAddress}, {request.deliveryAddress.suburb}
              <br />
              {request.deliveryAddress.city} {request.deliveryAddress.postalCode}
              <br />
              Phone: {request.deliveryAddress.phone}
            </p>
          </div>
        </div>

        {/* 3. Vehicle Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-[#e20c0c]" />
              Vehicle Specifications
            </h3>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {request.vehicle.registration || "NO PLATE"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Make</span>
              <span className="font-bold text-slate-900">
                {request.vehicle.make}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Model</span>
              <span className="font-bold text-slate-900">
                {request.vehicle.model}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Model Year</span>
              <span className="font-bold text-slate-900">
                {request.vehicle.year}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">VIN / Chassis Number (Mandatory)</span>
              <span className="font-semibold text-slate-800 break-all">
                {request.vehicle.vin}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">NZ Registration Plate (Optional)</span>
              <span className="font-medium text-slate-700">
                {request.vehicle.registration || "N/A"}
              </span>
            </div>
            {request.vehicle.engine && (
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Engine Code / Displacement</span>
                <span className="font-medium text-slate-700">
                  {request.vehicle.engine}
                </span>
              </div>
            )}
            {request.vehicle.transmission && (
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Transmission</span>
                <span className="font-medium text-slate-700">
                  {request.vehicle.transmission}
                </span>
              </div>
            )}
            {request.vehicle.driveConfig && (
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Drive Configuration</span>
                <span className="font-medium text-slate-700">
                  {request.vehicle.driveConfig}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Part Requirements */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#2B4499]" />
              Requested Part Specification
            </h3>
            <span className="text-xs font-bold text-[#e20c0c] bg-red-50 px-2 py-0.5 rounded">
              Qty: {request.part.quantity}
            </span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Part Name</span>
              <span className="font-bold text-slate-900 text-sm block">
                {request.part.name}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Part Number (OEM)</span>
                <span className="font-semibold text-slate-800">
                  {request.part.partNumber || "To be sourced by Autohub"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Preference</span>
                <span className="font-semibold text-slate-800">{request.part.preference}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <span className="text-slate-400 block text-[11px]">Condition Requirement</span>
                <span className="font-medium text-slate-700">{request.part.condition}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Freight Preference</span>
                <span className="font-bold text-[#e20c0c] bg-red-50 px-2 py-0.5 rounded border border-red-100 inline-block mt-0.5">
                  {request.supporting?.freightPreference === "Sea Freight" ? "Ocean Freight" : (request.supporting?.freightPreference || "Not Specified")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Notes & Attachments */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          Customer Information & Notes
        </h3>
        {request.supporting?.notes ? (
          <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed font-normal">
            &quot;{request.supporting.notes}&quot;
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic">No notes provided by customer.</p>
        )}

        {request.supporting?.photos && request.supporting.photos.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Attached Photos
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {request.supporting.photos.map((p, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={idx}
                  src={p}
                  alt="Customer attachment"
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 hover:scale-105 transition-transform"
                  onError={handleImageError}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Internal & Customer Notes List with Threaded Replies */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              Workspace Notes &amp; Threaded Replies
            </h3>
            <span className="text-[11px] text-slate-400">
              ({(request.internalNotes || []).length})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowNoteModal(true)}
            className="text-xs font-semibold text-[#e20c0c] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Note</span>
          </button>
        </div>

        {(request.internalNotes || []).length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No notes logged yet. Click &quot;Add New Note&quot; to leave internal guidance or customer-facing updates.
          </div>
        ) : (
          <div className="space-y-4">
            {(request.internalNotes || []).map((note) => {
              const isReplying = replyingToNoteId === note.id;
              const replies = note.replies || [];

              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border text-xs transition-colors ${
                    note.isCustomerVisible
                      ? "bg-amber-50/40 border-amber-200/80"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  {/* Note Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{note.author}</span>
                      <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {note.role}
                      </span>
                      {note.isCustomerVisible ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Visible to Customer
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                          Staff Only
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{note.timestamp}</span>
                  </div>

                  {/* Note Body */}
                  <p className="text-slate-800 leading-relaxed font-normal whitespace-pre-wrap mb-3">
                    {note.text}
                  </p>

                  {/* Threaded Replies */}
                  {replies.length > 0 && (
                    <div className="ml-3 sm:ml-5 pl-3 border-l-2 border-slate-200 space-y-2.5 my-3">
                      {replies.map((reply) => {
                        const isCustomer = reply.role === "Customer" || reply.author.toLowerCase().includes("customer");
                        return (
                          <div
                            key={reply.id}
                            className={`p-3 rounded-xl border text-xs ${
                              isCustomer
                                ? "bg-white border-blue-200 text-slate-800 shadow-2xs"
                                : "bg-slate-100/90 border-slate-200 text-slate-800"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{reply.author}</span>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    isCustomer
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-slate-900 text-white"
                                  }`}
                                >
                                  {reply.role}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                            </div>
                            <p className="whitespace-pre-wrap">{reply.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reply Button & Composer */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (isReplying) {
                          setReplyingToNoteId(null);
                        } else {
                          setReplyingToNoteId(note.id);
                          setReplyText("");
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Reply className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isReplying ? "Cancel Reply" : "Reply to Note"}</span>
                    </button>
                    {onNavigateToTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateToTab("messages")}
                        className="text-[10px] text-slate-400 hover:text-slate-700 underline"
                      >
                        View in Full Thread →
                      </button>
                    )}
                  </div>

                  {isReplying && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reply as {currentStaffUser.name} ({currentStaffUser.role}):</span>
                      </div>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write reply..."
                        className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#e20c0c]/30 focus:border-[#e20c0c]"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyingToNoteId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendReply(note.id, Boolean(note.isCustomerVisible))}
                          disabled={!replyText.trim()}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 text-white ${
                            !replyText.trim()
                              ? "bg-slate-300 cursor-not-allowed"
                              : "bg-[#e20c0c] hover:bg-[#CC162C]"
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>Post Reply</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE NOTE MODAL */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#e20c0c]" />
                Add Workspace Note
              </h3>
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Note Content
                </label>
                <textarea
                  rows={4}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Enter notes, vehicle fitment observations, or procurement status..."
                  className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e20c0c]/30 focus:border-[#e20c0c]"
                  required
                />
              </div>

              <div className="flex items-center gap-2.5 bg-amber-50 p-3 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  id="customerVisibleCheck"
                  checked={isCustomerVisible}
                  onChange={(e) => setIsCustomerVisible(e.target.checked)}
                  className="w-4 h-4 text-[#e20c0c] rounded border-slate-300 focus:ring-[#e20c0c]"
                />
                <label htmlFor="customerVisibleCheck" className="text-xs font-semibold text-amber-950 cursor-pointer">
                  Make note visible to customer in their portal &amp; notification thread
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-colors ${
                    !newNoteText.trim()
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-[#e20c0c] hover:bg-[#CC162C]"
                  }`}
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
