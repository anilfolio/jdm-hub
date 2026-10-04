# JDMHub Product Requirements Document (`PRD.md`)

**Document Version:** 1.0.0  
**Status:** Approved / Active MVP Specification  
**Project:** JDMHub B2B Automotive Procurement Platform  
**Target Market:** New Zealand Automotive Trade & Japanese Dismantler/Supplier Ecosystem  
**Last Updated:** October 2026  

---

## Table of Contents
1. [Product Overview](#1-product-overview)
   - [1.1 Executive Summary](#11-executive-summary)
   - [1.2 Product Vision & Mission](#12-product-vision--mission)
   - [1.3 Strategic Positioning & Value Proposition](#13-strategic-positioning--value-proposition)
   - [1.4 Platform Topology & Multi-Surface Architecture](#14-platform-topology--multi-surface-architecture)
2. [Problem Statement](#2-problem-statement)
   - [2.1 Industry Context](#21-industry-context)
   - [2.2 Core Market Pain Points](#22-core-market-pain-points)
   - [2.3 The Cost of Inaction: Current vs. Target State](#23-the-cost-of-inaction-current-vs-target-state)
3. [Goals & Success Metrics](#3-goals)
   - [3.1 Strategic Business Goals](#31-strategic-business-goals)
   - [3.2 User Experience Goals](#32-user-experience-goals)
   - [3.3 Operational & Quality Objectives](#33-operational--quality-objectives)
   - [3.4 Key Performance Indicators (KPIs)](#34-key-performance-indicators-kpis)
4. [Target Users & Customer Personas](#4-targets-users)
   - [4.1 User Segmentation Matrix](#41-user-segmentation-matrix)
   - [4.2 Persona 1: Independent Workshop Owner / Head Tech](#42-persona-1-independent-workshop-owner--head-tech)
   - [4.3 Persona 2: Dealership & Commercial Fleet Parts Manager](#43-persona-2-dealership--commercial-fleet-parts-manager)
   - [4.4 Persona 3: Internal Sourcing & Procurement Coordinator](#44-persona-3-internal-sourcing--procurement-coordinator)
   - [4.5 Persona 4: Finance & Operations Controller](#45-persona-4-finance--operations-controller)
5. [Core Features (MVP Phase)](#5-core-feature--mvp-phase-)
   - [5.1 Single Lifecycle Intake & Universal Reference Engine (`AH-P-XXXXXX`)](#51-single-lifecycle-intake--universal-reference-engine-ah-p-xxxxxx)
   - [5.2 Vehicle & Part Technical Specifications Intake](#52-vehicle--part-technical-specifications-intake)
   - [5.3 Supplier Sourcing & Multi-Quote Comparison Engine](#53-supplier-sourcing--multi-quote-comparison-engine)
   - [5.4 Dynamic Landed-Cost Calculation & Quote Formulation Engine](#54-dynamic-landed-cost-calculation--quote-formulation-engine)
   - [5.5 Customer Self-Service Quote Review & Digital Acceptance](#55-customer-self-service-quote-review--digital-acceptance)
   - [5.6 Invoicing & Commercial Payment Gatekeeper Engine](#56-invoicing--commercial-payment-gatekeeper-engine)
   - [5.7 Supplier Purchase Order (PO) Release & Handover Manifest](#57-supplier-purchase-order-po-release--handover-manifest)
   - [5.8 Real-Time Cross-Border Milestone Consignment Tracking](#58-real-time-cross-border-milestone-consignment-tracking)
   - [5.9 Verified New Zealand Address & Workshop Delivery Management](#59-verified-new-zealand-address--workshop-delivery-management)
   - [5.10 Global Command Palette & Unified Instant Search (`⌘K` / `Ctrl+K`)](#510-global-command-palette--unified-instant-search-k--ctrlk)
   - [5.11 Role-Based Access Control (RBAC) & Audit Log](#511-role-based-access-control-rbac--audit-log)
   - [5.12 MVP Non-Functional Requirements (NFRs)](#512-mvp-non-functional-requirements-nfrs)
   - [5.13 Out-of-Scope for MVP (Future Roadmap)](#513-out-of-scope-for-mvp-future-roadmap)

---

## 1. Product Overview

### 1.1 Executive Summary
**JDMHub** is an end-to-end B2B automotive procurement platform specifically designed to modernize, de-risk, and accelerate the sourcing of Japanese Domestic Market (JDM), European-spec, and rare OEM vehicle components from Japanese auctions, dismantlers, and specialized Tier-1 suppliers into New Zealand automotive workshops, dealerships, and fleet maintenance centers.

By integrating multi-supplier sourcing, transparent landed-cost pricing (incorporating tariffs, air/sea logistics, and NZ GST), strict financial payment gatekeeping, and milestone-based shipment tracking into a single synchronized system, JDMHub replaces the fragmented, error-prone ecosystem of disparate emails, messaging channels, and spreadsheets with an institutional-grade digital workflow.

### 1.2 Product Vision & Mission
- **Vision:** To become the premier digital trade bridge connecting Australasian automotive repair professionals directly with Japan's premier parts networks, providing radical cost transparency, zero fitment ambiguity, and end-to-end consignment accountability.
- **Mission:** Empower mechanics and procurement specialists to source any vehicle part from Japan with the same speed, financial confidence, and delivery predictability as ordering from a local domestic warehouse.

### 1.3 Strategic Positioning & Value Proposition
Unlike generic consumer importing agents or classified marketplaces, JDMHub is engineered exclusively for **trade operations**:
1. **Universal Lifecycle ID (`AH-P-XXXXXX`):** Every request is tagged with an immutable identifier that binds the initial workshop inquiry, Japanese vendor invoices, customs declarations, and local courier waybills into a single auditable thread.
2. **True Landed-Cost Transparency:** Workshops receive quotes with guaranteed final landed prices in NZD—including Japanese FOB charges, currency fluctuation buffers, international air/sea freight, import customs tariffs, local handling, and 15% NZ GST.
3. **Automated Risk Mitigation (Payment Gatekeeper):** Internal procurement cannot release Japanese supplier purchase orders (POs) until trade customer invoices are verified as `Paid`, eliminating bad debt and stranded inventory liabilities.
4. **Workshop Bay-Level Delivery Assurance:** Verified NZ postal lookups and hoist-specific delivery instructions ensure components are routed directly into the technician's workstation without logistic delays.

### 1.4 Platform Topology & Multi-Surface Architecture
JDMHub delivers a synchronized, multi-portal experience operating on a unified data layer:

```
                                  ┌────────────────────────┐
                                  │      JDMHub Entry      │
                                  │       (Root /)         │
                                  └───────────┬────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
         ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
         │   Public Marketing  │   │   Customer Trade    │   │  Internal Admin &   │
         │     & Acquisition   │   │       Portal        │   │ Procurement Ops     │
         │         (/)         │   │    (/customer/*)    │   │     (/admin/*)      │
         └─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

- **Public Marketing & Acquisition (`/`):** High-converting storefront featuring interactive landed-cost calculators, live platform metrics, guest intake workflows, and trade account application funnels.
- **Customer Trade Portal (`/customer/*`):** High-efficiency self-service dashboard for registered workshops to submit VIN-based inquiries, review multi-option quotes (Air vs. Sea), approve quotations, settle invoices, track live consignments, and manage workshop delivery profiles.
- **Internal Admin & Procurement Workspace (`/admin/*`):** High-density command center for procurement officers, sourcing specialists, and finance controllers to manage multi-supplier negotiations, landed-cost margin calculations, PO releases, logistics dispatches, and invoice verification.

---

## 2. Problem Statement

### 2.1 Industry Context
New Zealand has one of the highest per-capita vehicle ownership rates in the OECD, with over 4.4 million registered vehicles. A substantial proportion consists of second-hand Japanese used imports and performance JDM platforms (e.g., Toyota, Nissan, Subaru, Honda, Mazda, Mitsubishi), alongside Japanese-imported European vehicles (BMW, Audi, Mercedes-Benz).

Despite heavy domestic demand for replacement parts, performance upgrades, and collision repair assemblies, sourcing authentic components directly from Japan remains an antiquated, fragmented, and commercially risky ordeal for New Zealand trade businesses.

### 2.2 Core Market Pain Points

| Pain Point | Traditional Sourcing Reality | Consequence on NZ Workshops |
| :--- | :--- | :--- |
| **Fragmented Communication** | Requests negotiated over scattered WhatsApp/LINE chats, emails, and unindexed Japanese auction listings. | Lost part numbers, lack of paper trails, communication breakdowns, and delayed customer jobs. |
| **Opaque Landed Costs** | Suppliers quote in Japanese Yen (JPY) under FOB terms. Mechanics must guess international freight, customs clearance, biosecurity fees, and GST. | Unanticipated surprise charges at customs; workshops frequently suffer negative margins on repair jobs. |
| **Fitment Inaccuracy & Verification** | Parts ordered based on vague descriptions without Japanese chassis/VIN translation, leading to mismatched sub-models or engine variations. | Non-returnable international parts left sitting in workshops as dead capital; hoist bay occupied for weeks. |
| **Unsecured Financial Exposure** | Procurement teams order parts from overseas suppliers before securing customer payment, or customers dispute unanticipated shipping bills. | Cash flow bottlenecks, bad debt, high chargeback exposure, and unpaid overseas supplier commitments. |
| **Zero Supply-Chain Visibility** | Once shipped from Tokyo or Osaka, tracking is restricted to localized Japanese carrier tracking until port arrival. | Mechanics cannot provide accurate vehicle ready-dates to car owners, crippling workshop bay turnover. |

### 2.3 The Cost of Inaction: Current vs. Target State

```
TRADITIONAL / BROKEN WORKFLOW:
Workshop Inquiry ──> 3 Days WhatsApp Chat ──> Unclear JPY Quote ──> Part Ordered Blindly ──> Surprise NZ Customs Bill ──> Wrong Part Arrives ──> Loss & Conflict

JDMHUB STREAMLINED WORKFLOW:
VIN Intake ──> Multi-Supplier Compare ──> Guaranteed NZD Landed Quote ──> Customer Signs & Pays ──> Auto PO Release ──> 5-Stage Live Tracking ──> Hoist Bay Delivery
```

---

## 3. Goals

### 3.1 Strategic Business Goals
- **BG-01:** Establish JDMHub as the trusted B2B procurement standard for NZ independent garages, franchise dealerships, and performance tuners.
- **BG-02:** Achieve profitable unit economics from Day 1 through automated landed-cost margin calculations and zero uncollected customer receivables.
- **BG-03:** Drive trade account retention through transparency, rapid quote turnaround, and consistent fulfillment reliability.

### 3.2 User Experience Goals
- **UG-01 (Speed):** Enable workshop managers to submit an accurate, VIN-backed part inquiry in under 90 seconds.
- **UG-02 (Certainty):** Provide 100% pricing certainty with zero hidden landing fees, customs tariffs, or surprise freight surcharges.
- **UG-03 (Clarity):** Offer real-time visual milestone tracking from Japanese warehouse origin to the local workshop delivery dock.
- **UG-04 (Ergonomics):** Deliver a distraction-free, high-density interface optimized for dirty-hands shop tablets, counter desktops, and office dual-monitors.

### 3.3 Operational & Quality Objectives
- **OG-01 (Zero Financial Leakage):** Enforce strict system-level gatekeeping where no supplier purchase order can be issued without full customer payment clearance.
- **OG-02 (Quote Turnaround SLA):** Target internal sourcing quote generation within ≤ 4 business hours for high-demand parts and ≤ 24 hours for rare/auction assemblies.
- **OG-03 (Fitment Accuracy):** Maintain a ≥ 99.2% fitment accuracy rate through mandatory Japanese chassis code/VIN capture and dual-party confirmation before dispatch.
- **OG-04 (Traceability):** 100% of orders tracked under the single canonical `AH-P-XXXXXX` reference ID across customer, admin, and supplier documents.

### 3.4 Key Performance Indicators (KPIs)

```
┌─────────────────────────────────┬───────────────────┬───────────────────┐
│ Metric                          │ Baseline (Manual) │ MVP Target        │
├─────────────────────────────────┼───────────────────┼───────────────────┤
│ Average Time-to-Quote           │ 24–48 Hours       │ < 4 Hours         │
│ Quote-to-Order Conversion Rate  │ 18%               │ > 38%             │
│ Bad Debt / Unpaid Supplier POs  │ 4.2%              │ 0.0% (Gatekeeper) │
│ Customer Sourcing Inquiries/Mo  │ N/A (New Product) │ 250+ in Month 3   │
│ Customer Retention / Repeat MoM │ 25%               │ > 65%             │
│ Part Fitment Discrepancy Rate   │ 8.5%              │ < 1.0%            │
└─────────────────────────────────┴───────────────────┴───────────────────┘
```

---

## 4. Targets Users

### 4.1 User Segmentation Matrix

| User Segment | Typical Organization | Primary Motivation | Key Frustrations | Primary Surface |
| :--- | :--- | :--- | :--- | :--- |
| **Independent Workshop** | 2–6 bay auto repair shop | Clear vehicle out of bay quickly; get genuine or high-grade parts. | Unclear ETAs, wrong fitment, untracked couriers. | Customer Portal (`/customer`) |
| **Performance Tuner / Specialist** | JDM modification & drift/track shop | Rare JDM engines, manual gearboxes, discontinued trims, Grade-A used. | Japanese language barrier, unresponsive brokers. | Customer Portal (`/customer`) |
| **Dealership / Fleet Manager** | Multi-branch fleet servicing / commercial | Predictable landed costs, formal GST invoices, bulk order discounts. | Lack of GST tax compliance, ad-hoc personal credit card payments. | Customer Portal (`/customer`) |
| **Procurement Coordinator** | JDMHub Internal Ops | Rapid multi-supplier pricing, accurate freight calculation, fast PO turnover. | Missing VIN data, manual currency math, messy inbox. | Admin Workspace (`/admin`) |
| **Finance Controller** | JDMHub Internal Ops | Cash flow protection, gross margin retention, audit trails. | POs released before payment, missing payment references. | Admin Workspace (`/admin`) |

---

### 4.2 Persona 1: Independent Workshop Owner / Head Tech
- **Name:** Dave Miller
- **Role:** Owner & Lead Technician at "Apex Automotive Ltd" (Auckland, NZ)
- **Profile:** 20 years in the trade. Specializes in Japanese imports (Toyota, Subaru, Nissan). Runs 4 hoist bays with 3 apprentice technicians.
- **Pain Points:** "I have a Nissan Stagea RS Four occupying Bay 2 waiting for a rear differential. The customer is calling every day. I emailed two suppliers in Japan and got no reply for 4 days. If I order the wrong part, I'm out $1,500 and my customer loses patience."
- **Needs:**
  - Fast mobile/desktop intake where he enters the Japanese chassis code (`WGNC34-XXXXXX`).
  - Clear choice between rapid Air Express (5–7 days) and economical Sea Freight (21–28 days).
  - One-click digital approval and formal tax invoice for his accounting software.
  - Tracking link to show the customer exactly where the crate is in transit.

---

### 4.3 Persona 2: Dealership & Commercial Fleet Parts Manager
- **Name:** Sarah Jenkins
- **Role:** Parts Sourcing Manager at "Metro Commercial Fleets" (Christchurch, NZ)
- **Profile:** Manages a fleet of 180 imported Japanese light commercial vans (Toyota HiAce, Isuzu Elf, Nissan Caravan).
- **Pain Points:** "Auditors require full GST compliance, official purchase orders, and itemized freight documentation. Sourcing via random Facebook groups or unverified import agents is not acceptable."
- **Needs:**
  - Multiple saved workshop branch delivery addresses with hoist delivery notes.
  - Transparent itemized GST invoices with NZ business registration and bank transfer details.
  - Clear part grading taxonomy (Brand New OEM vs. Certified Used Grade A).

---

### 4.4 Persona 3: Internal Sourcing & Procurement Coordinator
- **Name:** Kenji Takahashi
- **Role:** Senior Sourcing Specialist at JDMHub (Bilingual English/Japanese)
- **Profile:** Stationed between Auckland and Osaka. Coordinates with Japanese suppliers, Yahoo! Auctions partners, and dismantlers across Japan.
- **Pain Points:** "Suppliers send quotes in Yen with different delivery terms (FOB, CIF, Domestic delivery). Manually calculating landed costs, adding freight, adjusting for exchange rates, and typing emails takes 40 minutes per request."
- **Needs:**
  - Centralized sourcing tab where multiple supplier quotations can be compared side-by-side.
  - One-click Landed-Cost Calculator that applies company trade margins, freight rates, and 15% GST automatically.
  - Automated quote generation and customer notification.

---

### 4.5 Persona 4: Finance & Operations Controller
- **Name:** Rachel Adams
- **Role:** Operations & Finance Director at JDMHub
- **Profile:** Responsible for platform liquidity, trade margins, customs compliance, and supplier disbursements.
- **Pain Points:** "If a sourcing agent orders a $3,000 engine from Japan before the customer pays, and the customer backs out, JDMHub is stuck with dead inventory and freight debt."
- **Needs:**
  - Hard system gatekeeping: The "Release PO" button must remain completely disabled until the request status is `Paid`.
  - Immutable audit logs capturing who approved quotes, accepted terms, and confirmed payments.

---

## 5. Core Feature (MVP PHASE)

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                 JDMHUB CORE MVP WORKFLOW                                  │
│                                                                                           │
│  [1. Intake]     --> [2. Sourcing]      --> [3. Landed Quote]  --> [4. Acceptance]        │
│  VIN & Part Spec     Multi-Vendor JPY       Auto Margin & GST      Digital Sign-off       │
│                                                                           │               │
│                                                                           ▼               │
│  [7. Delivery]   <-- [6. PO Release]    <-- [5. Gatekeeper]    <-- [Invoice & Payment]    │
│  5-Stage Tracking    Japanese Vendor        PO Blocked Until Paid  Bank Transfer / Reference│
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

The MVP Phase focuses strictly on the core revenue-generating procurement pipeline.

---

### 5.1 Single Lifecycle Intake & Universal Reference Engine (`AH-P-XXXXXX`)
- **Description:** A unified, immutable reference number generated upon request submission that anchors all database records, customer notifications, supplier communications, and shipping manifests.
- **Specifications:**
  - Format: `AH-P-` followed by a 6-digit zero-padded number (e.g., `AH-P-000123`).
  - Readily copyable with a single click across all UI headers, tables, and badge components.
  - Persists across all 11 lifecycle statuses:
    `Submitted` → `Sourcing` → `Quoted` → `Approved` → `Invoicing` → `Awaiting Payment` → `Ordered` → `Ready for Dispatch` → `Shipped` → `Delivered` → `Completed`.

---

### 5.2 Vehicle & Part Technical Specifications Intake
- **Description:** Structured intake forms designed specifically for Japanese domestic and grey-import vehicles, eliminating the back-and-forth ambiguity of generic forms.
- **Input Fields:**
  - **Vehicle Specifications:** Make, Model, Year, VIN / Chassis Number (e.g., `BNR34-001234`, `JZX100-004321`), NZ Registration / Plate (optional), Engine Code (e.g., `RB26DETT`, `2JZ-GTE`), Transmission (Manual 5/6MT, Auto), Drive Config (AWD, RWD, FWD).
  - **Part Requirements:** Part Name, OEM Part Number (if known), Quantity requested.
  - **Part Preference:** `Genuine OEM`, `OEM Supplier Tier 1`, `Quality Aftermarket`, `Any Suitable Alternative`.
  - **Condition Requirement:** `Brand New OEM`, `Brand New Certified Aftermarket`, `Used Grade A`, `Remanufactured`.
  - **Logistics Preference:** `Air Express (5-7 Days)` vs. `Sea Freight (21-28 Days)` vs. `No Preference`.
  - **Inspection & Attachment Upload:** Drag-and-drop support for photo references, sample tags, damaged part photos, and workshop job sheets (JPG, PNG, PDF up to 10MB).

---

### 5.3 Supplier Sourcing & Multi-Quote Comparison Engine
- **Description:** Internal back-office module in `/admin/requests/[id]` allowing sourcing coordinators to record and compare quotations from multiple Japanese suppliers.
- **Capabilities:**
  - Record supplier name, contact, country (Japan - Tokyo, Osaka, Nagoya, Fukuoka, etc.), supplier part reference, and stock availability (`In Stock`, `Available`, `Back Order`, `Out of Stock`).
  - Capture base supplier cost (JPY converted to NZD) and domestic Japanese freight.
  - Direct side-by-side comparison matrix highlighting cost differential, estimated lead time (days), and condition.
  - Radio selection to mark one quotation as the **Active/Selected Supplier Quotation**.

---

### 5.4 Dynamic Landed-Cost Calculation & Quote Formulation Engine
- **Description:** An automated margin and tax calculation engine that converts the selected supplier quote into a guaranteed, customer-facing NZD quotation.
- **Formula & Logic:**
  $$\text{Base Cost} = \text{Supplier Part Cost} + \text{Supplier Japanese Freight}$$
  $$\text{Trade Margin} = \text{Base Cost} \times \left(\frac{\text{Margin \%}}{100}\right) \quad (\text{Default: } 18\% - 25\%)$$
  $$\text{Customer Sell Price (ex GST)} = \text{Base Cost} + \text{Trade Margin}$$
  $$\text{Air Freight Option} = \text{Air Freight Cost} \quad (\text{Fast Transit: } 5\text{--}8 \text{ days})$$
  $$\text{Sea Freight Option} = \text{Sea Freight Cost} \quad (\text{Economical: } 21\text{--}30 \text{ days})$$
  $$\text{GST Amount} = (\text{Customer Sell Price} + \text{Selected Freight}) \times 0.15$$
  $$\text{Total Landed Quote} = \text{Customer Sell Price} + \text{Selected Freight} + \text{GST Amount}$$
- **Version Trail & Expiry:**
  - Automated revision history (Version 1, Version 2, etc.) for renegotiated quotes.
  - Configurable validity window (e.g., Valid for 7 calendar days) with live countdown badge.

---

### 5.5 Customer Self-Service Quote Review & Digital Acceptance
- **Description:** Interactive customer interface in `/customer/quotes` and `/customer/requests/[id]` for workshop decision-makers to inspect quotes, choose logistics speeds, and legally execute approvals.
- **Capabilities:**
  - **Dynamic Freight Toggle:** Switch between Air Express and Sea Freight with instant recalculation of total landed cost and arrival ETA.
  - **Detailed Parts & Condition Breakdown:** View OEM numbers, condition tags, warranty terms, and high-resolution supplier inspection photos.
  - **Digital Approval Modal:** Mandatory audit checklist requiring the user to verify vehicle details, part fitment specifications, and workshop delivery address.
  - **Legal Audit Trail:** Timestamped capture of `acceptedBy`, `userRole`, `acceptedAt`, and IP address for compliance and non-repudiation.
  - **Alternative Actions:** `Reject Quote` or `Request More Information` with direct messaging back to the procurement desk.

---

### 5.6 Invoicing & Commercial Payment Gatekeeper Engine
- **Description:** The core financial risk mitigation engine of JDMHub. Controls invoice generation, payment reconciliation, and access control for supplier ordering.
- **Key Mechanics:**
  - **Invoice Generation:** Automatically generates formal NZ GST tax invoices upon quote acceptance, complete with JDMHub GST registration number, invoice number, itemized lines, and payment instructions.
  - **Payment Methods Supported (MVP):** Direct NZ Domestic Bank Transfer (Account Name, Bank, Account Number, Swift) and Credit/Debit Card reference logging.
  - **The Strict Gatekeeper Rule:**
    > **CRITICAL SYSTEM GATEKEEPER:** The "Release Purchase Order" and "Order from Supplier" action buttons in the Admin Workspace are **strictly disabled** while `paymentStatus == 'Unpaid'`. 
    > A prominent red banner warns: *"Purchase Order locked: Customer payment of $X,XXX.XX NZD must be reconciled before ordering from Japanese supplier."*
  - **Payment Reconciliation:** Finance staff can mark payment as `Paid` upon bank verification, recording reference ID, timestamp, and audit actor, which immediately unlocks downstream procurement actions.

---

### 5.7 Supplier Purchase Order (PO) Release & Handover Manifest
- **Description:** Sourcing operational tooling to execute orders with overseas suppliers once payment is secured.
- **Capabilities:**
  - One-click generation of the Japanese Supplier Purchase Order containing Japanese part references, agreed JPY/NZD amounts, and internal tracking keys.
  - Supplier Handover Manifest generator containing workshop delivery destination, vehicle summary, and export packaging specifications.
  - Status transition from `Awaiting Payment` → `Ordered` upon PO dispatch.

---

### 5.8 Real-Time Cross-Border Milestone Consignment Tracking
- **Description:** Visual, five-stage milestone tracker giving both workshops and internal ops granular visibility over international transport.
- **The 5 Canonical Shipment Milestones:**
  1. `Received At Shipping Facility` (Japan export consolidation hub / Narita / Yokohama).
  2. `In Transit` (Air cargo flight en route or sea freight container vessel sailing).
  3. `Arrived in NZ` (Auckland / Christchurch port, undergoing Customs & MPI Biosecurity clearance).
  4. `Out For Delivery` (Local courier / freight carrier vehicle dispatched to workshop).
  5. `Delivered` (Signed for and received at workshop hoist bay).
- **Consignment Metadata:** Carrier name, external tracking URL, carrier tracking code, origin, destination, estimated arrival date, and milestone event log with timestamps.

---

### 5.9 Verified New Zealand Address & Workshop Delivery Management
- **Description:** Dedicated address management engine ensuring rapid delivery directly to workshop hoist bays.
- **Capabilities:**
  - Address book storing multiple workshop branches, counter desks, and storage facilities.
  - NZ Postcode and Suburb structure (Street address, Suburb, City, Postal Code).
  - Explicit **Delivery Instructions** field (e.g., *"Drop at Hoist Bay 3 behind main showroom, ask for Dave"*).
  - One-click address selection during intake and quote checkout.

---

### 5.10 Global Command Palette & Unified Instant Search (`⌘K` / `Ctrl+K`)
- **Description:** Omnipresent keyboard-driven search modal available across all platform surfaces.
- **Capabilities:**
  - Instant indexing and filtering across Reference IDs (`AH-P-*`), Part Names, Makes, Models, VINs, and Customer Business Names.
  - Keyboard navigation (Up/Down arrow keys, Enter to navigate, Escape to dismiss).
  - Direct contextual navigation to both Customer Portal detail pages and Admin workspaces.

---

### 5.11 Role-Based Access Control (RBAC) & Audit Log
- **Roles Defined:**
  - `Customer / Workshop User`: Access restricted strictly to own inquiries, quotes, orders, and addresses.
  - `Procurement Officer`: Access to sourcing tools, supplier quote inputs, landed cost calculations, and dispatch coordination.
  - `Finance & Administrator`: Unrestricted access including payment reconciliation, margin defaults, user management, and system logs.
- **Audit Trails:** Immutable activity timeline tracking every state change, document upload, quote revision, and payment update.

---

### 5.12 MVP Non-Functional Requirements (NFRs)

| Category | Requirement | Target Metric |
| :--- | :--- | :--- |
| **Performance** | Initial page load (LCP) and client transitions | LCP < 1.5s; Client navigation < 200ms |
| **Responsive Design** | Ergonomic support across desktop, tablet, and mobile | Fully functional from 375px mobile screens up to 4K displays |
| **Data Integrity** | Financial rounding and calculations | Exact decimal arithmetic to 2 decimal places in NZD; no float rounding errors |
| **Browser Compatibility** | Modern browser standards | Chrome, Safari, Edge, Firefox (latest 2 versions); touch gestures for tablet shop-floor usage |
| **Accessibility & Contrast** | Visual readability under bright shop lights | High-contrast WCAG 2.1 AA compliant color palette |

---

### 5.13 Out-of-Scope for MVP (Future Roadmap)

The following capabilities are explicitly deferred to **Phase 2 & Phase 3** post-MVP validation:
1. **Phase 2:** Direct real-time bidding API integration with USS Japan & Yahoo! Auctions Japan.
2. **Phase 2:** Automated OCR scanning of Japanese export certificates and registration documents (*Shaken*).
3. **Phase 2:** Integrated NZ Post / Mainfreight API automated tracking webhooks (manual carrier tracking links in MVP).
4. **Phase 3:** Automated multi-currency FX hedge locking engine with live bank rate feeds.
5. **Phase 3:** Native iOS / Android technician mobile application with barcode/QR scanning.
