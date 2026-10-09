"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileText,
  CornerDownRight,
  Info,
} from "lucide-react";
import { PartRequest, RequestMessage } from "@/types/shared";
import { useUnifiedData } from "@/context/unified-data-context";

interface MessagesTabProps {
  request: PartRequest;
  onNavigateToTab?: (tab: string) => void;
}

export function MessagesTab({ request, onNavigateToTab }: MessagesTabProps) {
  const { sendRequestMessage, currentStaffUser } = useUnifiedData();
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages: RequestMessage[] = request.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    sendRequestMessage(
      request.id,
      messageText.trim(),
      currentStaffUser.name,
      currentStaffUser.role,
      "admin"
    );
    setMessageText("");
    setIsSending(false);
  };

  const handleQuickTemplate = (text: string) => {
    setMessageText(text);
  };

  const quickTemplates = [
    "We are actively cross-referencing Japan auction databases and supplier stocks for your part.",
    "Ocean freight can save approximately $120–$150 NZD with a 25–40 day transit time if budget is priority.",
    "The OEM genuine version is discontinued; we can supply a Japanese certified aftermarket replacement.",
    "Could you provide a clear photo of your engine bay chassis plate or the defective component?",
    "We have prepared and issued an updated quote schedule with your requested revisions.",
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Active Revision / Feedback Alert Banner if exists */}
      {request.quoteRevisionRequest && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                    Active Revision Request
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Category: {request.quoteRevisionRequest.categoryLabel || request.quoteRevisionRequest.category}
                  </span>
                </div>
                <p className="text-xs text-amber-950 font-medium mt-1">
                  &ldquo;{request.quoteRevisionRequest.notes}&rdquo;
                </p>
                <div className="flex items-center gap-4 text-[11px] text-amber-800 font-semibold mt-2">
                  {request.quoteRevisionRequest.requestedFreightPreference && (
                    <span>
                      Freight Mode:{" "}
                      <strong className="text-slate-900">
                        {request.quoteRevisionRequest.requestedFreightPreference}
                      </strong>
                    </span>
                  )}
                  {request.quoteRevisionRequest.targetBudget && (
                    <span>
                      Target Budget:{" "}
                      <strong className="text-slate-900">
                        NZ${request.quoteRevisionRequest.targetBudget.toFixed(2)}
                      </strong>
                    </span>
                  )}
                  <span>Requested: {request.quoteRevisionRequest.requestedAt}</span>
                </div>
              </div>
            </div>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab("quote")}
                className="self-start sm:self-center shrink-0 bg-[#e20c0c] hover:bg-[#CC162C] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
              >
                Go to Quote Tab →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Conversation Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#e20c0c] flex items-center justify-center border border-red-100">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                Customer Request Message Thread
                <span className="text-[10px] text-slate-500 font-normal lowercase">
                  ({messages.length} messages)
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct in-app communication with {request.contactName} ({request.customerName})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-700 mb-1">
                No In-App Messages Yet
              </h4>
              <p className="text-[11px] text-slate-500 max-w-sm mb-4">
                Send an initial message to the customer or use a quick template below to update them on their sourcing status.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAdmin = msg.senderType === "admin";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                >
                  {/* Sender Metadata */}
                  <div
                    className={`flex items-center gap-2 mb-1 px-1 text-[11px] ${
                      isAdmin ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <span className="font-bold text-slate-800">{msg.senderName}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isAdmin
                          ? "bg-slate-900 text-white"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {msg.senderRole || (isAdmin ? "Procurely Team" : "Customer")}
                    </span>
                    <span className="text-slate-400 text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs shadow-xs leading-relaxed ${
                      isAdmin
                        ? "bg-slate-900 text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                    }`}
                  >
                    {msg.replyToNoteId && (
                      <div
                        className={`text-[10px] font-medium mb-2 pb-1.5 border-b flex items-center gap-1.5 ${
                          isAdmin
                            ? "text-slate-300 border-slate-700"
                            : "text-slate-500 border-slate-100"
                        }`}
                      >
                        <CornerDownRight className="w-3 h-3 shrink-0" />
                        <span>In response to note reference</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Chips */}
        <div className="px-4 py-2.5 bg-slate-100/70 border-t border-slate-200/80 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Quick Templates:
            </span>
            {quickTemplates.map((template, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickTemplate(template)}
                className="shrink-0 text-[11px] font-medium bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3 py-1 rounded-full border border-slate-200 shadow-2xs transition-colors"
              >
                {template.slice(0, 36)}...
              </button>
            ))}
          </div>
        </div>

        {/* Composer Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-white border-t border-slate-200 flex items-end gap-3"
        >
          <div className="flex-1 relative">
            <textarea
              rows={2}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type message visible to customer..."
              className="w-full text-xs font-medium text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e20c0c]/30 focus:border-[#e20c0c] transition-all resize-none shadow-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 pointer-events-none">
              Press Enter to send
            </span>
          </div>
          <button
            type="submit"
            disabled={!messageText.trim() || isSending}
            className={`h-11 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 ${
              !messageText.trim() || isSending
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-[#e20c0c] hover:bg-[#CC162C] text-white shadow-red-500/20"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
