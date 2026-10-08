"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  Copy,
  Check,
  ArrowRight,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";

export function PaymentModal() {
  const {
    requests,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentRequest,
    setPaymentRequest,
    submitPayment,
    setSelectedRequest,
    setSelectedRequestDetailsTab,
  } = usePortal();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [bankReference, setBankReference] = useState("");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvc, setCardCvc] = useState("912");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referenceSubmitted, setReferenceSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isPaymentModalOpen || !paymentRequest) return null;

  const req = requests.find((r) => r.id === paymentRequest.id) || paymentRequest;
  const pay = req.payment || {
    id: `pay-${req.id}`,
    requestId: req.id,
    invoiceNumber: `INV-2026-${req.requestNumber.replace(/[^0-9]/g, "").padStart(6, "0")}`,
    amount:
      req.quotedValue ||
      req.customerQuote?.totalAmount ||
      req.costCalculation?.totalCustomerQuote ||
      485.0,
    currency: "NZD",
    status: "Unpaid" as "Unpaid" | "Paid",
    paymentReference: `${req.requestNumber}`,
    bankDetails: {
      bankName: "ANZ New Zealand",
      accountName: "JDMHUB Procurement NZ Ltd",
      accountNumber: "01-0288-0349821-00",
      swiftBic: "ANZBNZ22",
    },
    dueDate: "2026-09-30",
  };

  const isPaid = pay.status === "Paid" || req.paymentStatus === "Paid";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Instant card / digital payment
  const handlePayByCard = () => {
    setIsProcessing(true);
    const invoiceNum =
      pay.invoiceNumber ||
      `INV-2026-${req.requestNumber.replace(/[^0-9]/g, "").padStart(6, "0")}`;

    setTimeout(() => {
      submitPayment(req.id, `CARD-${Date.now().toString().slice(-6)}`, true);
      setIsProcessing(false);
      setReferenceSubmitted(true);
      setSuccessMessage(`Payment Settled! Tax Invoice ${invoiceNum} generated.`);

      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setPaymentRequest(null);
        // Automatically open the generated Tax Invoice
        setSelectedRequestDetailsTab("invoice");
        setSelectedRequest(req);
      }, 1200);
    }, 800);
  };

  // Bank transfer remittance confirmation
  const handleConfirmBankTransfer = () => {
    setIsProcessing(true);
    const ref = bankReference.trim() || pay.paymentReference;
    const invoiceNum =
      pay.invoiceNumber ||
      `INV-2026-${req.requestNumber.replace(/[^0-9]/g, "").padStart(6, "0")}`;

    setTimeout(() => {
      submitPayment(req.id, ref, false);
      setIsProcessing(false);
      setReferenceSubmitted(true);
      setSuccessMessage(`Tax Invoice ${invoiceNum} generated! Remittance recorded.`);

      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setPaymentRequest(null);
        // Automatically open the generated Tax Invoice
        setSelectedRequestDetailsTab("invoice");
        setSelectedRequest(req);
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e20c0c] text-white flex items-center justify-center shadow-md font-bold shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Payment Settlement &amp; Tax Invoice
                </h2>
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Paid in Full
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Awaiting Payment
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Invoice Reference: {pay.invoiceNumber} • Order Ref: {req.requestNumber}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Consignment &amp; Part Description
              </span>
              <h4 className="text-xs font-bold text-slate-800">
                {req.part.name} (Qty: {req.part.quantity || 1})
              </h4>
              <p className="text-[11px] text-slate-500">
                For {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Payable (GST Incl.)
              </span>
              <div className="text-2xl font-black text-slate-900">
                ${pay.amount.toFixed(2)}{" "}
                <span className="text-xs font-bold text-slate-500">NZD</span>
              </div>
            </div>
          </div>

          {/* JDMHUB GST Tax Invoice Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <FileText className="w-4 h-4 text-[#e20c0c] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-800 block">
                Official IRD GST Commercial Tax Invoice Generation
              </span>
              <p className="text-slate-500 mt-0.5">
                Upon confirming payment, your official IRD Tax Invoice ({pay.invoiceNumber}) will be immediately generated and available in your portal Tax Invoice tab.
              </p>
            </div>
          </div>

          {isPaid ? (
            /* Paid state display */
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  Payment Reconciled &amp; Paid in Full
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  Tax invoice {pay.invoiceNumber} has been settled. Your parts order is unlocked and moving in procurement.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left max-w-sm mx-auto text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Amount Settled
                  </span>
                  <span className="font-bold text-emerald-900 text-sm">
                    ${pay.amount.toFixed(2)} NZD
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Payment Reference
                  </span>
                  <span className="font-bold text-slate-800">
                    {pay.paymentReference}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Settlement Method:
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#e20c0c]" />
                    <span>Instant Card / Digital</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethod === "bank"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-slate-700" />
                    <span>ANZ Direct Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* Method A: Instant Card Payment */}
              {paymentMethod === "card" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Instant Secure Card Settlement</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Immediate Clearance
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-mono focus:border-[#e20c0c] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-mono focus:border-[#e20c0c] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-mono focus:border-[#e20c0c] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Encrypted via TLS 256-bit bank grade security. Immediate invoice clearance and release of consignment.
                  </p>
                </div>
              )}

              {/* Method B: Direct Bank Deposit */}
              {paymentMethod === "bank" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    <h4 className="font-bold text-slate-900">
                      JDMHUB NZ Direct Deposit / Wire Details:
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 text-xs">Bank:</span>
                      <span className="font-bold text-slate-900">
                        {pay.bankDetails?.bankName || "ANZ New Zealand"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 text-xs">
                        Account Name:
                      </span>
                      <span className="font-bold text-slate-900">
                        {pay.bankDetails?.accountName || "JDMHUB Procurement NZ Ltd"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 text-xs">
                        Account Number:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {pay.bankDetails?.accountNumber || "01-0288-0349821-00"}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              pay.bankDetails?.accountNumber || "01-0288-0349821-00",
                              "acc"
                            )
                          }
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                          title="Copy account number"
                        >
                          {copiedField === "acc" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-amber-50/70 p-2.5 rounded-lg border border-amber-300">
                      <span className="text-amber-900 text-xs font-bold">
                        Mandatory Reference:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-900 text-sm">
                          {pay.paymentReference}
                        </span>
                        <button
                          onClick={() => handleCopy(pay.paymentReference, "ref")}
                          className="p-1 hover:bg-amber-100 rounded text-amber-700 cursor-pointer"
                          title="Copy reference"
                        >
                          {copiedField === "ref" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bank Reference Note Input */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Bank Deposit Reference / Transaction ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={bankReference}
                      onChange={(e) => setBankReference(e.target.value)}
                      placeholder={`e.g. ANZ-TX-98124912 or ${pay.paymentReference}`}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 outline-none focus:border-[#e20c0c] bg-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enter your bank reference if already transferred to facilitate automatic reconciliation.
                    </p>
                  </div>
                </div>
              )}

              {/* Success Notification */}
              {referenceSubmitted && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
          >
            Cancel
          </button>

          {!isPaid && (
            <div className="flex items-center gap-2">
              {paymentMethod === "card" ? (
                <button
                  type="button"
                  onClick={handlePayByCard}
                  disabled={isProcessing || referenceSubmitted}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e20c0c] hover:bg-[#b80a0a] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs shadow-red-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? "Generating Invoice & Processing..."
                      : `Pay $${pay.amount.toFixed(2)} NZD & Generate Tax Invoice`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmBankTransfer}
                  disabled={isProcessing || referenceSubmitted}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e20c0c] hover:bg-[#b80a0a] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs shadow-red-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? "Issuing Tax Invoice..."
                      : "Confirm Bank Transfer & Generate Tax Invoice"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {isPaid && (
            <button
              onClick={() => {
                setIsPaymentModalOpen(false);
                setSelectedRequestDetailsTab("invoice");
                setSelectedRequest(req);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Generated Tax Invoice →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
