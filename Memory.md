# JDMHub Project Memory (`Memory.md`)

**Document Version:** 1.0.0  
**Status:** Living Engineering State & Historical Memory  
**Project:** JDMHub B2B Automotive Procurement Platform  
**Target Market:** New Zealand Automotive Trade & Japanese Dismantler/Supplier Ecosystem  
**Last Updated:** October 2026  

---

## Table of Contents
1. [Current Status](#1-current-status)
   - [1.1 Executive System State & Maturity Level](#11-executive-system-state--maturity-level)
   - [1.2 Active Runtime Architecture & Tech Stack Status](#12-active-runtime-architecture--tech-stack-status)
   - [1.3 Multi-Surface & Portal Operational Health](#13-multi-surface--portal-operational-health)
   - [1.4 Core Business Engines & Gatekeeping Integrity](#14-core-business-engines--gatekeeping-integrity)
   - [1.5 State Persistence & Session Layer](#15-state-persistence--session-layer)
   - [1.6 Project Documentation & Governance Ecosystem](#16-project-documentation--governance-ecosystem)
2. [Completed Tasks](#2-completed-tasks)
   - [2.1 Core Infrastructure, Tooling & Design System](#21-core-infrastructure-tooling--design-system)
   - [2.2 Canonical Type Contracts & Domain Models](#22-canonical-type-contracts--domain-models)
   - [2.3 Multi-Persona Authentication & Access Control](#23-multi-persona-authentication--access-control)
   - [2.4 Public Marketing Surface & Trust Architecture](#24-public-marketing-surface--trust-architecture)
   - [2.5 Trade Customer Self-Service Portal (`/customer/*`)](#25-trade-customer-self-service-portal-customer)
   - [2.6 Backoffice Operations & Admin Console (`/admin/*`)](#26-backoffice-operations--admin-console-admin)
   - [2.7 Global Command Palette & Instant Search (`⌘K`)](#27-global-command-palette--instant-search-k)
   - [2.8 Complete Architectural & Engineering Documentation](#28-complete-architectural--engineering-documentation)
3. [In Progress](#3-in-progress)
   - [3.1 Active In-Flight Tasks & Polish](#31-active-in-flight-tasks--polish)
   - [3.2 Immediate Next Priorities (Sprint Backlog)](#32-immediate-next-priorities-sprint-backlog)
   - [3.3 Medium-Term Integration Roadmap](#33-medium-term-integration-roadmap)
   - [3.4 Known Technical Debt & Edge Case Monitoring](#34-known-technical-debt--edge-case-monitoring)

---

## 1. Current Status

### 1.1 Executive System State & Maturity Level

**Current Phase:** Production-Ready MVP (Feature Complete with Client-Side Simulation & Persistence)  
**Build Health:** Passing cleanly (`next build`, `next dev` active)  
**Core Value Proposition Demonstrated:** End-to-end B2B procurement lifecycle from Japanese supplier sourcing to New Zealand workshop hoist-bay delivery with zero financial leakage.

JDMHub is currently operating as a comprehensive, fully functional Single Page / Multi-Surface Next.js 14 web application. All core user flows—public marketing, customer onboarding, technical part intake, multi-supplier quote comparison, landed-cost formula calculation, customer digital acceptance, GST invoicing, payment reconciliation gatekeeping, supplier PO release, and 5-stage milestone shipment tracking—are completely implemented and interactive.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      JDMHUB REPOSITORY HEALTH                          │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Repository State         │ Clean, zero uncommitted git changes         │
│ Runtime Server           │ Active (`next dev` on port 3000)            │
│ Target Environments      │ Desktop & Tablet Workshop Terminals, Mobile │
│ Persistent Data Layer    │ Versioned LocalStorage with Auto-Hydration  │
│ Authentication System    │ 5 Role-Based Personas with Instant Switcher │
│ Primary Currency Models  │ JPY (Supplier FOB) ➔ NZD (Landed Cost + GST)│
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

### 1.2 Active Runtime Architecture & Tech Stack Status

The platform runs on a modern, zero-dependency-bloat stack adhering to `Rules.md`:

- **Next.js 14.2.24 (App Router)**: Utilizing nested layouts, dynamic segment routing, server-first baseline, and modular route grouping (`(auth)`, `customer`, `admin`).
- **React 18.3.1**: Concurrent rendering features, client hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`), and accessible synthetic events.
- **TypeScript 5.7.3**: Strict mode enabled (`strict: true`), 100% typed contracts in `types/`, zero unvalidated `any` usage.
- **Tailwind CSS 3.4.17**: Customized dark automotive palette (`slate-950`, `slate-900`, `red-600`), CSS custom property tokens, and custom scrollbars.
- **clsx & tailwind-merge (via `cn(...)`)**: Unified styling helper in `lib/utils.ts` preventing CSS specificity collisions.
- **Lucide React 0.475.0**: Standardized SVG icons adhering to 16px/20px/24px visual grids.

---

### 1.3 Multi-Surface & Portal Operational Health

The platform features four synchronized surfaces:

| Surface | Route Scope | Target User | Current Status |
| :--- | :--- | :--- | :--- |
| **Public Landing Surface** | `/`, `/terms`, `/privacy` | Potential workshops, fleet managers, public | **100% Complete**: Hero, Trust Metrics, Interactive Demo Modal, Pricing/Freight Calculator, Feature Grid, Footer. |
| **Authentication & Onboarding** | `/login`, `/register` | All trade customers & internal staff personas | **100% Complete**: Multi-role switcher, passwordless login simulation, workshop onboarding form with NZ trade verification. |
| **Trade Customer Portal** | `/customer/*` | Independent mechanics, workshop owners, fleet techs | **100% Complete**: Dashboard, Part Request Form (`AH-P-XXXXXX`), Quote Acceptance Modal, Invoices & Payment Gateway, Milestone Tracker, NZ Address Manager. |
| **Backoffice Operations Console** | `/admin/*` | Procurement, Operations, Finance, Admins | **100% Complete**: Operations Dashboard, Request Pipeline, Supplier Multi-Bidding, Landed-Cost Formulator, Commercial Invoicing, Milestone Controls, Audit Log. |

---

### 1.4 Core Business Engines & Gatekeeping Integrity

1. **Single Universal Intake Identifier (`AH-P-XXXXXX`)**:
   - Operating across all modules. Requests generated in `/customer/requests` maintain identity consistency across backoffice sourcing, quotes, invoices, and shipment tracking.
2. **Financial Gatekeeper Engine**:
   - The core invariant is strictly enforced: **No Purchase Order (PO) is released to Japanese suppliers until customer payment status is `"Paid"`**.
   - Backoffice order progression buttons remain locked and disabled with visual indicators until the Finance persona or mock payment clears the invoice.
3. **Dynamic Landed-Cost & FX Engine**:
   - Live conversion of Japanese supplier FOB prices (JPY) to NZD landed costs incorporating exchange rates, freight charges, customs tariffs, 15% NZ GST, and trade margin.
4. **New Zealand Address Verification Engine**:
   - `lib/nz-address-service.ts` actively validates street names, suburbs, regions, and 4-digit NZ postal codes for precise domestic courier calculations.

---

### 1.5 State Persistence & Session Layer

- **State Providers**:
  - `AuthContext` (`context/auth-context.tsx`): Manages the authenticated user, active persona switching, role permissions, and active workshop context.
  - `PortalDataContext` (`context/portal-data-context.tsx`): Houses requests, quotes, supplier bids, commercial invoices, and tracking events.
- **Persistence Storage**:
  - Synchronized via `localStorage` with namespace keys (`jdmhub_mock_user`, `jdmhub_requests_data`).
  - Automatic fallback hydration guarantees seamless data recovery if the browser cache is purged.

---

### 1.6 Project Documentation & Governance Ecosystem

The project repository includes a complete suite of institutional-grade governance documents:
- [README.md](file:///f:/Project-Personal-Portfolio/jdmhub/README.md): Primary repository entry point, platform overview, architecture, quickstart, demo personas, and development guide.
- [PRD.md](file:///f:/Project-Personal-Portfolio/jdmhub/PRD.md): Product Requirements Document detailing user personas, market pain points, functional requirements, and KPIs.
- [Architecture.md](file:///f:/Project-Personal-Portfolio/jdmhub/Architecture.md): System architecture detailing multi-portal topology, runtime layers, sequence diagrams, and directory structure.
- [DESIGN.md](file:///f:/Project-Personal-Portfolio/jdmhub/DESIGN.md): Visual design specifications, color tokens, typography, component styling guidelines, and UI states.
- [Rules.md](file:///f:/Project-Personal-Portfolio/jdmhub/Rules.md): Mandatory engineering rules covering General Principles, Technology & Coding Standards, and Problem Structure.
- [Memory.md](file:///f:/Project-Personal-Portfolio/jdmhub/Memory.md): This living memory document tracking project state, completed milestones, and upcoming tasks.

---

## 2. Completed Tasks

### 2.1 Core Infrastructure, Tooling & Design System
- [x] Initialized Next.js 14 project with TypeScript 5 and Tailwind CSS 3.4.
- [x] Configured path aliases (`@/*`) pointing directly to root directories.
- [x] Engineered custom dark automotive design tokens in `tailwind.config.ts` and `app/globals.css` (`slate-950` canvas, `red-600` primary accent, `border-slate-800`).
- [x] Implemented `cn(...)` utility merging `clsx` and `tailwind-merge` in `lib/utils.ts`.
- [x] Built reusable UI component primitives in `components/ui/`:
  - Buttons with status variants, spinners, and icon slots.
  - Modals and dialog overlays with keyboard focus traps and backdrop blurs.
  - Accessible input fields, select dropdowns, textareas, and tab containers.
  - High-visibility status indicator badges mapped in `lib/status-styles.ts`.

### 2.2 Canonical Type Contracts & Domain Models
- [x] Constructed canonical data contracts in `types/shared.ts`:
  - `RequestStatus`, `PaymentStatus`, `ShipmentMilestone`, `StaffRole`, `CustomerStatus`.
  - `VehicleInfo`, `PartInfo`, `SupplierBid`, `LandedCostBreakdown`, `PartRequest`, `AuditEntry`.
- [x] Created portal-specific types in `types/portal.ts` (filters, quote response events).
- [x] Created backoffice operational types in `types/admin.ts` (supplier records, margin overrides, batch actions).
- [x] Created authentication and session types in `types/auth.ts`.

### 2.3 Multi-Persona Authentication & Access Control
- [x] Built `context/auth-context.tsx` with instant persona switching:
  - **Trade Customer** (Dave Harrison, Apex Performance Auckland)
  - **Administrator** (Marcus Vance, Managing Director)
  - **Procurement Staff** (Kenji Sato, Tokyo Sourcing Desk)
  - **Operations Staff** (Liam O'Connor, Auckland Freight Hub)
  - **Finance Staff** (Sarah Jenkins, Commercial Accounts)
- [x] Built dedicated login interface at `app/login/page.tsx` with quick-switch demo badges and MFA simulation.
- [x] Built workshop registration portal at `app/register/page.tsx` capturing NZ business numbers (NZBN), workshop address, and trade references.
- [x] Integrated legal modals for Terms of Trade and Privacy Policy (`components/auth/legal-modal.tsx`).

### 2.4 Public Marketing Surface & Trust Architecture
- [x] Developed modern landing page at `app/page.tsx` (`components/landing/`):
  - **Hero Section**: Value proposition with interactive quick request intake trigger.
  - **Trust Metrics Section**: Displays verified fulfillment rates, active workshop network, and average transit days.
  - **How It Works Section**: 4-step visual breakdown from Japanese auction/dismantler to NZ hoist bay.
  - **Quote & Freight Calculator**: Real-time interactive estimate tool simulating air vs. ocean freight landed costs.
  - **Built for Trade Section**: Workshop-specific features (48-hour fitment guarantee, GST invoices, single intake ID).
  - **Interactive Request Modal**: Instant request submission directly from the public landing page.
  - **Landing Footer**: Comprehensive link directory, legal notices, and Japanese sourcing regional badges.

### 2.5 Trade Customer Self-Service Portal (`/customer/*`)
- [x] Constructed shared Customer Portal layout (`components/portal/customer-portal-layout.tsx`) with sidebar navigation, search bar, active user profile, and notification center.
- [x] Built **Customer Dashboard** (`components/portal/dashboard-view.tsx`):
  - Metric counters (Active Orders, Quotes Awaiting Approval, Deliveries in Transit, Total Spend).
  - Urgent Action Required banners (e.g. pending quote approvals or unpaid invoices).
  - Active consignment tracking cards with progress bars.
- [x] Built **Technical Part Intake Wizard** (`components/portal/new-request-page.tsx`, `new-request-modal.tsx`):
  - Vehicle details (Year, Make, Model, VIN/Chassis, Engine Code, Transmission).
  - Part specification (OEM Part Number, Part Name, Condition Preference, Urgency Tier).
  - Photo and diagram attachment upload simulation.
- [x] Built **Digital Quote Acceptance Interface** (`components/portal/request-details-modal.tsx`):
  - Detailed landed-cost breakdown in NZD.
  - Digital action buttons: **Accept Quote**, **Reject Quote**, **Ask Question**.
  - Terms of trade digital sign-off and instant invoice generation trigger.
- [x] Built **Commercial Invoicing & Payment Simulator** (`components/portal/payments-view.tsx`, `payment-modal.tsx`):
  - Official GST-compliant Commercial Tax Invoice view (`components/shared/invoice-document.tsx`).
  - Interactive payment gateway simulation (Direct Bank Transfer / Credit Card).
  - Automatic invoice status toggle from `"Unpaid"` to `"Paid"` with real-time state synchronization.
- [x] Built **Real-Time Consignment Tracker** (`components/portal/shipments-view.tsx`):
  - Visual 5-stage milestone stepper (Facility Received ➔ In Transit ➔ Arrived in NZ ➔ Out for Delivery ➔ Delivered).
  - Airway Bill (AWB) and local courier tracking numbers.
- [x] Built **Workshop Settings & Address Manager** (`components/portal/settings-view.tsx`):
  - Workshop delivery addresses with NZ postal code auto-resolution.
  - Trade account contact details and notification preferences.

### 2.6 Backoffice Operations & Admin Console (`/admin/*`)
- [x] Constructed unified Backoffice Layout (`components/admin/admin-header.tsx`, `admin-sidebar.tsx`) with staff role indicator and workspace switcher.
- [x] Built **Operations Dashboard** (`components/admin/views/dashboard-view.tsx`):
  - Real-time pipeline counters (New Intakes, Sourcing Queue, Ready to Quote, Awaiting Payment, In Transit).
  - Financial turnover, pending supplier PO commitments, and logistics alerts.
- [x] Built **Unified Request Pipeline Table** (`components/admin/views/requests-table-view.tsx`):
  - Multi-column filtering by status, vehicle make, customer, and date.
  - Fast search by Universal Reference ID (`AH-P-XXXXXX`).
- [x] Built **Deep Request Workspace & Tab System** (`components/admin/request-workspace/`):
  - `overview-tab.tsx`: Complete vehicle specs, customer notes, and urgent indicators.
  - `sourcing-tab.tsx`: Register Japanese supplier bids (Tokyo, Osaka, Nagoya) with FOB prices in JPY.
  - `quote-tab.tsx`: Landed-cost formulation engine, profit margin adjusters, and quote publishing controls.
  - `invoice-tab.tsx`: Commercial invoice issuance, GST breakdown, and PDF preview.
  - `payment-tab.tsx`: Commercial payment gatekeeper reconciliation; manual payment verification.
  - `shipment-tab.tsx`: Carrier assignment, AWB generation, and 5-stage milestone progression controls.
  - `documents-tab.tsx`: Export certificates, Japanese de-registration docs, and commercial bills.
  - `activity-tab.tsx`: Chronological immutable audit trail of all staff and customer actions.
- [x] Built **Supplier Management Directory** (`components/admin/views/suppliers-view.tsx`):
  - Japanese dismantler and auction house profiles, rating grades, contact details, and fulfillment metrics.
- [x] Built **Trade Customer Management** (`components/admin/views/customers-view.tsx`):
  - Workshop approval queue, credit limits, account status (`Active`, `Pending Approval`, `Suspended`).
- [x] Built **Finance & Invoices Console** (`components/admin/views/payments-view.tsx`).
- [x] Built **Logistics & Freight Controls** (`components/admin/views/shipments-view.tsx`).

### 2.7 Global Command Palette & Instant Search (`⌘K`)
- [x] Built `components/shared/global-search-modal.tsx`:
  - Accessible from anywhere in the application via `⌘K` (Mac) or `Ctrl+K` (Windows).
  - Instant search across all part requests, customers, Japanese suppliers, vehicles, and invoices.
  - Quick action shortcuts (Create Request, Switch Persona, Navigate to Portals).

### 2.8 Complete Architectural & Engineering Documentation
- [x] Authored [README.md](file:///f:/Project-Personal-Portfolio/jdmhub/README.md) (Primary Repository Entry & Engineering Guide).
- [x] Authored [PRD.md](file:///f:/Project-Personal-Portfolio/jdmhub/PRD.md) (Product Requirements Document).
- [x] Authored [Architecture.md](file:///f:/Project-Personal-Portfolio/jdmhub/Architecture.md) (System Architecture Specification).
- [x] Authored [DESIGN.md](file:///f:/Project-Personal-Portfolio/jdmhub/DESIGN.md) (Design System & UI Tokens).
- [x] Authored [Rules.md](file:///f:/Project-Personal-Portfolio/jdmhub/Rules.md) (Development Rules, Coding Standards & Problem Structure).
- [x] Authored [Memory.md](file:///f:/Project-Personal-Portfolio/jdmhub/Memory.md) (Living Project Memory & State).

---

## 3. In Progress

### 3.1 Active In-Flight Tasks & Polish

Current development efforts are focused on polish, data flow optimization, and edge-case handling across existing surfaces:

1. **State Synchronization Hardening**:
   - Enhancing cross-tab synchronization so that when a payment is marked as "Paid" in the Admin console, open Customer Portal tabs immediately update their invoice status without requiring a manual page refresh.
2. **Dynamic PDF Generation & Print Media Styles**:
   - Refining `@media print` CSS rules in `components/shared/invoice-document.tsx` so commercial tax invoices and supplier purchase orders print cleanly onto standard A4 paper with exact margins and barcodes.
3. **Enhanced Vehicle Fitment Guidance**:
   - Adding visual helper diagrams and tooltips to the customer request wizard for commonly confused Japanese chassis codes (e.g. distinguishing between Nissan Silvia `S14 Zenki` vs. `S14 Kouki`, or Subaru Impreza `GC8` revisions A–G).

---

### 3.2 Immediate Next Priorities (Sprint Backlog)

The following items represent the immediate engineering priorities for the upcoming cycle:

| Priority | Task Description | Target Files / Scope | Complexity |
| :--- | :--- | :--- | :--- |
| **P1** | **Automated Toast Notification System**: Replace remaining browser `alert()` invocations with a unified, non-blocking toast notification queue. | `components/ui/toast.tsx`, `context/toast-context.tsx` | Low |
| **P1** | **Advanced Multi-Part Intake**: Allow trade customers to bundle multiple required components (e.g., front bumper + lip + mounting brackets) under a single master intake ID. | `components/portal/new-request-modal.tsx`, `types/shared.ts` | Medium |
| **P2** | **Supplier PO Export Engine**: Generate downloadable formal Japanese-language Purchase Order sheets (`発注書 - Hacchūsho`) for direct emailing to suppliers. | `components/admin/request-workspace/tabs/documents-tab.tsx` | Medium |
| **P2** | **Live FX Rate Fetcher with Fallback**: Integrate a live currency exchange API (JPY to NZD) with cached fallbacks to update daily landed-cost pricing dynamically. | `lib/fx-service.ts`, `lib/shared-mock-data.ts` | Medium |
| **P3** | **Exportable CSV / Excel Reports**: Add one-click CSV export for monthly workshop spend reports and backoffice customs clearance manifests. | `components/portal/documents-view.tsx`, `components/admin/views/payments-view.tsx` | Low |

---

### 3.3 Medium-Term Integration Roadmap

To transition JDMHub from client-side simulation into full enterprise production, the following platform milestones are scheduled:

1. **Backend Database & Server Actions Migration**:
   - Migrate in-memory and `localStorage` stores to a robust relational database (PostgreSQL via Supabase or Prisma ORM).
   - Implement Next.js Server Actions with row-level security (RLS) enforcing strict tenant separation between independent workshops.
2. **Real-Time Payment Gateway Integration**:
   - Integrate Stripe Elements / Stripe New Zealand for direct credit card handling and automated webhook listener for payment confirmations.
   - Support New Zealand POLi / direct bank deposit matching for instant invoice clearance.
3. **Courier & Logistics Carrier Webhooks**:
   - Connect API tracking webhooks from Toll New Zealand, NZ Post, Mainfreight, and international air freight carriers (DHL Express, FedEx) for automatic milestone advancement.
4. **Japanese Auction Scraping & API Connectors**:
   - Integrate direct data feeds from USS, ARAI, and Yahoo Japan Auctions for automated price estimation and lot tracking.

---

### 3.4 Known Technical Debt & Edge Case Monitoring

1. **LocalStorage Quota Limits**:
   - In browser environments with heavy image uploads, storing base64 image strings directly inside `localStorage` can approach the 5MB domain quota.
   - *Mitigation strategy*: Compress image attachments to thumbnail representations or store mock image keys rather than raw byte strings until remote object storage (AWS S3 / Cloudflare R2) is wired up.
2. **ESLint Configuration Warning**:
   - Running `npm run lint` prompts for ESLint configuration selection.
   - *Action required*: Commit a standard `.eslintrc.json` with `@next/eslint-plugin-next` to allow non-interactive CI/CD lint checking.
3. **Timezone Harmonization**:
   - The application handles timestamps across two distinct timezones: Japan Standard Time (JST, UTC+9) and New Zealand Standard/Daylight Time (NZST/NZDT, UTC+12/UTC+13).
   - *Standard enforced*: All timestamps stored in the database must use ISO 8601 UTC strings (`new Date().toISOString()`), with display formatting converted locally at the presentation layer.
