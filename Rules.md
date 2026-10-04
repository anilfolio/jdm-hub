# JDMHub Development Rules (`Rules.md`)

**Document Version:** 1.0.0  
**Status:** Active Engineering Standard  
**Project:** JDMHub B2B Automotive Procurement Platform  
**Target Market:** New Zealand Automotive Trade & Japanese Dismantler/Supplier Ecosystem  
**Last Updated:** October 2026  

---

## Table of Contents
1. [General Principles](#1-general-principles)
   - [1.1 Core Engineering Philosophy](#11-core-engineering-philosophy)
   - [1.2 Code Quality, Maintainability & Readability](#12-code-quality-maintainability--readability)
   - [1.3 Performance, Efficiency & Bundle Hygiene](#13-performance-efficiency--bundle-hygiene)
   - [1.4 Immutability & Defensive State Management](#14-immutability--defensive-state-management)
   - [1.5 B2B Automotive Domain Principles](#15-b2b-automotive-domain-principles)
2. [Technology & Coding Standards](#2-technology--coding-standards)
   - [2.1 Technology Stack Alignment](#21-technology-stack-alignment)
   - [2.2 TypeScript Standards & Type Safety](#22-typescript-standards--type-safety)
   - [2.3 UI & Component Architecture Standards](#23-ui--component-architecture-standards)
   - [2.4 Styling & Design System Standards](#24-styling--design-system-standards)
   - [2.5 State Management & Persistence Guidelines](#25-state-management--persistence-guidelines)
   - [2.6 Error Handling, Validation & Auditability](#26-error-handling-validation--auditability)
3. [Problem Structure](#3-problem-structure)
   - [3.1 Problem Domain Decomposition](#31-problem-domain-decomposition)
   - [3.2 Architectural & Directory Structure Mapping](#32-architectural--directory-structure-mapping)
   - [3.3 End-to-End Lifecycle State Machine & Transition Invariants](#33-end-to-end-lifecycle-state-machine--transition-invariants)
   - [3.4 Problem Boundary Enforcement & Prohibited Anti-Patterns](#34-problem-boundary-enforcement--prohibited-anti-patterns)

---

## 1. General Principles

### 1.1 Core Engineering Philosophy

The JDMHub codebase serves mission-critical cross-border automotive commerce where real money, physical auto parts, international shipping, and vehicle repair deadlines converge. All software development within this repository must adhere to the following core tenets:

1. **Single Source of Truth (SSOT)**:
   - Data models, calculation logic, and lifecycle statuses must exist in exactly one designated location.
   - Never duplicate status strings, currency formulas, or enum collections across different files.
   - Shared contracts reside exclusively in `types/`, canonical calculation logic in `lib/`, and shared state in `context/`.

2. **Commercial & Financial Gatekeeping as Code Law**:
   - In cross-border B2B procurement, **no physical order is placed with a Japanese supplier until trade customer funds are fully cleared**.
   - Code must programmatically enforce this invariant. Under no circumstances should an automated or manual action transition a part request to `"Ordered"` or release a Purchase Order (PO) if `paymentStatus !== "Paid"`.

3. **Universal Lifecycle Identification**:
   - Every procurement request is assigned a single immutable reference code formatted as `AH-P-XXXXXX` upon initial intake.
   - This single ID must be threaded through every downstream entity: customer quotes, commercial tax invoices, Japanese supplier POs, airway bills (AWBs), and New Zealand courier tracking records.

4. **Deterministic & Transparent Financial Calculations**:
   - Never hide fees, markups, or currency conversions behind opaque magic numbers.
   - Landed-cost breakdowns must always be deterministically calculated using the official pricing model:
     $$\text{Landed Cost (NZD)} = \left(\text{FOB (JPY)} \times \text{FX Rate}\right) + \text{Freight} + \text{Tariffs} + \text{GST} + \text{Margin}$$
   - Round currency calculations according to domain rules: JPY as integer (`Math.round`), NZD to exactly 2 decimal places (`toFixed(2)`).

5. **Separation of Concerns**:
   - **UI Components** (`components/`, `app/`): Purely responsible for presentation, layout, accessibility, and user interaction dispatch.
   - **State Providers** (`context/`): Responsible for holding reactive state, coordinating updates, and exposing clean action handlers.
   - **Business Engines** (`lib/`): Pure, side-effect-free utility and calculation functions that can be tested independently of React rendering.

---

### 1.2 Code Quality, Maintainability & Readability

1. **Self-Documenting Code Over Cryptic Brevity**:
   - Variable and function names must explicitly state their business purpose.
   - **Good**: `calculateLandedCostBreakdown()`, `isPurchaseOrderReleaseEligible()`, `activeCustomerRequest`.
   - **Bad**: `calc()`, `check()`, `req`, `data2`.

2. **Clean Function Design & Single Responsibility**:
   - Functions should do one thing and do it predictably.
   - Keep functions concise (ideally under 40 lines). If a function requires multiple nested conditionals or handles multiple business stages, break it down into modular helper routines.
   - Pure functions without hidden side effects should be used for calculations, date formatting, and string manipulation.

3. **No Magic Strings or Magic Numbers**:
   - Statuses, role definitions, and business thresholds must use typed union literals or const objects from `types/shared.ts`.
   - Avoid inline literal comparisons like `if (status === "ordered")`. Use canonical uppercase-cased types: `if (status === "Ordered")`.
   - Rates such as default GST (0.15 for New Zealand) or standard freight surcharges must be defined as named constants in `lib/shared-mock-data.ts` or relevant config modules.

4. **DRY vs. Pragmatic Readability**:
   - Do Not Repeat Yourself (DRY) when defining core domain calculations, status styles, or data contracts.
   - Avoid premature abstraction: do not create over-generalized generic components for two UI elements that merely happen to look similar today but serve fundamentally different business contexts (e.g., Customer Quote Card vs. Admin Supplier Bid Card).

---

### 1.3 Performance, Efficiency & Bundle Hygiene

1. **Minimal Bundle Footprint**:
   - Do not install third-party libraries for trivial operations that modern JavaScript, TypeScript, or Tailwind can handle natively.
   - No heavyweight utility libraries (e.g., Lodash, Moment.js, Axios, Redux). Use native `Date`, `Intl.NumberFormat`, standard Array methods, and native `fetch`.

2. **Tree-Shaking & Targeted Imports**:
   - Always import specific icons from `lucide-react`:
     ```typescript
     // Correct:
     import { Search, Package, AlertCircle } from "lucide-react";

     // Prohibited:
     import * as Icons from "lucide-react";
     ```
   - Use path aliases configured in `tsconfig.json` (`@/*`) for clean, relative-path-free imports.

3. **Render Optimization & Memoization Disciplines**:
   - Use `useMemo` for computationally intensive filters or calculations involving long part catalogs or multi-quote comparisons.
   - Use `useCallback` for event handlers passed down to deeply nested lists or heavy modal components.
   - Prevent unnecessary parent-to-child re-render cascades by keeping state localized to the lowest common ancestor that actually requires it.

---

### 1.4 Immutability & Defensive State Management

1. **Strict Immutability**:
   - Never mutate state objects or arrays in-place.
   - Always use spread operators, `map`, `filter`, or non-mutating primitives when producing updated state:
     ```typescript
     // Correct:
     setRequests(prev => prev.map(r => r.id === targetId ? { ...r, status: "Quoted" } : r));

     // Prohibited:
     const req = requests.find(r => r.id === targetId);
     req.status = "Quoted";
     setRequests(requests);
     ```

2. **Defensive Parsing & Fallback Guarantees**:
   - Any data read from `localStorage`, URL search params, or external inputs must be validated defensively before consumption.
   - Always wrap `JSON.parse()` in a `try/catch` block and provide a guaranteed fallback default.
   - Use optional chaining (`?.`) and nullish coalescing (`??`) rather than aggressive force-unwrapping (`!`).

---

### 1.5 B2B Automotive Domain Principles

1. **Vehicle Fitment Precision**:
   - Automotive parts require absolute fitment accuracy. Chassis codes (e.g., `BNR34`, `FD3S`, `JZA80`), Japanese VINs, engine codes (`RB26DETT`, `13B-REW`), and transmission variants must be treated as critical validation keys.
   - Never treat fitment notes as optional if a mechanic provides specific OEM part number overrides.

2. **Auditability & Traceability**:
   - Every status progression (Quote Acceptance, Payment Confirmation, Dispatch) must record an audit entry with:
     - Timestamp (ISO 8601 string)
     - Actor (User Name, Email, Role)
     - Detailed Note or Transaction Reference
   - Ensure audit logs are appended immutably and rendered in chronological order.

---

## 2. Technology & Coding Standards

### 2.1 Technology Stack Alignment

All development must conform to the current project dependencies and version constraints:

| Technology | Canonical Version | Role in JDMHub |
| :--- | :--- | :--- |
| **Next.js** | `^14.2.24` | App Router (`app/`), nested layouts, routing, metadata management |
| **React** | `^18.3.1` | UI runtime, hooks, concurrent rendering, Context API |
| **TypeScript** | `^5.7.3` | Static typing, contract enforcement, strict compilation |
| **Tailwind CSS** | `^3.4.17` | Utility-first styling engine, dark theme tokens, responsive layouts |
| **PostCSS / Autoprefixer** | `^8.5.2` / `^10.4.20` | CSS parsing and cross-browser vendor prefixing |
| **Lucide React** | `^0.475.0` | Standardized SVG vector iconography |
| **clsx & tailwind-merge** | `^2.1.1` & `^2.6.0` | Class condition merging via unified `cn(...)` utility |

---

### 2.2 TypeScript Standards & Type Safety

1. **Zero-Tolerance for `any`**:
   - The use of `any` is strictly prohibited.
   - Use `unknown` with type narrowing (e.g., `typeof`, `instanceof`, or custom type guards) when handling unverified input.
   - If an object structure is variable, define an explicit interface or use `Record<string, unknown>`.

2. **Discriminated Unions for Domain Statuses**:
   - Status definitions must be represented as strict union types:
     ```typescript
     export type RequestStatus =
       | "Submitted"
       | "Sourcing"
       | "Quoted"
       | "Approved"
       | "Invoicing"
       | "Awaiting Payment"
       | "Ordered"
       | "Ready for Dispatch"
       | "Shipped"
       | "Delivered"
       | "Completed";

     export type PaymentStatus = "Unpaid" | "Paid";
     export type StaffRole = "Administrator" | "Procurement" | "Operations" | "Finance";
     export type CustomerResponse = "Accepted" | "Rejected" | "Request More Information";
     ```

3. **Interface vs. Type Alias Guidelines**:
   - Use `interface` for domain entity definitions, props objects, and data structures intended to be extended:
     ```typescript
     export interface VehicleInfo {
       make: string;
       model: string;
       year: number | string;
       vin: string;
       registration?: string;
       engine?: string;
       variant?: string;
     }
     ```
   - Use `type` for unions, intersections, primitives, and mapped utility types.

4. **Explicit Return Types**:
   - All exported helper functions, data transformers, and custom hooks must declare explicit return types to prevent unintended API surface shifts.

5. **Type Colocation & Single Registry**:
   - Shared domain entities belong in `types/shared.ts`.
   - Role-specific contracts belong in `types/portal.ts`, `types/admin.ts`, or `types/auth.ts`.
   - Never define duplicate ad-hoc types inside route files or component files when a canonical type exists in `types/`.

---

### 2.3 UI & Component Architecture Standards

1. **Taxonomy & Folder Placement**:
   - Components must be strictly classified and placed in their designated directory:
     - `components/ui/`: Reusable, generic UI primitives with zero domain knowledge (buttons, modals, badges, inputs, tabs).
     - `components/shared/`: Cross-cutting application widgets (Navbar, Footer, Global Command Palette `⌘K`, Breadcrumbs).
     - `components/portal/`: Trade Customer Portal widgets (Request forms, Quote approval modal, Tracking timeline).
     - `components/admin/`: Operational/Backoffice widgets (Supplier quote entry, Invoice generator, Milestone updater, Role manager).
     - `components/landing/`: Public marketing components (Hero, Feature grid, Live demo CTA).

2. **Server vs. Client Component Discipline**:
   - Next.js App Router defaults to Server Components.
   - Only add `"use client"` when a component genuinely requires client-side features:
     - React hooks (`useState`, `useEffect`, `useContext`, `useRef`)
     - Browser APIs (`localStorage`, `window`, `navigator`)
     - Event listeners (`onClick`, `onChange`, `onKeyDown`)
   - Push `"use client"` boundaries as far down the component tree as possible. Keep page wrappers and layout shells as Server Components where feasible.

3. **Component File Structure Convention**:
   Every component file should follow this standard reading order:
   ```typescript
   "use client"; // 1. Client directive (only if required)

   // 2. Standard library / React imports
   import React, { useState, useMemo } from "react";

   // 3. Third-party UI / Icon imports
   import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

   // 4. Project-level imports (types, utils, contexts)
   import { PartRequest, RequestStatus } from "@/types/shared";
   import { cn } from "@/lib/utils";
   import { usePortalData } from "@/context/portal-data-context";

   // 5. Component Props Interface
   interface QuoteReviewCardProps {
     request: PartRequest;
     onAccept: (id: string) => void;
     className?: string;
   }

   // 6. Main Component Function
   export function QuoteReviewCard({ request, onAccept, className }: QuoteReviewCardProps) {
     // Hooks
     // Computed values
     // Handlers
     // JSX Return
   }
   ```

4. **Accessibility (a11y) & Usability Standards**:
   - All interactive icons must have a descriptive `aria-label` or accompanying visible text.
   - Form controls must have associated `<label>` tags with matching `htmlFor` identifiers.
   - Ensure keyboard navigability (`Tab`, `Enter`, `Escape` for closing modals, `⌘K` / `Ctrl+K` for search palette).
   - High-contrast color choices adhering to WCAG 2.1 AA standards against dark background tokens.

---

### 2.4 Styling & Design System Standards

1. **Tailwind Class Merging via `cn(...)`**:
   - Always wrap dynamic class combinations with the `cn(...)` utility:
     ```typescript
     import { cn } from "@/lib/utils";

     <div className={cn("p-4 rounded-xl border transition-all", isSelected ? "border-red-600 bg-red-950/20" : "border-slate-800 bg-slate-900", className)}>
     ```

2. **Strict Adherence to Dark Automotive Theme Tokens**:
   - JDMHub uses a curated, premium high-performance dark theme. Do not invent arbitrary hex codes in components.
   - Standard Color Palette:
     - **Background Canvas**: `bg-slate-950` / `bg-[#0a0f18]`
     - **Card / Surface**: `bg-slate-900/80` with `border-slate-800` and `backdrop-blur-md`
     - **Primary Accent (JDM Red)**: `text-red-500`, `bg-red-600 hover:bg-red-700`, `shadow-red-900/30`
     - **Secondary Accent (Navy/Steel)**: `text-slate-300`, `border-slate-700`
     - **Status Colors**: Use canonical mapping in `lib/status-styles.ts` (Green for Approved/Delivered, Amber for Sourcing/Awaiting Payment, Red for Rejected, Blue for Shipped).

3. **No Inline `style={{ ... }}` Overrides**:
   - Never write raw CSS strings or inline `style` objects unless dynamically binding calculated geometric positions (e.g., SVG progress bars or dynamic modal coordinates).

---

### 2.5 State Management & Persistence Guidelines

1. **React Context Boundaries**:
   - `AuthContext` (`context/auth-context.tsx`): Governs authenticated user session, role switching, permissions, and active customer context.
   - `PortalDataContext` (`context/portal-data-context.tsx`): Governs the shared inventory of part requests, supplier bids, quotes, invoices, and shipment tracking milestones.

2. **LocalStorage Persistence Protocol**:
   - When synchronizing data to browser storage, use the designated namespace keys:
     - `jdmhub_mock_user`
     - `jdmhub_requests_data`
   - Always initialize client state using lazy initialization (`useState(() => getStoredData())`) to prevent flashing or hydration mismatch errors.
   - Always provide automatic hydration from `lib/shared-mock-data.ts` if `localStorage` is empty or cleared.

3. **Action Dispatch Patterns**:
   - Expose intention-revealing mutation methods from context providers (e.g., `submitQuote()`, `acceptQuote()`, `markInvoicePaid()`, `updateShipmentMilestone()`).
   - Do not allow raw, untyped state setter functions (`setRequests`) to be called directly from UI widgets.

---

### 2.6 Error Handling, Validation & Auditability

1. **Proactive Form & Data Validation**:
   - Vehicle Intake: Validate that Year is a realistic 4-digit number (1960–Current Year + 1).
   - VIN / Chassis: Ensure non-empty string, trimmed of whitespace and converted to uppercase.
   - NZ Delivery Addresses: Validate against the 4-digit NZ postal code and region dataset using `lib/nz-address-service.ts`.

2. **Non-Blocking User Feedback**:
   - Provide clear inline errors on invalid form inputs.
   - Use high-visibility feedback banners or modal alerts for destructive actions (e.g., Quote Rejection, Customer Suspension).
   - Never allow unhandled promise rejections or silent UI freezes.

3. **Audit Trail Immutability**:
   - Any state alteration that shifts financial liability or consignment custody must record an audit entry:
     ```typescript
     const auditEntry: AuditEntry = {
       id: `AUD-${Date.now()}`,
       timestamp: new Date().toISOString(),
       action: "Quote Accepted",
       performedBy: currentUser.name,
       role: currentUser.role,
       details: `Customer approved Quote ${quoteId} for total ${formatNZD(total)}`
     };
     ```

---

## 3. Problem Structure

### 3.1 Problem Domain Decomposition

The JDMHub application solves a complex, high-friction international supply chain problem. To prevent spaghetti code and maintain clear boundaries, the overall problem space is decomposed into **7 distinct sub-problems**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          JDMHUB PROBLEM DOMAIN TOPOLOGY                                │
└────────────────────────────────────────────────────────────────────────────────────────┘

 [Sub-Problem 1] ───► [Sub-Problem 2] ───► [Sub-Problem 3] ───► [Sub-Problem 4]
 Vehicle & Part       Supplier Sourcing     Landed-Cost & FX      Customer Quote
 Technical Intake     Multi-Bidding         Formula Engine        Digital Acceptance
 (AH-P-XXXXXX)        (Japanese Vendors)    (NZD Landed Breakdown)(Clear Terms & SLA)
        │
        ▼
 [Sub-Problem 7] ◄─── [Sub-Problem 6] ◄─── [Sub-Problem 5]
 Hoist-Bay Handover   Japanese Supplier     Commercial Invoice &
 & Final Inspection   PO Release & Freight  Payment Gatekeeper
 (NZ Courier Delivery)Tracking Milestones   (Zero PO Without Paid)
```

#### Detailed Domain Subsystems:

1. **Sub-Problem 1: Vehicle & Technical Fitment Intake Engine**
   - *Problem*: Mechanics need rare parts but lack OEM part numbers or full Japanese chassis decoders.
   - *Solution*: Structured technical intake capturing Make, Model, Year, Chassis/VIN, Engine, Transmission, Part Preference (OEM Genuine, Tier-1 OEM, Quality Aftermarket), and Condition (New/Used Grade A).
   - *Output*: Immutable Universal Reference Number (`AH-P-XXXXXX`) in status `"Submitted"`.

2. **Sub-Problem 2: Supplier Sourcing & Multi-Bid Comparison Engine**
   - *Problem*: Sourcing from Japan requires checking multiple auction houses (USS, Yahoo Japan, ARAI), dismantlers, and specialized exporters.
   - *Solution*: Procurement staff register multiple supplier bids against a single request ID, recording supplier name, location (Tokyo, Osaka, Nagoya, Fukuoka), condition grade, FOB price in JPY, and lead times.

3. **Sub-Problem 3: Dynamic Landed-Cost Pricing & FX Conversion Engine**
   - *Problem*: Calculating the true landed price in New Zealand involves fluctuating JPY/NZD exchange rates, air vs. sea freight rates, customs tariffs, NZ GST (15%), and trade profit margins.
   - *Solution*: Real-time mathematical calculation engine (`lib/shared-mock-data.ts`) producing an itemized breakdown with full cost transparency.

4. **Sub-Problem 4: Customer Quote Presentation & Digital Acceptance Subsystem**
   - *Problem*: Quotes sent via PDF or text message lead to fitment disputes, stale pricing, and unrecorded verbal approvals.
   - *Solution*: Interactive digital quote card on the Customer Portal where mechanics can review line items, estimated arrival dates, and warranty conditions, choosing to **Accept**, **Reject**, or **Request More Information** with a single click.

5. **Sub-Problem 5: Invoicing & Payment Gatekeeper Subsystem**
   - *Problem*: Capital risk. Exporters cannot prepay Japanese suppliers with company cash while waiting for trade credit clearance from workshops.
   - *Solution*: Strict software gatekeeper. Upon quote acceptance, a GST-compliant commercial tax invoice (`INV-XXXXXX`) is generated. The system locks PO dispatch until the finance team or automated gateway marks the invoice as `"Paid"`.

6. **Sub-Problem 6: Supplier Purchase Order (PO) & Warehouse Handover Subsystem**
   - *Problem*: Japanese suppliers require formal PO documentation, export paperwork, and warehouse delivery receipts.
   - *Solution*: Automated PO generation (`PO-XXXXXX`) linked to the winning Japanese supplier, transitioning request status to `"Ordered"`, and enabling dispatch preparation.

7. **Sub-Problem 7: Milestone Logistics & Hoist-Bay Dispatch Subsystem**
   - *Problem*: Lack of visibility during the 2–4 week transit window creates mechanic anxiety and stalled vehicle hoist bays.
   - *Solution*: 5-stage milestone tracking:
     1. `Received At Shipping Facility` (Japan)
     2. `In Transit` (Air Freight / Ocean Vessel)
     3. `Arrived in NZ` (Auckland/Christchurch Customs)
     4. `Out For Delivery` (Local Courier / Toll Logistics)
     5. `Delivered` (Workshop Hoist Bay Handover)

---

### 3.2 Architectural & Directory Structure Mapping

To maintain clean architecture, the 7 problem domains map directly to the codebase directories and architectural layers:

```
f:\Project-Personal-Portfolio\jdmhub
├── app/                              # Next.js App Router (Routing & Pages)
│   ├── (auth)/                       # Public Auth Routes
│   │   ├── login/page.tsx            # Multi-Persona Authentication Portal
│   │   └── register/page.tsx         # Workshop Onboarding & Verification
│   ├── customer/                     # Trade Customer Surface (Sub-Problems 1, 4, 7)
│   │   ├── dashboard/page.tsx        # Active Consignments & Action Center
│   │   ├── requests/page.tsx         # New Part Intake & Historical Catalog
│   │   ├── quotes/page.tsx           # Digital Quote Acceptance Interface
│   │   ├── invoices/page.tsx         # Commercial Invoice & Payment View
│   │   ├── tracking/page.tsx         # Real-Time Milestone Logistics
│   │   └── settings/page.tsx         # Workshop Addresses & Profile Settings
│   ├── admin/                        # Operations & Backoffice Surface (Sub-Problems 2, 3, 5, 6, 7)
│   │   ├── dashboard/page.tsx        # Operational KPIs & Pipeline Metrics
│   │   ├── requests/page.tsx         # Unified Request Pipeline & Intake Review
│   │   ├── quotes/page.tsx           # Multi-Bid Comparison & Quote Formulation
│   │   ├── invoices/page.tsx         # Finance Invoicing & Payment Reconciliation
│   │   ├── tracking/page.tsx         # Freight Carrier & AWB Milestone Controls
│   │   ├── customers/page.tsx        # Trade Account Verification & Credit Terms
│   │   └── audit-log/page.tsx        # System-Wide Immutable Audit Trail
│   ├── globals.css                   # Tailwind Global Rules & CSS Custom Variables
│   └── layout.tsx                    # Root Layout with Meta, Providers & Command Palette
│
├── components/                       # UI Component Taxonomy
│   ├── ui/                           # Pure Primitives (Button, Modal, Input, Badge, Tabs)
│   ├── shared/                       # Shared Widgets (Navbar, Footer, CommandPalette, StatCard)
│   ├── portal/                       # Customer Portal Domain Widgets (IntakeForm, QuoteModal)
│   ├── admin/                        # Admin Domain Widgets (SupplierBidForm, MilestoneModal)
│   └── landing/                      # Public Presentation (Hero, Features, Testimonials)
│
├── context/                          # State Machines & Reactive Data Stores
│   ├── auth-context.tsx              # Session State, RBAC, Active User Persona
│   └── portal-data-context.tsx       # Core Domain State Machine (Requests, Quotes, Invoices)
│
├── lib/                              # Business Logic Engines & Services
│   ├── shared-mock-data.ts           # Canonical Calculation Formulas & Initial Mock Stores
│   ├── nz-address-service.ts         # NZ Courier Address Verification & Postal Code Resolution
│   ├── mock-portal-data.ts           # Customer-Specific Data Transformers
│   ├── status-styles.ts              # Canonical Status Badge Styles & Indicator Tokens
│   └── utils.ts                      # Tailwind Class Merge Utility (`cn`)
│
├── types/                            # Type Contracts & Domain Models
│   ├── shared.ts                     # Core Canonical Domain Types & Enums
│   ├── portal.ts                     # Customer-Facing Data Interfaces
│   ├── admin.ts                      # Admin Operational Interfaces
│   └── auth.ts                       # Authentication & Persona Types
│
└── public/                           # Static Assets (Logos, Icons, Vehicle Diagrams)
```

---

### 3.3 End-to-End Lifecycle State Machine & Transition Invariants

The lifecycle of every request is strictly governed by the following state progression table. Code must enforce every invariant condition:

| From Status | To Status | Trigger Event | Guard Condition / Invariant | Permitted Roles |
| :--- | :--- | :--- | :--- | :--- |
| *None* | `Submitted` | Trade customer submits vehicle & part intake form | Valid Year, Model, Chassis/VIN, and Part Description | Customer, Admin |
| `Submitted` | `Sourcing` | Procurement staff initiates supplier inquiries | Request has at least 1 assigned procurement specialist | Procurement, Admin |
| `Sourcing` | `Quoted` | Formulation of official landed-cost quote | At least 1 verified Japanese supplier bid; valid NZD price | Procurement, Admin |
| `Quoted` | `Approved` | Customer accepts quote via portal | Quote not expired; customer terms acknowledged | Customer |
| `Quoted` | `Rejected` | Customer rejects quote | Rejection reason provided for audit log | Customer, Admin |
| `Approved` | `Invoicing` | System generates Commercial Tax Invoice | Valid customer billing address & GST details | Finance, Admin, System |
| `Invoicing` | `Awaiting Payment` | Invoice issued to customer | Invoice number `INV-XXXXXX` generated and linked | Finance, Admin |
| `Awaiting Payment` | `Ordered` | Invoice marked as paid; Japanese PO released | **CRITICAL INVARIANT:** `paymentStatus === "Paid"` | Finance, Admin |
| `Ordered` | `Ready for Dispatch` | Japanese warehouse verifies part & packages crate | Physical inspection complete; export documents prepared | Operations, Admin |
| `Ready for Dispatch`| `Shipped` | Carrier takes possession in Japan | Valid Airway Bill (AWB) or Ocean Bill of Lading assigned | Operations, Admin |
| `Shipped` | `Delivered` | NZ courier hand-delivers part to workshop hoist bay | Proof of delivery signature / timestamp recorded | Operations, Admin |
| `Delivered` | `Completed` | Customer confirms fitment & transaction closes | 48-hour fitment guarantee window elapsed | Customer, Admin |

---

### 3.4 Problem Boundary Enforcement & Prohibited Anti-Patterns

To maintain application integrity and prevent regressions, all engineers must observe these strict boundary rules:

1. **PROHIBITED: Bypassing the Financial Payment Gate**:
   - Never write code that allows changing status to `"Ordered"` or issuing a supplier PO while `paymentStatus` remains `"Unpaid"`.
   - Admin bypasses or credit exceptions must be explicitly logged in the audit trail with an authorized administrator ID.

2. **PROHIBITED: Direct `localStorage` Manipulation in Components**:
   - Components must never call `localStorage.setItem()` directly for domain data.
   - All state mutations must flow through `PortalDataContext` actions so that reactive subscribers remain synchronized.

3. **PROHIBITED: Floating Point Currency Discrepancies**:
   - Never store currency as loosely rounded floating numbers in state.
   - Perform intermediate calculations with full precision and format only at the presentation boundary using the centralized `formatNZD()` and `formatJPY()` utilities.

4. **PROHIBITED: Orphaning Universal Reference IDs**:
   - Never create an invoice, quote, supplier bid, or tracking milestone that lacks a valid parent `requestId` (`AH-P-XXXXXX`).
   - Cascade updates or deletions must preserve referential integrity across the state store.

5. **PROHIBITED: Hardcoding New Zealand Regional Data**:
   - Do not hardcode delivery days, courier rates, or city lists inside UI select components.
   - Always query the canonical `nzAddressService` (`lib/nz-address-service.ts`) to ensure postal code and transit calculations remain uniform.
