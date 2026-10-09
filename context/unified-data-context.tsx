"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  PartRequest,
  CustomerRecord,
  StaffUser,
  Supplier,
  SupplierStatus,
  PortalNotification,
  StaffRole,
  RequestStatus,
  PaymentStatus,
  ShipmentMilestone,
  SupplierQuotation,
  CostCalculation,
  CustomerQuoteVersion,
  Quotation,
  CustomerStatus,
  QuoteAcceptanceAudit,
  InternalNote,
  NoteReply,
  QuoteRevisionDetails,
  RevisionReasonCategory,
  RequestMessage,
} from "@/types/shared";
import { AdminMetrics, AdminSettings } from "@/types/admin";
import {
  INITIAL_SHARED_REQUESTS,
  MOCK_CUSTOMERS,
  MOCK_STAFF_USERS,
  MOCK_SUPPLIERS,
  INITIAL_NOTIFICATIONS,
} from "@/lib/shared-mock-data";

// ─── Storage Keys ──────────────────────────────────────────
const STORAGE_REQUESTS = "JDMHUB_shared_requests_v5";
const STORAGE_CUSTOMERS = "JDMHUB_shared_customers_v4";
const STORAGE_SUPPLIERS = "JDMHUB_shared_suppliers_v4";
const STORAGE_STAFF = "JDMHUB_shared_staff_v4";
const STORAGE_NOTIFICATIONS = "JDMHUB_shared_notifications_v4";
const STORAGE_ACTIVE_ROLE = "JDMHUB_active_staff_role_v4";

interface UnifiedDataContextType {
  // State
  requests: PartRequest[];
  customers: CustomerRecord[];
  suppliers: Supplier[];
  staffUsers: StaffUser[];
  notifications: PortalNotification[];
  unreadNotificationsCount: number;
  activeStaffRole: StaffRole;
  currentStaffUser: StaffUser;
  adminMetrics: AdminMetrics;
  adminSettings: AdminSettings;

  // Actions - Requests
  getRequestById: (idOrNumber: string) => PartRequest | undefined;
  submitCustomerRequest: (data: Partial<PartRequest>) => PartRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus, invoiceNumber?: string, invoiceUrl?: string, invoiceFileName?: string) => void;
  assignStaff: (requestId: string, staffName: string, staffRole: string) => void;

  // Actions - Sourcing & Quotes
  addSupplierQuotation: (requestId: string, quote: Omit<SupplierQuotation, "id" | "createdAt">) => void;
  editSupplierQuotation: (requestId: string, quoteId: string, updated: Partial<SupplierQuotation>) => void;
  deleteSupplierQuotation: (requestId: string, quoteId: string) => void;
  selectSupplierQuotation: (requestId: string, quoteId: string) => void;
  createCustomerQuote: (
    requestId: string,
    params: {
      sellPrice: number;
      freight?: number;
      airFreightCost?: number;
      seaFreightCost?: number;
      notes: string;
      terms?: string;
      estimatedTransitDays?: number;
      quotePhotos?: string[];
    }
  ) => void;
  acceptCustomerQuote: (requestId: string, audit: QuoteAcceptanceAudit) => void;
  rejectCustomerQuote: (requestId: string, reason: string) => void;
  cancelCustomerRequest: (requestId: string, reason: string) => void;
  requestQuoteRevision: (
    requestId: string,
    revision: {
      category: RevisionReasonCategory;
      categoryLabel: string;
      targetBudget?: number;
      requestedFreightPreference?: "Air Freight" | "Sea Freight";
      requestedPartPreference?: "Genuine OEM" | "Aftermarket Quality" | "Used / Tested Grade A";
      notes: string;
      requestedBy?: string;
    }
  ) => void;
  requestMoreInfo: (requestId: string, query: string) => void;

  // Actions - Payment
  markPaymentPaid: (requestId: string, paymentRef?: string) => void;
  markPaymentUnpaid: (requestId: string) => void;
  issueInvoice: (requestId: string, invoiceData: { invoiceNumber: string; amount: number; dueDate: string; pdfUrl: string }) => void;

  // Actions - Order Management (Gated by Payment = Paid)
  placeSupplierOrder: (
    requestId: string,
    order: {
      supplierName: string;
      supplierRef: string;
      cost: number;
      freight: number;
      notes: string;
      requesterName?: string;
      requesterContact?: string;
      requesterEmail?: string;
      requesterPhone?: string;
      deliveryAddress?: string;
      deliveryCity?: string;
      vehicleSummary?: string;
      partSummary?: string;
      handoverMode?: string;
    }
  ) => boolean;

  // Actions - Shipments & Internal Milestones
  createShipment: (
    requestId: string,
    shipment: {
      carrier: string;
      trackingNumber?: string;
      estimatedDelivery: string;
      origin?: string;
      destination?: string;
    }
  ) => void;
  updateShipmentMilestone: (requestId: string, nextMilestone: ShipmentMilestone, note?: string) => void;
  recordDelivery: (requestId: string, confirmationNotes?: string) => void;
  completeRequest: (requestId: string) => void;


  // Actions - Notes & Documents
  addInternalNote: (requestId: string, text: string, isCustomerVisible?: boolean) => void;
  addNoteReply: (
    requestId: string,
    noteId: string,
    text: string,
    author?: string,
    role?: string,
    isCustomerVisible?: boolean
  ) => void;
  sendRequestMessage: (
    requestId: string,
    message: string,
    senderName?: string,
    senderRole?: string,
    senderType?: "customer" | "admin",
    replyToNoteId?: string
  ) => void;
  addDocument: (requestId: string, doc: { name: string; type: "Customer" | "Supplier" | "Shipment" | "General"; size: string }) => void;

  // Actions - Management
  addCustomer: (customer: CustomerRecord) => void;
  updateCustomerStatus: (customerId: string, status: CustomerStatus) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplierId: string, updated: Partial<Supplier>) => void;
  updateSupplierStatus: (supplierId: string, status: SupplierStatus) => void;
  addStaffUser: (user: StaffUser) => void;
  updateStaffUser: (userId: string, updated: Partial<StaffUser>) => void;
  switchStaffRole: (role: StaffRole) => void;
  updateAdminSettings: (settings: AdminSettings) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Reset
  resetToMockDefaults: () => void;
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export function UnifiedDataProvider({ children }: { children: React.ReactNode }) {
  // Initialize state with canonical mock data (identical on server and client initial render)
  const [requests, setRequests] = useState<PartRequest[]>(INITIAL_SHARED_REQUESTS);
  const [customers, setCustomers] = useState<CustomerRecord[]>(MOCK_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(MOCK_STAFF_USERS);
  const [notifications, setNotifications] = useState<PortalNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeStaffRole, setActiveStaffRole] = useState<StaffRole>("Administrator");
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    baseMarginPercent: 20,
    defaultAirFreight: 85,
    defaultSeaFreight: 45,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate state from localStorage after mount to eliminate SSR hydration mismatches
  useEffect(() => {
    try {
      const savedRequests = localStorage.getItem(STORAGE_REQUESTS);
      if (savedRequests) {
        const parsed = JSON.parse(savedRequests);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated = parsed.map((r: any) => {
            if (r.status === "Approved") {
              return {
                ...r,
                status: "Invoicing",
                actionRequired: r.payment?.status === "Paid" ? "Payment received in full. Ready for supplier ordering." : "Raise and attach invoice PDF",
              };
            }
            return r;
          });
          setRequests(migrated);
        }
      }
      const savedCustomers = localStorage.getItem(STORAGE_CUSTOMERS);
      if (savedCustomers) {
        const parsed = JSON.parse(savedCustomers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomers(parsed);
        }
      }
      const savedSuppliers = localStorage.getItem(STORAGE_SUPPLIERS);
      if (savedSuppliers) {
        const parsed = JSON.parse(savedSuppliers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSuppliers(parsed);
        }
      }
      const savedStaff = localStorage.getItem(STORAGE_STAFF);
      if (savedStaff) {
        const parsed = JSON.parse(savedStaff);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStaffUsers(parsed);
        }
      }
      const savedNotifications = localStorage.getItem(STORAGE_NOTIFICATIONS);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        }
      }
      localStorage.removeItem(STORAGE_ACTIVE_ROLE);
      localStorage.removeItem("JDMHUB_active_staff_role");
      setActiveStaffRole("Administrator");
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Current logged in staff (always Administrator by default)
  const currentStaffUser = useMemo(() => {
    const adminUser = staffUsers.find((u) => u.role === "Administrator");
    return adminUser || staffUsers[0] || MOCK_STAFF_USERS[0];
  }, [staffUsers]);

  // Persistent BroadcastChannel and sync lock ref to eliminate race conditions & dropped messages
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const isSyncingRef = useRef(false);

  // Sync state changes to localStorage, broadcast CustomEvent and post to persistent BroadcastChannel
  const persistState = useCallback(
    (key: string, data: any) => {
      if (!isHydrated || isSyncingRef.current) return;
      if (typeof window !== "undefined") {
        try {
          const serialized = JSON.stringify(data);
          const existing = localStorage.getItem(key);
          if (existing !== serialized) {
            localStorage.setItem(key, serialized);
            window.dispatchEvent(new CustomEvent("JDMHUB_state_sync", { detail: { key, data } }));
            if (broadcastChannelRef.current) {
              broadcastChannelRef.current.postMessage({ type: "SYNC_STATE", key, data });
            }
          }
        } catch (e) { }
      }
    },
    [isHydrated]
  );

  useEffect(() => {
    if (!isHydrated) return;
    persistState(STORAGE_REQUESTS, requests);
  }, [requests, isHydrated, persistState]);

  useEffect(() => {
    if (!isHydrated) return;
    persistState(STORAGE_CUSTOMERS, customers);
  }, [customers, isHydrated, persistState]);

  useEffect(() => {
    if (!isHydrated) return;
    persistState(STORAGE_SUPPLIERS, suppliers);
  }, [suppliers, isHydrated, persistState]);

  useEffect(() => {
    if (!isHydrated) return;
    persistState(STORAGE_STAFF, staffUsers);
  }, [staffUsers, isHydrated, persistState]);

  useEffect(() => {
    if (!isHydrated) return;
    persistState(STORAGE_NOTIFICATIONS, notifications);
  }, [notifications, isHydrated, persistState]);

  // Listen to external window/tab storage events, custom window sync, and persistent BroadcastChannel for instant live sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        isSyncingRef.current = true;
        const parsed = JSON.parse(e.newValue);
        if (e.key === STORAGE_REQUESTS && Array.isArray(parsed)) {
          setRequests(parsed);
        } else if (e.key === STORAGE_CUSTOMERS && Array.isArray(parsed)) {
          setCustomers(parsed);
        } else if (e.key === STORAGE_SUPPLIERS && Array.isArray(parsed)) {
          setSuppliers(parsed);
        } else if (e.key === STORAGE_STAFF && Array.isArray(parsed)) {
          setStaffUsers(parsed);
        } else if (e.key === STORAGE_NOTIFICATIONS && Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      } catch (err) { }
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 50);
    };

    window.addEventListener("storage", handleStorage);

    const handleCustomSync = (e: Event) => {
      const customEvt = e as CustomEvent;
      const { key, data } = customEvt.detail || {};
      if (!key || isSyncingRef.current) return;
      isSyncingRef.current = true;
      if (key === STORAGE_REQUESTS && Array.isArray(data)) setRequests(data);
      else if (key === STORAGE_CUSTOMERS && Array.isArray(data)) setCustomers(data);
      else if (key === STORAGE_SUPPLIERS && Array.isArray(data)) setSuppliers(data);
      else if (key === STORAGE_STAFF && Array.isArray(data)) setStaffUsers(data);
      else if (key === STORAGE_NOTIFICATIONS && Array.isArray(data)) setNotifications(data);
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 50);
    };

    window.addEventListener("JDMHUB_state_sync", handleCustomSync);

    // Persistent BroadcastChannel for instantaneous cross-tab live synchronization
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("JDMHUB_sync_channel");
        channel.onmessage = (event) => {
          const { type, key, data } = event.data || {};
          if (type === "SYNC_STATE") {
            isSyncingRef.current = true;
            if (key === STORAGE_REQUESTS && Array.isArray(data)) setRequests(data);
            else if (key === STORAGE_CUSTOMERS && Array.isArray(data)) setCustomers(data);
            else if (key === STORAGE_SUPPLIERS && Array.isArray(data)) setSuppliers(data);
            else if (key === STORAGE_STAFF && Array.isArray(data)) setStaffUsers(data);
            else if (key === STORAGE_NOTIFICATIONS && Array.isArray(data)) setNotifications(data);
            setTimeout(() => {
              isSyncingRef.current = false;
            }, 50);
          } else if (type === "RESET_ALL") {
            setRequests(INITIAL_SHARED_REQUESTS);
            setCustomers(MOCK_CUSTOMERS);
            setSuppliers(MOCK_SUPPLIERS);
            setStaffUsers(MOCK_STAFF_USERS);
            setNotifications(INITIAL_NOTIFICATIONS);
            setActiveStaffRole("Administrator");
          }
        };
        broadcastChannelRef.current = channel;
      } catch (err) {
        console.error("BroadcastChannel init error:", err);
      }
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("JDMHUB_state_sync", handleCustomSync);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
        broadcastChannelRef.current = null;
      }
    };
  }, []);

  // ─── Computed Admin Metrics ─────────────────────────────
  const adminMetrics: AdminMetrics = useMemo(() => {
    return {
      newRequests: requests.filter((r) => r.status === "Submitted").length,
      sourcing: requests.filter((r) => r.status === "Sourcing").length,
      quoted: requests.filter((r) => r.status === "Quoted").length,
      invoicing: requests.filter((r) => r.status === "Invoicing").length,
      awaitingPayment: requests.filter((r) => r.status === "Awaiting Payment" && r.payment?.status !== "Paid").length,
      readyToOrder: requests.filter((r) => r.payment?.status === "Paid").length,
      shipped: requests.filter((r) => r.status === "Shipped").length,
      delivered: requests.filter((r) => r.status === "Delivered").length,
      totalActive: requests.filter((r) => r.status !== "Completed").length,
    };
  }, [requests]);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // ─── Lookup Helper ──────────────────────────────────────
  const getRequestById = useCallback(
    (idOrNumber: string) => {
      const normalized = (idOrNumber || "").toLowerCase().trim();
      const direct = requests.find(
        (r) =>
          r.id.toLowerCase() === normalized ||
          r.requestNumber.toLowerCase() === normalized
      );
      if (direct) return direct;

      // Legacy query mapping fallback (e.g. ?id=req-000123 -> JDHub-0001)
      const legacyMap: Record<string, string> = {
        "req-000123": "jdhub-0001",
        "autohub-p-000123": "jdhub-0001",
        "req-000145": "jdhub-0002",
        "autohub-p-000145": "jdhub-0002",
        "req-000138": "jdhub-0003",
        "autohub-p-000138": "jdhub-0003",
        "req-000128": "jdhub-0004",
        "autohub-p-000128": "jdhub-0004",
        "req-000137": "jdhub-0005",
        "autohub-p-000137": "jdhub-0005",
        "req-000125": "jdhub-0006",
        "autohub-p-000125": "jdhub-0006",
        "req-000120": "jdhub-0007",
        "autohub-p-000120": "jdhub-0007",
        "req-000115": "jdhub-0008",
        "autohub-p-000115": "jdhub-0008",
        "req-000110": "jdhub-0009",
        "autohub-p-000110": "jdhub-0009",
        "req-000188": "jdhub-0010",
        "autohub-p-000188": "jdhub-0010",
        "req-000199": "jdhub-0011",
        "autohub-p-000199": "jdhub-0011",
        "req-000200": "jdhub-0012",
        "autohub-p-000200": "jdhub-0012",
        "req-000201": "jdhub-0013",
        "autohub-p-000201": "jdhub-0013",
      };

      const mapped = legacyMap[normalized];
      if (mapped) {
        return requests.find(
          (r) =>
            r.id.toLowerCase() === mapped ||
            r.requestNumber.toLowerCase() === mapped
        );
      }
      return undefined;
    },
    [requests]
  );

  // ─── Actions: Submit Request (Customer Side) ────────────
  const submitCustomerRequest = useCallback(
    (data: Partial<PartRequest>): PartRequest => {
      const nextCount = requests.length + 1;
      const requestNumber = `JDHub-${String(nextCount).padStart(4, "0")}`;
      const newId = requestNumber;

      const newRequest: PartRequest = {
        id: newId,
        requestNumber,
        customerId: data.customerId || "cust-01",
        customerName: data.customerName || "AutoCare Auckland",
        contactName: data.contactName || "Dave Miller",
        customerEmail: data.customerEmail || "dave@autocare.co.nz",
        customerPhone: data.customerPhone || "+64 9 525 1122",
        vehicle: data.vehicle || {
          make: "Toyota",
          model: "Hiace",
          year: 2020,
          vin: "TRH200-009912",
        },
        part: data.part || {
          name: "Front Brake Pads",
          quantity: 1,
          preference: "Genuine OEM",
          condition: "Brand New OEM",
        },
        supporting: data.supporting || { photos: [], documents: [] },
        deliveryAddress: data.deliveryAddress || {
          id: "addr-01",
          label: "Workshop Delivery",
          recipientName: "Dave Miller",
          businessName: "AutoCare Auckland",
          streetAddress: "142 Great South Road",
          suburb: "Penrose",
          city: "Auckland",
          postalCode: "1061",
          phone: "+64 9 525 1122",
        },
        dateSubmitted: new Date().toISOString().split("T")[0],
        lastUpdated: "Just now",
        status: "Submitted",
        supplierQuotations: [],
        customerQuoteVersions: [],
        documents: [],
        internalNotes: [],
        activity: [
          {
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            timeLabel: "Just now",
            title: "Request submitted",
            description: `Request ${requestNumber} submitted by ${data.contactName || "Customer"}.`,
            actor: data.contactName || "Customer",
            type: "status",
          },
        ],
        actionRequired: "Waiting for Autohub specialist sourcing review",
        actionType: "none",
      };

      setRequests((prev) => [newRequest, ...prev]);

      // Trigger admin notification
      const newNotif: PortalNotification = {
        id: `notif-${Date.now()}`,
        type: "New Request",
        title: `New Request: ${requestNumber}`,
        description: `${newRequest.customerName} submitted request for ${newRequest.vehicle.make} ${newRequest.vehicle.model} - ${newRequest.part.name}`,
        timestamp: "Just now",
        read: false,
        requestId: newId,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      return newRequest;
    },
    [requests]
  );

  // ─── Actions: Update Status & Assignment ────────────────
  const updateRequestStatus = useCallback(
    (requestId: string, status: RequestStatus, invoiceNumber?: string, invoiceUrl?: string, invoiceFileName?: string) => {
      let targetReqNumber = requestId;
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            targetReqNumber = r.requestNumber;
            let actionRequired = r.actionRequired;
            let actionType = r.actionType;
            let updatedPayment = r.payment;
            let updatedShipment = r.shipment;
            let updatedQuote = r.customerQuote;
            let updatedSupplierOrder = r.supplierOrder;
            let paymentStatus = r.payment?.status || r.paymentStatus || "Unpaid";

            if (invoiceNumber || invoiceUrl || invoiceFileName) {
              if (!updatedPayment) {
                const amt = r.quotedValue || updatedQuote?.totalAmount || 450;
                updatedPayment = {
                  id: `pay-${r.requestNumber}`,
                  requestId: r.id,
                  invoiceNumber: invoiceNumber || `INV-2026-${r.requestNumber.replace(/[^0-9]/g, "")}`,
                  amount: amt,
                  currency: "NZD",
                  status: (paymentStatus as "Paid" | "Unpaid") || "Unpaid",
                  paymentReference: r.requestNumber,
                  dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
                  lastUpdated: "Just now",
                };
              }
              if (invoiceNumber) updatedPayment.invoiceNumber = invoiceNumber;
              if (invoiceUrl) updatedPayment.invoiceUrl = invoiceUrl;
              if (invoiceFileName) updatedPayment.invoiceFileName = invoiceFileName;
              if (!updatedPayment.invoicedAt) {
                updatedPayment.invoicedAt = new Date().toLocaleDateString("en-NZ", { year: "numeric", month: "short", day: "numeric" });
              }
            }

            if (status === "Submitted") {
              actionRequired = "Waiting for Autohub specialist sourcing review";
              actionType = "none";
            } else if (status === "Sourcing") {
              actionRequired = "Autohub specialists contacting verified supplier network";
              actionType = "none";
            } else if (status === "Quoted") {
              actionRequired = "Review & approve quote to proceed to fulfillment";
              actionType = "review_quote";
              if (!updatedQuote) {
                const totalAmt = r.quotedValue || 450;
                updatedQuote = {
                  id: `quote-${r.requestNumber}-1`,
                  requestId: r.id,
                  version: 1,
                  itemDescription: `${r.vehicle.make} ${r.vehicle.model} ${r.part.name}`,
                  oemNumber: r.part.partNumber,
                  quantity: r.part.quantity,
                  unitPrice: totalAmt - 70,
                  subtotal: totalAmt - 70,
                  airFreightCost: 110, seaFreightCost: 70,
                  freightNote: "Standard consolidated air delivery",
                  gstAmount: Number(((totalAmt * 15) / 115).toFixed(2)),
                  totalAmount: totalAmt,
                  currency: "NZD",
                  estimatedTransitDays: 5,
                  validUntil: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
                  termsAccepted: false,
                  procurementTerms: "Standard Autohub B2B Warranty",
                  notes: "Quoted via Autohub verified supplier network.",
                };
              }
            } else if (status === "Approved") {
              if (!updatedPayment) {
                const amt = r.quotedValue || updatedQuote?.totalAmount || 450;
                updatedPayment = {
                  id: `pay-${r.requestNumber}`,
                  requestId: r.id,
                  invoiceNumber: invoiceNumber || `INV-2026-${r.requestNumber.replace(/[^0-9]/g, "")}`,
                  amount: amt,
                  currency: "NZD",
                  status: paymentStatus as "Paid" | "Unpaid",
                  paymentReference: r.requestNumber,
                  dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
                  lastUpdated: "Just now",
                };
              }
              if (paymentStatus === "Paid" || updatedPayment?.status === "Paid") {
                actionRequired = "Payment received in full. Ready for supplier ordering.";
                actionType = "none";
              } else {
                actionRequired = "Quote approved. Proceed to Invoicing stage.";
                actionType = "none";
              }
            } else if (status === "Invoicing") {
              if (!updatedPayment) {
                const amt = r.quotedValue || updatedQuote?.totalAmount || 450;
                updatedPayment = {
                  id: `pay-${r.requestNumber}`,
                  requestId: r.id,
                  invoiceNumber: invoiceNumber || `INV-2026-${r.requestNumber.replace(/[^0-9]/g, "")}`,
                  amount: amt,
                  currency: "NZD",
                  status: paymentStatus as "Paid" | "Unpaid",
                  paymentReference: r.requestNumber,
                  dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
                  lastUpdated: "Just now",
                };
              }
              actionRequired = "Drafting invoice. Please upload when ready.";
              actionType = "none";
            } else if (status === "Awaiting Payment") {
              if (!updatedPayment) {
                const amt = r.quotedValue || updatedQuote?.totalAmount || 450;
                updatedPayment = {
                  id: `pay-${r.requestNumber}`,
                  requestId: r.id,
                  invoiceNumber: invoiceNumber || `INV-2026-${r.requestNumber.replace(/[^0-9]/g, "")}`,
                  amount: amt,
                  currency: "NZD",
                  status: "Unpaid",
                  paymentReference: r.requestNumber,
                  dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
                  lastUpdated: "Just now",
                };
              }
              if (invoiceNumber) updatedPayment.invoiceNumber = invoiceNumber;
              if (invoiceUrl) updatedPayment.invoiceUrl = invoiceUrl;
              if (invoiceFileName) updatedPayment.invoiceFileName = invoiceFileName;
              updatedPayment.invoicedAt = new Date().toLocaleDateString("en-NZ", { year: "numeric", month: "short", day: "numeric" });

              actionRequired = "Settle invoice via Bank Transfer or Card";
              actionType = "pay_now";
            } else if (status === "Ordered") {
              if (!updatedSupplierOrder) {
                updatedSupplierOrder = {
                  id: `ord-${Date.now()}`,
                  supplierId: r.selectedQuotationId || "sup-01",
                  supplierName: "Nagoya Auto Parts Co.",
                  supplierRef: `PO-${r.requestNumber.replace("JDHub-", "").replace("AutoHub-P-", "")}`,
                  orderDate: new Date().toISOString().split("T")[0],
                  cost: 280,
                  freight: 45,
                  total: 325,
                  notes: "Order placed. Awaiting dispatch.",
                  documents: [],
                };
              }
              actionRequired = "Supplier order placed. Awaiting dispatch & shipment tracking.";
              actionType = "none";
            } else if (status === "Shipped") {
              if (!updatedShipment) {
                const initialMilestone: ShipmentMilestone = "Received At Shipping Facility";
                updatedShipment = {
                  id: `ship-${Date.now()}`,
                  carrier: "Autohub Express Air Cargo",
                  currentMilestone: initialMilestone,
                  origin: "Nagoya Consolidation Hub, Japan",
                  destination: r.deliveryAddress.label,
                  estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
                  dispatchedAt: new Date().toISOString(),
                  lastUpdated: "Just now",
                  milestonesHistory: [
                    { milestone: "Received At Shipping Facility", location: "Nagoya Hub, Japan", timestamp: new Date().toISOString(), description: "Package received at hub.", isCompleted: true },
                    { milestone: "In Transit", location: "International Air Transit", timestamp: "Pending", description: "Cargo flight scheduled.", isCompleted: false },
                    { milestone: "Arrived in NZ", location: "Auckland Cargo Terminal", timestamp: "Pending", description: "Flight discharge.", isCompleted: false },
                    { milestone: "Out For Delivery", location: "Auckland Metro Hub", timestamp: "Pending", description: "Courier dispatch.", isCompleted: false },
                    { milestone: "Delivered", location: r.deliveryAddress.label, timestamp: "Pending", description: "Proof of delivery signature.", isCompleted: false },
                  ],
                };
              }
              actionRequired = `Consignment in transit: ${updatedShipment.carrier}`;
              actionType = "view_details";
            } else if (status === "Delivered") {
              if (updatedShipment) {
                updatedShipment = {
                  ...updatedShipment,
                  currentMilestone: "Delivered",
                  deliveredAt: updatedShipment.deliveredAt || new Date().toISOString(),
                  milestonesHistory: updatedShipment.milestonesHistory.map((m) => ({
                    ...m,
                    isCompleted: true,
                    timestamp: m.timestamp === "Pending" ? new Date().toISOString() : m.timestamp,
                  })),
                };
              }
              actionRequired = "Consignment delivered to destination";
              actionType = "none";
            } else if (status === "Completed") {
              actionRequired = "Request completed & archived";
              actionType = "none";

            } else if (status === "Ready for Dispatch") {
              actionRequired = "Awaiting shipment";
              actionType = "none";
            }

            return {
              ...r,
              status,
              actionRequired,
              actionType,
              payment: updatedPayment,
              shipment: updatedShipment,
              customerQuote: updatedQuote,
              supplierOrder: updatedSupplierOrder,
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: `Status changed to ${status}`,
                  description: `Status updated to ${status} by ${currentStaffUser.name}.`,
                  actor: currentStaffUser.name,
                  type: "status",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      // Trigger notification for real-time awareness in both portals
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "Status Update",
          title: `Status: ${targetReqNumber} → ${status}`,
          description: `Request stage updated to ${status}.`,
          timestamp: "Just now",
          read: false,
          requestId,
        },
        ...prev,
      ]);
    },
    [currentStaffUser]
  );



  const assignStaff = useCallback(
    (requestId: string, staffName: string, staffRole: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              assignedStaff: staffName,
              assignedStaffRole: staffRole,
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Request assigned",
                  description: `Assigned to ${staffName} (${staffRole}).`,
                  actor: currentStaffUser.name,
                  type: "status",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  // ─── Actions: Sourcing (Supplier Quotes) ─────────────────
  const addSupplierQuotation = useCallback(
    (requestId: string, quote: Omit<SupplierQuotation, "id" | "createdAt">) => {
      const newQuote: SupplierQuotation = {
        ...quote,
        id: `sq-${Date.now()}`,
        createdAt: "Just now",
      };

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const quotations = [...(r.supplierQuotations || []), newQuote];
            return {
              ...r,
              status: r.status === "Submitted" ? "Sourcing" : r.status,
              supplierQuotations: quotations,
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Supplier quote added",
                  description: `Quote from ${quote.supplierName} added (NZ$${Number(quote.supplierCost).toFixed(2)} + NZ$${Number(quote.supplierFreight).toFixed(2)} freight).`,
                  actor: currentStaffUser.name,
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  const editSupplierQuotation = useCallback(
    (requestId: string, quoteId: string, updated: Partial<SupplierQuotation>) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              supplierQuotations: (r.supplierQuotations || []).map((sq) =>
                sq.id === quoteId ? { ...sq, ...updated } : sq
              ),
              lastUpdated: "Just now",
            };
          }
          return r;
        })
      );
    },
    []
  );

  const deleteSupplierQuotation = useCallback(
    (requestId: string, quoteId: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              supplierQuotations: (r.supplierQuotations || []).filter((sq) => sq.id !== quoteId),
              selectedQuotationId: r.selectedQuotationId === quoteId ? undefined : r.selectedQuotationId,
              lastUpdated: "Just now",
            };
          }
          return r;
        })
      );
    },
    []
  );

  const selectSupplierQuotation = useCallback(
    (requestId: string, quoteId: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const currentQuotes = r.supplierQuotations || [];
            const selected = currentQuotes.find((sq) => sq.id === quoteId);
            const updatedQuotes = currentQuotes.map((sq) => ({
              ...sq,
              isSelected: sq.id === quoteId,
            }));

            // Calculate suggestion: 20% margin + flat freight
            let costCalc: CostCalculation | undefined = undefined;
            if (selected) {
              const baseCost = Number(selected.supplierCost) + Number(selected.supplierFreight);
              const marginAmount = Math.round(baseCost * 0.2);
              const sellPrice = baseCost + marginAmount;
              costCalc = {
                supplierCost: Number(selected.supplierCost),
                supplierFreight: Number(selected.supplierFreight),
                autohubMarginPercent: 20,
                autohubMarginAmount: marginAmount,
                customerSellPrice: sellPrice,
                customerFreight: 85.0, // default ONE flat freight
                totalCustomerQuote: sellPrice + 85.0,
              };
            }

            return {
              ...r,
              supplierQuotations: updatedQuotes,
              selectedQuotationId: quoteId,
              costCalculation: costCalc,
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Supplier selected",
                  description: `Selected ${selected?.supplierName || "supplier"} for customer quotation calculation.`,
                  actor: currentStaffUser.name,
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  // ─── Actions: Customer Quote ─────────────────────────────
  // Supports Air and Sea Freight
  const createCustomerQuote = useCallback(
    (
      requestId: string,
      params: {
        sellPrice: number;
        freight?: number;
        airFreightCost?: number;
        seaFreightCost?: number;
        notes: string;
        terms?: string;
        estimatedTransitDays?: number;
        quotePhotos?: string[];
      }
    ) => {
      const activeFreight = params.seaFreightCost || params.airFreightCost || params.freight || 0;
      const subtotal = params.sellPrice + activeFreight;
      const gstAmount = Number((subtotal * 0.15).toFixed(2));
      const totalAmount = subtotal + gstAmount;

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const nextVer = (r.customerQuoteVersions?.length || 0) + 1;
            const updatedPreviousVersions = (r.customerQuoteVersions || []).map((v) => ({
              ...v,
              status: (v.status === "Revision Requested" ? "Revised" : v.status) as any,
            }));

            const newVersion: CustomerQuoteVersion = {
              version: nextVer,
              date: new Date().toISOString().split("T")[0],
              sellPrice: params.sellPrice,
              freight: params.freight,
              airFreightCost: params.airFreightCost,
              seaFreightCost: params.seaFreightCost,
              totalAmount,
              estimatedTransitDays: params.estimatedTransitDays || 5,
              notes: params.notes,
              terms: params.terms || "Standard Autohub B2B Trade Warranty. 12-month replacement cover.",
              sentAt: "Just now",
              status: "Sent",
              createdBy: currentStaffUser.name,
              quotePhotos: params.quotePhotos,
            };

            const newQuotation: Quotation = {
              id: `quote-${r.requestNumber}-${nextVer}`,
              requestId: r.id,
              version: nextVer,
              itemDescription: `${r.vehicle.make} ${r.vehicle.model} ${r.part.name}`,
              oemNumber: r.part.partNumber,
              quantity: r.part.quantity,
              unitPrice: params.sellPrice,
              subtotal: params.sellPrice,
              freightCost: params.freight,
              airFreightCost: params.airFreightCost,
              seaFreightCost: params.seaFreightCost,
              freightNote: "Standard consolidated delivery to workshop",
              gstAmount,
              totalAmount,
              currency: "NZD",
              estimatedTransitDays: params.estimatedTransitDays || 5,
              validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              termsAccepted: false,
              procurementTerms: params.terms || "Autohub 12-month replacement guarantee.",
              notes: params.notes,
              quotePhotos: params.quotePhotos,
            };

            const quoteThreadMsg: RequestMessage = {
              id: `msg-${Date.now()}`,
              requestId: r.id,
              senderName: currentStaffUser.name,
              senderRole: currentStaffUser.role,
              senderType: "admin",
              message: nextVer > 1
                ? `[Quote Revision v${nextVer} Issued] Landed Total: NZ$${totalAmount.toFixed(2)} (Incl. 15% GST & Freight). ${params.notes ? `Specialist Note: "${params.notes}"` : ""}`
                : `[Formal Quote v1 Issued] Landed Total: NZ$${totalAmount.toFixed(2)} (Incl. 15% GST & Freight). ${params.notes ? `Specialist Note: "${params.notes}"` : ""}`,
              timestamp: "Just now",
            };

            return {
              ...r,
              status: "Quoted",
              quotedValue: totalAmount,
              customerQuote: newQuotation,
              quotation: newQuotation,
              customerQuoteVersions: [newVersion, ...updatedPreviousVersions],
              customerResponse: undefined,
              quoteRevisionRequest: undefined,
              actionRequired: "Review & approve quote to proceed to fulfillment",
              actionType: "review_quote",
              lastUpdated: "Just now",
              messages: [...(r.messages || []), quoteThreadMsg],
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: nextVer > 1 ? `Customer quote revision v${nextVer} created` : `Customer quote v1 created`,
                  description: `Quote created for NZ$${totalAmount.toFixed(2)} (Part: $${params.sellPrice.toFixed(2)}, Freight: $${activeFreight.toFixed(2)}) and sent to ${r.customerName}.${params.notes ? ` Specialist Note: "${params.notes}"` : ""}`,
                  actor: currentStaffUser.name,
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      // Notification
      const target = getRequestById(requestId);
      if (target) {
        const isRevision = (target.customerQuoteVersions?.length || 0) > 0;
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: isRevision ? "Quote Revision Ready" : "Quote Sent",
            title: isRevision ? `Quote Revision Ready: ${target.requestNumber}` : `Quote Ready: ${target.requestNumber}`,
            description: `Quote for NZ$${totalAmount.toFixed(2)} dispatched to ${target.customerName}.${params.notes ? ` Note: "${params.notes}"` : ""}`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [currentStaffUser, getRequestById]
  );

  // ─── Actions: Customer Approval ──────────────────────────
  // Sets Customer Response = Accepted and moves status to Approved (Stage 4)
  const acceptCustomerQuote = useCallback(
    (requestId: string, audit: QuoteAcceptanceAudit) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const amount = r.quotedValue || r.customerQuote?.totalAmount || 410.0;
            const actor = audit.acceptedBy || r.contactName || "Customer";

            return {
              ...r,
              status: "Invoicing",
              customerResponse: "Accepted",
              actionRequired: "Raise and attach invoice PDF",
              actionType: "upload_invoice",
              lastUpdated: "Just now",
              quoteAcceptance: {
                acceptedAt: audit.acceptedAt || "Just now",
                acceptedBy: actor,
                userRole: audit.userRole || "Customer",
                termsAccepted: audit.termsAccepted,
                termsAcceptedAt: audit.termsAcceptedAt,
                ipAddress: audit.ipAddress,
                vehicleVerified: audit.vehicleVerified,
                partVerified: audit.partVerified,
                addressVerified: audit.addressVerified,
                freightCost: audit.freightCost || r.customerQuote?.freightCost,
                selectedFreightType: audit.selectedFreightType,
              },
              payment: {
                id: `pay-${r.requestNumber}`,
                requestId: r.id,
                invoiceNumber: `INV-2026-${r.requestNumber.replace("JDHub-", "").replace("AutoHub-P-", "")}`,
                amount,
                currency: "NZD",
                status: "Unpaid", // Payment is Unpaid
                paymentReference: r.requestNumber,
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                lastUpdated: "Just now",
                bankDetails: {
                  bankName: "ANZ New Zealand",
                  accountName: "Autohub Procurement NZ Ltd",
                  accountNumber: "01-0288-0349821-00",
                  swiftBic: "ANZBNZ22",
                },
              },
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Customer accepted quote",
                  description: `Quote accepted by ${actor}. Status: Invoicing. Pending PDF attachment.`,
                  actor,
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      const reqNum = target?.requestNumber || "Request";
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "Quote Accepted",
          title: `Quote Accepted: ${reqNum}`,
          description: `Customer response recorded as Accepted. Status moved to Invoicing.`,
          timestamp: "Just now",
          read: false,
          requestId,
        },
        ...prev,
      ]);
    },
    [getRequestById]
  );

  const issueInvoice = useCallback(
    (requestId: string, invoiceData: { invoiceNumber: string; amount: number; dueDate: string; pdfUrl: string }) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              status: "Awaiting Payment",
              actionRequired: "Settle invoice via Bank Transfer or Card",
              actionType: "pay_now",
              lastUpdated: "Just now",
              payment: r.payment
                ? {
                  ...r.payment,
                  invoiceNumber: invoiceData.invoiceNumber,
                  amount: invoiceData.amount,
                  dueDate: invoiceData.dueDate,
                  invoiceUrl: invoiceData.pdfUrl,
                  status: "Unpaid"
                }
                : undefined,
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Invoice Issued",
                  description: "Invoice PDF attached and sent to customer. Status: Awaiting Payment.",
                  actor: currentStaffUser.name,
                  type: "payment",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      const reqNum = target?.requestNumber || "Request";
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "Invoice Issued",
          title: `Invoice Issued: ${reqNum}`,
          description: `Invoice PDF attached. Status moved to Awaiting Payment.`,
          timestamp: "Just now",
          read: false,
          requestId,
        },
        ...prev,
      ]);
    },
    [currentStaffUser, getRequestById]
  );

  const rejectCustomerQuote = useCallback(
    (requestId: string, reason: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const customerName = r.contactName || r.customerName || "Customer";
            const declineMsg: RequestMessage = {
              id: `msg-${Date.now()}`,
              requestId: r.id,
              senderName: customerName,
              senderRole: "Customer",
              senderType: "customer",
              message: `[Quote Declined] Reason: ${reason}`,
              timestamp: "Just now",
            };
            return {
              ...r,
              customerResponse: "Rejected",
              lastUpdated: "Just now",
              messages: [...(r.messages || []), declineMsg],
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Customer declined quote",
                  description: `Quote declined. Customer reason: ${reason}.`,
                  actor: customerName,
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "Quote Rejected",
            title: `Quote Declined: ${target.requestNumber}`,
            description: `Quote declined by ${target.customerName}. Reason: ${reason}.`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [getRequestById]
  );

  const cancelCustomerRequest = useCallback(
    (requestId: string, reason: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const customerName = r.contactName || r.customerName || "Customer";
            const cancelMsg: RequestMessage = {
              id: `msg-${Date.now()}`,
              requestId: r.id,
              senderName: customerName,
              senderRole: "Customer",
              senderType: "customer",
              message: `[Request Cancelled] Customer withdrew request. Reason: ${reason}. Japan sourcing halted.`,
              timestamp: "Just now",
            };
            return {
              ...r,
              status: "Cancelled",
              customerResponse: "Cancelled",
              actionRequired: `Request cancelled by customer (${reason})`,
              actionType: "none",
              lastUpdated: "Just now",
              messages: [...(r.messages || []), cancelMsg],
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Request Cancelled by Customer",
                  description: `Customer withdrew request. Reason: ${reason}. Sourcing operations stopped.`,
                  actor: customerName,
                  type: "status",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "Request Cancelled",
            title: `Request Cancelled: ${target.requestNumber}`,
            description: `Customer ${target.customerName || "Customer"} cancelled request. Reason: ${reason}. Sourcing ceased.`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [getRequestById]
  );

  const requestQuoteRevision = useCallback(
    (
      requestId: string,
      revision: {
        category: RevisionReasonCategory;
        categoryLabel: string;
        targetBudget?: number;
        requestedFreightPreference?: "Air Freight" | "Sea Freight";
        requestedPartPreference?: "Genuine OEM" | "Aftermarket Quality" | "Used / Tested Grade A";
        notes: string;
        requestedBy?: string;
      }
    ) => {
      const nowStr = new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" });
      const revisionDetails: QuoteRevisionDetails = {
        id: `rev-${Date.now()}`,
        requestedAt: nowStr,
        requestedBy: revision.requestedBy || "Customer Workshop",
        category: revision.category,
        categoryLabel: revision.categoryLabel,
        targetBudget: revision.targetBudget,
        requestedFreightPreference: revision.requestedFreightPreference,
        requestedPartPreference: revision.requestedPartPreference,
        notes: revision.notes,
        status: "Pending Admin Review",
      };

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const customerName = r.contactName || r.customerName || revision.requestedBy || "Customer";
            const updatedVersions = (r.customerQuoteVersions || []).map((v, i) => {
              if (i === 0) {
                return {
                  ...v,
                  status: "Revision Requested" as const,
                  revisionRequest: revisionDetails,
                };
              }
              return v;
            });

            const revSummaryParts = [
              `[Quote Revision Request] ${revision.categoryLabel}`,
              revision.targetBudget ? `Target Budget: NZ$${revision.targetBudget}` : null,
              revision.requestedFreightPreference ? `Preferred Freight: ${revision.requestedFreightPreference}` : null,
              revision.requestedPartPreference ? `Preferred Part: ${revision.requestedPartPreference}` : null,
              revision.notes ? `Feedback: "${revision.notes}"` : null,
            ].filter(Boolean);
            const revSummary = revSummaryParts.join(" • ");

            const newNote: InternalNote = {
              id: `note-${Date.now()}`,
              author: customerName,
              role: "Customer",
              text: revSummary,
              timestamp: "Just now",
              isCustomerVisible: true,
              replies: [],
            };

            const newMessage: RequestMessage = {
              id: `msg-${Date.now()}`,
              requestId: r.id,
              senderName: customerName,
              senderRole: "Customer",
              senderType: "customer",
              message: revSummary,
              timestamp: "Just now",
              isRevisionRequest: true,
            };

            return {
              ...r,
              customerResponse: "Revision Requested",
              quoteRevisionRequest: revisionDetails,
              customerQuoteVersions: updatedVersions,
              lastUpdated: "Just now",
              actionRequired: "Review customer counter-offer & prepare revised Quote v2",
              actionType: "review_quote",
              internalNotes: [newNote, ...(r.internalNotes || [])],
              messages: [...(r.messages || []), newMessage],
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Quote revision requested",
                  description: `${customerName} requested quote revision: ${revision.categoryLabel}.${revision.targetBudget ? ` Target budget: NZ$${revision.targetBudget}.` : ""}${revision.notes ? ` Note: "${revision.notes}"` : ""}`,
                  actor: customerName,
                  type: "quote",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "Quote Revision Requested",
            title: `Quote Revision: ${target.requestNumber}`,
            description: `${target.customerName} requested a quote revision (${revision.categoryLabel}).${revision.targetBudget ? ` Target: $${revision.targetBudget}.` : ""}`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [getRequestById]
  );

  const requestMoreInfo = useCallback(
    (requestId: string, query: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              customerResponse: "Request More Information",
              lastUpdated: "Just now",
              internalNotes: [
                {
                  id: `in-${Date.now()}`,
                  author: r.contactName || "Customer",
                  role: "Customer",
                  text: `Information requested: ${query}`,
                  timestamp: "Just now",
                  isCustomerVisible: true,
                },
                ...(r.internalNotes || []),
              ],
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Customer requested more info",
                  description: `Customer inquiry: "${query}". Contact via Email / Teams / Phone.`,
                  actor: r.contactName || "Customer",
                  type: "note",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    []
  );

  // ─── Actions: Payment & Payment Gate ─────────────────────
  // Supplier ordering is BLOCKED until Payment = PAID
  const markPaymentPaid = useCallback(
    (requestId: string, paymentRef?: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const currentPay = r.payment || {
              id: `pay-${r.requestNumber}`,
              requestId: r.id,
              invoiceNumber: `INV-2026-${r.requestNumber.replace("JDHub-", "").replace("AutoHub-P-", "")}`,
              amount: r.quotedValue || 410.0,
              currency: "NZD",
              status: "Paid",
              paymentReference: paymentRef || `${r.requestNumber}-PAID`,
              dueDate: "2026-09-30",
            };

            return {
              ...r,
              status: r.status === "Awaiting Payment" ? "Awaiting Payment" : r.status,
              paymentStatus: "Paid",
              payment: {
                ...currentPay,
                status: "Paid",
                paidAt: "Today",
                paymentReference: paymentRef || currentPay.paymentReference || `${r.requestNumber}-PAID`,
                lastUpdated: "Just now",
              },
              actionRequired: "Payment received in full. Order settled.",
              actionType: "none",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Payment marked Paid",
                  description: `Payment marked as Paid by ${currentStaffUser.name}. Order payment settled.`,
                  actor: currentStaffUser.name,
                  type: "payment",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "Payment Received",
            title: `Payment Received: ${target.requestNumber}`,
            description: `Payment marked as Paid by ${currentStaffUser.name}. Order payment settled.`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [currentStaffUser, getRequestById]
  );

  const markPaymentUnpaid = useCallback(
    (requestId: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            if (!r.payment) return r;
            return {
              ...r,
              status: "Awaiting Payment",
              paymentStatus: "Unpaid",
              payment: {
                ...r.payment,
                status: "Unpaid",
                paidAt: undefined,
                lastUpdated: "Just now",
              },
              actionRequired: "Settle invoice via Bank Transfer or Card",
              actionType: "pay_now",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Payment marked Unpaid",
                  description: `Payment reverted to Unpaid by ${currentStaffUser.name}.`,
                  actor: currentStaffUser.name,
                  type: "payment",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "Payment Updated",
            title: `Payment Reverted: ${target.requestNumber}`,
            description: `Payment marked as Unpaid. Settlement pending.`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [currentStaffUser, getRequestById]
  );

  // ─── Actions: Supplier Order ─────────────────────────────
  // Enforces payment gate check: only allowed if payment?.status === "Paid" or paymentStatus === "Paid"
  const placeSupplierOrder = useCallback(
    (
      requestId: string,
      order: {
        supplierName: string;
        supplierRef: string;
        cost: number;
        freight: number;
        notes: string;
        requesterName?: string;
        requesterContact?: string;
        requesterEmail?: string;
        requesterPhone?: string;
        deliveryAddress?: string;
        deliveryCity?: string;
        vehicleSummary?: string;
        partSummary?: string;
        handoverMode?: string;
      }
    ): boolean => {
      const target = getRequestById(requestId);
      if (!target || target.payment?.status !== "Paid") {
        return false; // BLOCKED by Payment Gate!
      }

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              status: "Ordered", // Status moves to ORDERED
              supplierOrder: {
                id: `ord-${Date.now()}`,
                supplierId: r.selectedQuotationId || "sup-01",
                supplierName: order.supplierName,
                supplierRef: order.supplierRef,
                orderDate: new Date().toISOString().split("T")[0],
                cost: order.cost,
                freight: order.freight,
                total: order.cost + order.freight,
                notes: order.notes,
                documents: [],
                requesterName: order.requesterName || r.customerName,
                requesterContact: order.requesterContact || r.contactName,
                requesterEmail: order.requesterEmail || r.customerEmail,
                requesterPhone: order.requesterPhone || r.customerPhone,
                deliveryAddress: order.deliveryAddress || `${r.deliveryAddress?.streetAddress}, ${r.deliveryAddress?.city}`,
                deliveryCity: order.deliveryCity || r.deliveryAddress?.city,
                vehicleSummary: order.vehicleSummary || `${r.vehicle.year} ${r.vehicle.make} ${r.vehicle.model}`,
                partSummary: order.partSummary || `${r.part.name} (Qty: ${r.part.quantity || 1})`,
                handoverMode: order.handoverMode || "Consolidated via Autohub Hub",
              },
              actionRequired: "Supplier order placed. Awaiting dispatch & shipment tracking.",
              actionType: "none",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Supplier order placed",
                  description: `PO ${order.supplierRef} placed with ${order.supplierName} (Total: NZ$${(order.cost + order.freight).toFixed(2)}). Status: ORDERED.`,
                  actor: currentStaffUser.name,
                  type: "order",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "Order Placed",
          title: `Supplier Order Placed: ${target.requestNumber}`,
          description: `Order placed with ${order.supplierName}. Ref: ${order.supplierRef}.`,
          timestamp: "Just now",
          read: false,
          requestId: target.id,
        },
        ...prev,
      ]);

      return true;
    },
    [getRequestById, currentStaffUser]
  );

  // ─── Actions: Shipments & Internal Milestones ────────────
  // Customer-facing top-level status remains SHIPPED.
  // Internal milestones: Received At Shipping Facility -> In Transit -> Arrived in NZ -> Out For Delivery -> Delivered
  const createShipment = useCallback(
    (
      requestId: string,
      shipment: {
        carrier: string;
        trackingNumber?: string;
        estimatedDelivery: string;
        origin?: string;
        destination?: string;
      }
    ) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const initialMilestone: ShipmentMilestone = "Received At Shipping Facility";
            return {
              ...r,
              status: "Shipped", // Top-level status is SHIPPED
              shipment: {
                id: `ship-${Date.now()}`,
                carrier: shipment.carrier,
                trackingNumber: shipment.trackingNumber,
                currentMilestone: initialMilestone,
                origin: shipment.origin || "Nagoya Consolidation Hub, Japan",
                destination: shipment.destination || r.deliveryAddress.label,
                estimatedDelivery: shipment.estimatedDelivery,
                dispatchedAt: new Date().toISOString(),
                lastUpdated: "Just now",
                milestonesHistory: [
                  {
                    milestone: initialMilestone,
                    location: shipment.origin || "Nagoya Hub, Japan",
                    timestamp: new Date().toISOString(),
                    description: "Package received, scanned, and allocated for airfreight consolidation.",
                    isCompleted: true,
                  },
                  {
                    milestone: "In Transit",
                    location: "International Air Transit",
                    timestamp: "Pending departure",
                    description: "Scheduled flight cargo transit.",
                    isCompleted: false,
                  },
                  {
                    milestone: "Arrived in NZ",
                    location: "Auckland International Cargo Terminal",
                    timestamp: "Pending arrival",
                    description: "Flight discharge and ground handling.",
                    isCompleted: false,
                  },
                  {
                    milestone: "Out For Delivery",
                    location: "Auckland Metro Courier Hub",
                    timestamp: "Pending courier load",
                    description: "Final mile courier delivery dispatch.",
                    isCompleted: false,
                  },
                  {
                    milestone: "Delivered",
                    location: r.deliveryAddress.label,
                    timestamp: "Pending signature",
                    description: "Proof of delivery signature.",
                    isCompleted: false,
                  },
                ],
              },
              actionRequired: `Shipment created: ${shipment.carrier} (${shipment.trackingNumber || "TBD"})`,
              actionType: "view_details",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Shipment created",
                  description: `Consignment created with ${shipment.carrier} (Tracking: ${shipment.trackingNumber || "TBD"}). Status: SHIPPED.`,
                  actor: currentStaffUser.name,
                  type: "shipment",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "Shipment Updated",
            title: `Shipment Created: ${target.requestNumber}`,
            description: `${shipment.carrier} tracking #${shipment.trackingNumber || "TBD"} generated.`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [currentStaffUser, getRequestById]
  );

  const updateShipmentMilestone = useCallback(
    (requestId: string, nextMilestone: ShipmentMilestone, note?: string) => {
      const MILESTONE_ORDER: ShipmentMilestone[] = [
        "Received At Shipping Facility",
        "In Transit",
        "Arrived in NZ",
        "Out For Delivery",
        "Delivered",
      ];
      const targetIndex = MILESTONE_ORDER.indexOf(nextMilestone);

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            if (!r.shipment) return r;

            const updatedHistory = r.shipment.milestonesHistory.map((m) => {
              const mIndex = MILESTONE_ORDER.indexOf(m.milestone);
              if (mIndex <= targetIndex) {
                return {
                  ...m,
                  isCompleted: true,
                  timestamp: m.isCompleted ? m.timestamp : new Date().toISOString(),
                  description: m.milestone === nextMilestone && note ? note : m.description,
                };
              }
              return { ...m, isCompleted: false };
            });

            const isFinalDelivery = nextMilestone === "Delivered";

            return {
              ...r,
              status: isFinalDelivery ? "Delivered" : r.status === "Delivered" ? "Shipped" : r.status,
              actionRequired: isFinalDelivery
                ? "Consignment delivered to destination"
                : `Consignment in transit: ${r.shipment.carrier} (${nextMilestone})`,
              actionType: isFinalDelivery ? "none" : "view_details",
              shipment: {
                ...r.shipment,
                currentMilestone: nextMilestone,
                lastUpdated: "Just now",
                milestonesHistory: updatedHistory,
                deliveredAt: isFinalDelivery ? new Date().toISOString() : r.shipment.deliveredAt,
              },
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: `Shipment milestone: ${nextMilestone}`,
                  description: note || `Internal milestone advanced to ${nextMilestone}.`,
                  actor: currentStaffUser.name,
                  type: "shipment",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "Shipment Updated",
            title: `Shipment Update: ${target.requestNumber}`,
            description: `Milestone advanced to ${nextMilestone}.`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [currentStaffUser, getRequestById]
  );

  const recordDelivery = useCallback(
    (requestId: string, confirmationNotes?: string) => {
      updateShipmentMilestone(requestId, "Delivered", confirmationNotes || "Delivery confirmed by workshop.");
    },
    [updateShipmentMilestone]
  );

  const completeRequest = useCallback(
    (requestId: string) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              status: "Completed",
              actionRequired: "Request completed & archived",
              actionType: "none",
              lastUpdated: "Just now",
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: "Request Completed",
                  description: `Request closed and marked as Completed by ${currentStaffUser.name}.`,
                  actor: currentStaffUser.name,
                  type: "status",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  // ─── Actions: Notes & Documents ──────────────────────────
  const addInternalNote = useCallback(
    (requestId: string, text: string, isCustomerVisible: boolean = false) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const threadMsg: RequestMessage | null = isCustomerVisible
              ? {
                  id: `msg-${Date.now()}`,
                  requestId: r.id,
                  senderName: currentStaffUser.name,
                  senderRole: currentStaffUser.role,
                  senderType: "admin",
                  message: text,
                  timestamp: "Just now",
                }
              : null;

            return {
              ...r,
              lastUpdated: "Just now",
              messages: threadMsg ? [...(r.messages || []), threadMsg] : (r.messages || []),
              internalNotes: [
                {
                  id: `note-${Date.now()}`,
                  author: currentStaffUser.name,
                  role: currentStaffUser.role,
                  text,
                  timestamp: "Just now",
                  isCustomerVisible,
                  replies: [],
                },
                ...(r.internalNotes || []),
              ],
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: isCustomerVisible ? "Customer Note added" : "Internal Note added",
                  description: text,
                  actor: currentStaffUser.name,
                  type: "note",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      if (isCustomerVisible) {
        const target = getRequestById(requestId);
        if (target) {
          setNotifications((prev) => [
            {
              id: `notif-${Date.now()}`,
              type: "New Message",
              title: `New Note from JDMHUB: ${target.requestNumber}`,
              description: `${currentStaffUser.name}: "${text.slice(0, 70)}${text.length > 70 ? "..." : ""}"`,
              timestamp: "Just now",
              read: false,
              requestId: target.id,
            },
            ...prev,
          ]);
        }
      }
    },
    [currentStaffUser, getRequestById]
  );

  const addNoteReply = useCallback(
    (
      requestId: string,
      noteId: string,
      text: string,
      author?: string,
      role?: string,
      isCustomerVisible: boolean = true
    ) => {
      const replyAuthor = author || currentStaffUser.name;
      const replyRole = role || currentStaffUser.role;
      const replyId = `rep-${Date.now()}`;
      const newReply: NoteReply = {
        id: replyId,
        author: replyAuthor,
        role: replyRole,
        text,
        timestamp: "Just now",
        isCustomerVisible,
      };

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            const updatedNotes = (r.internalNotes || []).map((n) => {
              if (n.id === noteId) {
                return {
                  ...n,
                  replies: [...(n.replies || []), newReply],
                };
              }
              return n;
            });

            const newMessage: RequestMessage = {
              id: `msg-${Date.now()}`,
              requestId: r.id,
              senderName: replyAuthor,
              senderRole: replyRole,
              senderType: replyRole === "Customer" ? "customer" : "admin",
              message: text,
              timestamp: "Just now",
              replyToNoteId: noteId,
            };

            return {
              ...r,
              lastUpdated: "Just now",
              internalNotes: updatedNotes,
              messages: [...(r.messages || []), newMessage],
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: `Reply added to note`,
                  description: `${replyAuthor}: "${text}"`,
                  actor: replyAuthor,
                  type: "note",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "New Message",
            title: `Note Reply: ${target.requestNumber}`,
            description: `${replyAuthor}: "${text.slice(0, 70)}${text.length > 70 ? "..." : ""}"`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [currentStaffUser, getRequestById]
  );

  const sendRequestMessage = useCallback(
    (
      requestId: string,
      message: string,
      senderName?: string,
      senderRole?: string,
      senderType: "customer" | "admin" = "customer",
      replyToNoteId?: string
    ) => {
      const sName = senderName || (senderType === "admin" ? currentStaffUser.name : "Customer");
      const sRole = senderRole || (senderType === "admin" ? currentStaffUser.role : "Customer");
      const newMessage: RequestMessage = {
        id: `msg-${Date.now()}`,
        requestId,
        senderName: sName,
        senderRole: sRole,
        senderType,
        message,
        timestamp: "Just now",
        replyToNoteId,
      };

      const newNote: InternalNote = {
        id: `note-${Date.now()}`,
        author: sName,
        role: sRole,
        text: message,
        timestamp: "Just now",
        isCustomerVisible: true,
        replies: [],
      };

      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              lastUpdated: "Just now",
              messages: [...(r.messages || []), newMessage],
              internalNotes: [newNote, ...(r.internalNotes || [])],
              activity: [
                {
                  id: `act-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  timeLabel: "Just now",
                  title: senderType === "customer" ? "Customer message received" : "Message sent to customer",
                  description: `${sName}: "${message}"`,
                  actor: sName,
                  type: "note",
                },
                ...(r.activity || []),
              ],
            };
          }
          return r;
        })
      );

      const target = getRequestById(requestId);
      if (target) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: "New Message",
            title: `New Message: ${target.requestNumber}`,
            description: `${sName}: "${message.slice(0, 70)}${message.length > 70 ? "..." : ""}"`,
            timestamp: "Just now",
            read: false,
            requestId: target.id,
          },
          ...prev,
        ]);
      }
    },
    [currentStaffUser, getRequestById]
  );

  const addDocument = useCallback(
    (requestId: string, doc: { name: string; type: "Customer" | "Supplier" | "Shipment" | "General"; size: string }) => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId || r.requestNumber === requestId) {
            return {
              ...r,
              documents: [
                {
                  id: `doc-${Date.now()}`,
                  name: doc.name,
                  type: doc.type,
                  size: doc.size,
                  uploadedAt: "Just now",
                  uploadedBy: currentStaffUser.name,
                },
                ...(r.documents || []),
              ],
              lastUpdated: "Just now",
            };
          }
          return r;
        })
      );
    },
    [currentStaffUser]
  );

  // ─── Customer Management ─────────────────────────────────
  const addCustomer = useCallback((customer: CustomerRecord) => {
    setCustomers((prev) => [customer, ...prev]);
  }, []);

  const updateCustomerStatus = useCallback(
    (customerId: string, status: CustomerStatus) => {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === customerId) {
            if (status === "Active" && c.status !== "Active") {
              setNotifications((nPrev) => [
                {
                  id: `notif-${Date.now()}`,
                  type: "Registration Approval",
                  title: `Trade Account Approved: ${c.businessName}`,
                  description: `${c.businessName} is now Approved with full trade pricing & priority Japan sourcing.`,
                  timestamp: "Just now",
                  read: false,
                },
                ...nPrev,
              ]);
            }
            return { ...c, status };
          }
          return c;
        })
      );
    },
    []
  );

  // ─── Supplier Management ─────────────────────────────────
  const addSupplier = useCallback((supplier: Supplier) => {
    setSuppliers((prev) => [supplier, ...prev]);
  }, []);

  const updateSupplier = useCallback(
    (supplierId: string, updated: Partial<Supplier>) => {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === supplierId ? { ...s, ...updated } : s))
      );
    },
    []
  );

  const updateSupplierStatus = useCallback(
    (supplierId: string, status: SupplierStatus) => {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === supplierId ? { ...s, status } : s))
      );
    },
    []
  );

  // ─── User Management & RBAC ──────────────────────────────
  const addStaffUser = useCallback((user: StaffUser) => {
    setStaffUsers((prev) => [user, ...prev]);
  }, []);

  const updateStaffUser = useCallback(
    (userId: string, updated: Partial<StaffUser>) => {
      setStaffUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updated } : u))
      );
    },
    []
  );

  const switchStaffRole = useCallback((role: StaffRole) => {
    setActiveStaffRole("Administrator");
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_ACTIVE_ROLE);
      } catch (e) { }
    }
  }, []);

  const updateAdminSettings = useCallback((settings: AdminSettings) => {
    setAdminSettings(settings);
  }, []);

  // ─── Notifications ───────────────────────────────────────
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // ─── Reset Data ──────────────────────────────────────────
  const resetToMockDefaults = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_REQUESTS);
        localStorage.removeItem(STORAGE_CUSTOMERS);
        localStorage.removeItem(STORAGE_SUPPLIERS);
        localStorage.removeItem(STORAGE_STAFF);
        localStorage.removeItem(STORAGE_NOTIFICATIONS);
        window.dispatchEvent(new CustomEvent("JDMHUB_state_sync", { detail: { key: "RESET_ALL" } }));
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({ type: "RESET_ALL" });
        }
      } catch (e) { }
    }
    setRequests(INITIAL_SHARED_REQUESTS);
    setCustomers(MOCK_CUSTOMERS);
    setSuppliers(MOCK_SUPPLIERS);
    setStaffUsers(MOCK_STAFF_USERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveStaffRole("Administrator");
  }, []);

  return (
    <UnifiedDataContext.Provider
      value={{
        requests,
        customers,
        suppliers,
        staffUsers,
        notifications,
        unreadNotificationsCount,
        activeStaffRole,
        currentStaffUser,
        adminMetrics,
        adminSettings,
        getRequestById,
        submitCustomerRequest,
        updateRequestStatus,
        assignStaff,
        addSupplierQuotation,
        editSupplierQuotation,
        deleteSupplierQuotation,
        selectSupplierQuotation,
        createCustomerQuote,
        acceptCustomerQuote,
        rejectCustomerQuote,
        cancelCustomerRequest,
        requestQuoteRevision,
        requestMoreInfo,
        markPaymentPaid,
        markPaymentUnpaid,
        issueInvoice,
        placeSupplierOrder,
        createShipment,
        updateShipmentMilestone,
        recordDelivery,
        completeRequest,
        addInternalNote,
        addNoteReply,
        sendRequestMessage,
        addDocument,
        addCustomer,
        updateCustomerStatus,
        addSupplier,
        updateSupplier,
        updateSupplierStatus,
        addStaffUser,
        updateStaffUser,
        switchStaffRole,
        updateAdminSettings,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToMockDefaults,
      }}
    >
      {children}
    </UnifiedDataContext.Provider>
  );
}

export function useUnifiedData() {
  const context = useContext(UnifiedDataContext);
  if (!context) {
    throw new Error("useUnifiedData must be used within a UnifiedDataProvider");
  }
  return context;
}

