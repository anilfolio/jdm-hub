// ─── Customer Portal Types (Aligned with Canonical Shared Types) ───

export type {
  RequestStatus,
  ShipmentMilestone,
  PaymentStatus,
  CustomerResponse,
  VehicleInfo,
  PartPreference,
  PartCondition,
  PartInfo,
  SupportingInfo,
  SavedAddress,
  SupplierAvailability,
  SupplierCondition,
  SupplierQuotation,
  CostCalculation,
  CustomerQuoteVersion,
  Quotation,
  QuoteAcceptanceAudit,
  PaymentDetails,
  SupplierOrder,
  MilestoneLog,
  ShipmentDetails,
  RequestDocument,
  InternalNote,
  NoteReply,
  RequestActivity,
  PartRequest,
  NotificationType,
  PortalNotification,
  QuoteRevisionDetails,
  RevisionReasonCategory,
  RequestMessage,
} from "./shared";

export type PortalTab =
  | "dashboard"
  | "requests"
  | "orders"
  | "shipments"
  | "payments"
  | "settings";

export interface ProcurementActivity {
  id: string;
  timestamp: string;
  timeLabel: string;
  title: string;
  description: string;
  type: "quote" | "payment" | "shipment" | "request" | "alert";
  requestId?: string;
}
