# JDMHub Design System (`DESIGN.md`)

Welcome to the **JDMHub Design System** documentation. This document specifies the design philosophy, visual foundations, color tokens, typographic scale, and reusable UI components that power the JDMHub B2B automotive procurement platform.

---

## Table of Contents
1. [Design Principles](#1-design-principles)
2. [Color Palette](#2-color-palette)
   - [Brand Primary (JDM Racing Red)](#brand-primary-jdm-racing-red)
   - [Brand Secondary (Heritage Navy)](#brand-secondary-heritage-navy)
   - [Dark Navigation Surfaces](#dark-navigation-surfaces)
   - [Neutral Slate Scale](#neutral-slate-scale)
   - [Status & Lifecycle Mapping](#status--lifecycle-mapping)
   - [Payment & Shipment Badges](#payment--shipment-badges)
   - [CSS Variables & Design Tokens](#css-variables--design-tokens)
3. [Typography](#3-typography)
   - [Font Family](#font-family)
   - [Type Scale & Hierarchy](#type-scale--hierarchy)
   - [Tabular Numerics & Monospace References](#tabular-numerics--monospace-references)
   - [Letter Spacing & Casing Rules](#letter-spacing--casing-rules)
4. [UI Components](#4-ui-components)
   - [Button](#button)
   - [Input](#input)
   - [Alert](#alert)
   - [Status & Milestone Badges](#status--milestone-badges)
   - [Global Search Modal (⌘K Command Palette)](#global-search-modal-k-command-palette)
   - [Sidebar Navigation (Dark Chrome)](#sidebar-navigation-dark-chrome)
   - [Header & App Bar](#header--app-bar)
   - [Modals & Drawers](#modals--drawers)
   - [Tables & Tabular Data](#tables--tabular-data)
   - [Custom Scrollbar & Print Styles](#custom-scrollbar--print-styles)

---

## 1. Design Principles

JDMHub is built for automotive trade professionals, parts managers, mechanics, and procurement coordinators. Every screen and interaction embodies the following five core principles:

### 1.1 Trade-Grade Efficiency & High Density
- **Speed Over Clutter**: Auto technicians and trade buyers work under tight deadlines. Essential data (part numbers, VIN, landed price, delivery ETA) must be visible at a glance without unnecessary clicks.
- **Scannable Information**: Dense tabular lists, compact badge indicators, and clear key-value metadata pairs prevent information overload while keeping workflows rapid.

### 1.2 Radical Transparency & Single Reference ID
- **Single Reference Philosophy**: Every request receives a persistent reference ID (e.g., `AH-P-000123`) from Japanese auction/dismantler to NZ workshop hoist bay.
- **No Mystery Delays**: Transparent landed-cost breakdowns (FOB price, international air/sea freight, customs clearance, GST, trade discount) eliminate quoting surprises.

### 1.3 High-Contrast Dual-Surface Architecture
- **Command & Control (Dark Surface)**: Deep obsidian navigation chrome (`#0C101A`) provides focus, anchors administrative tools, and reduces eye strain.
- **Productivity Canvas (Light Surface)**: Clean, high-contrast slate surfaces (`#F8FAFC` to `#FFFFFF`) for forms, quote reviews, inspection photo galleries, and invoices.

### 1.4 Tactile Feedback & Micro-Interactions
- **Immediate State Changes**: Buttons provide physical-like micro-scale responses (`active:scale-[0.985]`), loading spinners (`Loader2 animate-spin`), and explicit disabled states.
- **Live Status Pulsing**: Real-time events (such as goods *In Transit* or invoices *Awaiting Payment*) incorporate subtle animated pulse indicators.
- **Keyboard Accelerators**: Full keyboard accessibility, including global quick-search via `⌘K` / `Ctrl+K` and escape dismissal for modals.

### 1.5 Workshop-Ready Responsiveness & Touch Ergonomics
- **Shop Floor Compatibility**: Optimized for mobile screens, tablets, and 4K desktop workstations.
- **Ergonomic Tap Targets**: Minimum interactive touch area of 44×44px on mobile devices with `-webkit-overflow-scrolling: touch` for buttery table scrolling.

---

## 2. Color Palette

JDMHub uses a tailored color palette anchored by Japanese motorsport heritage red, institutional trade navy, deep midnight chrome, and an accessible slate neutral scale.

### Brand Primary (JDM Racing Red)
The primary accent color evokes precision engineering, urgency, and high performance. Used for primary CTAs, active highlights, pending payment alerts, and brand emblems.

| Token | Hex Value | Tailwind Class | Primary Usage |
| :--- | :--- | :--- | :--- |
| `brand-red-50` | `#fef2f2` | `bg-red-50` | Error/Urgent tint backgrounds |
| `brand-red-100` | `#fee2e2` | `bg-red-100` | Soft highlight badges |
| `brand-red-200` | `#fecaca` | `border-red-200` | Alert borders |
| `brand-red-300` | `#fca5a5` | `border-red-300` | Interactive focus rings |
| `brand-red-400` | `#f87171` | `text-red-400` | Dark-mode warning text |
| `brand-red-500` / **DEFAULT** | **`#e20c0c`** | `bg-[#e20c0c]` | **Primary brand color & Main CTAs** |
| `brand-red-600` | `#D81419` | `hover:bg-[#D81419]` | Primary button hover state |
| `brand-red-700` | `#9B0A0F` | `active:bg-[#9B0A0F]` | Button press & dark accents |
| `brand-red-800` | `#7A070B` | `text-[#7A070B]` | Deep contrast red |
| `brand-red-900` | `#520507` | `bg-[#520507]` | Deep maroon backgrounds |

### Brand Secondary (Heritage Navy)
Represents logistical reliability, maritime freight corridors, and institutional trade authority.

| Token | Hex Value | Tailwind Class | Primary Usage |
| :--- | :--- | :--- | :--- |
| `brand-navy-50` | `#eef2ff` | `bg-indigo-50` | Logistics tint backgrounds |
| `brand-navy-100` | `#e0e7ff` | `bg-indigo-100` | Soft navy highlights |
| `brand-navy-200` | `#c7d2fe` | `border-indigo-200` | Invoicing container borders |
| `brand-navy-500` / **DEFAULT** | **`#2B4499`** | `bg-[#2B4499]` | **Purchase Orders & Logistics Badges** |
| `brand-navy-600` | `#23377d` | `hover:bg-[#23377d]` | Secondary hover state |
| `brand-navy-700` | `#1b2a60` | `text-[#1b2a60]` | High-contrast headers |
| `brand-navy-900` | `#0b1229` | `bg-[#0b1229]` | Dark navy panels |

### Dark Navigation Surfaces
Used exclusively for the Admin and Customer Portal sidebars, high-contrast tooltips, and overlay headers.

| Surface Token | Hex Value | Tailwind Class | Purpose |
| :--- | :--- | :--- | :--- |
| `brand-dark-sidebar` | `#0C101A` | `bg-[#0C101A]` | Sidebar navigation canvas |
| `brand-dark-card` | `#141B2B` | `bg-[#141B2B]` | Navigation cards & nested menus |
| `brand-dark-hover` | `#182033` | `hover:bg-[#182033]` | Sidebar menu hover state |
| `brand-dark-border` | `#1E2538` | `border-[#1E2538]` | Dark section separators & dividers |

### Neutral Slate Scale
Applied across the primary app layout, data tables, modals, typography, and card containers.

| Step | Hex Value | Role |
| :--- | :--- | :--- |
| `slate-50` | `#F8FAFC` | Page background canvas (`--background-start-rgb`) |
| `slate-100` | `#F1F5F9` | Secondary backgrounds, subtle inputs, inactive tabs |
| `slate-200` | `#E2E8F0` | Default card borders, dividers, table borders |
| `slate-300` | `#CBD5E1` | Input borders, scrollbar thumbs, disabled borders |
| `slate-400` | `#94A3B8` | Placeholder text, inactive icons, scrollbar hover |
| `slate-500` | `#64748B` | Helper captions, metadata labels, breadcrumbs |
| `slate-600` | `#475569` | Secondary body text, table column headers |
| `slate-700` | `#334155` | Strong body text, input labels (`text-slate-700`) |
| `slate-800` | `#1E293B` | Outline button text, modal headings |
| `slate-900` | `#0F172A` | Primary typography (`--foreground-rgb`), hero titles |

---

### Status & Lifecycle Mapping

Status colors are standardized across both Admin and Customer Portals via `lib/status-styles.ts` to guarantee uniform cognitive recognition.

| Lifecycle State | Color Family | Badge Classes (`Tailwind`) | Meaning & Context |
| :--- | :--- | :--- | :--- |
| **Submitted** | Sky | `bg-sky-50 text-sky-700 border-sky-200` | Request received; awaiting team review |
| **Sourcing** | Amber | `bg-amber-50 text-amber-700 border-amber-200` | Parts specialist searching Japan auctions/OEM suppliers |
| **Quoted** | Purple | `bg-purple-50 text-purple-700 border-purple-200` | Official quote ready; landed price breakdown sent |
| **Approved** | Emerald | `bg-emerald-50 text-emerald-700 border-emerald-200` | Customer accepted quote; ready for procurement |
| **Invoicing** | Indigo | `bg-indigo-50 text-indigo-700 border-indigo-200` | Commercial tax invoice generated |
| **Awaiting Payment**| Brand Red | `bg-red-50 text-[#e20c0c] border-red-200` | Immediate action required; PO paused until payment |
| **Ordered** | Navy | `bg-blue-50 text-[#2B4499] border-blue-200` | PO released to Japanese supplier |
| **Ready for Dispatch**| Emerald | `bg-emerald-50 text-emerald-700 border-emerald-200` | Packed, inspected, awaiting flight/freight vessel |
| **Shipped** | Cyan | `bg-cyan-50 text-cyan-800 border-cyan-200` | In international air/ocean freight |
| **Delivered** | Teal | `bg-teal-50 text-teal-700 border-teal-200` | Landed at client workshop / hoist bay |
| **Completed** | Slate | `bg-slate-100 text-slate-700 border-slate-200` | Order closed, documented, and archived |

---

### Payment & Shipment Badges

#### Payment Badges
- **Paid**: `bg-emerald-50 text-emerald-700 border-emerald-200` with solid green dot (`bg-emerald-500`)
- **Unpaid**: `bg-red-50 text-[#e20c0c] border-red-200` with live pulsing red dot (`bg-[#e20c0c] animate-pulse`)

#### Shipment Milestones
- **Facility Received**: `bg-indigo-50 text-indigo-700 border-indigo-200`
- **In Transit**: `bg-cyan-50 text-cyan-800 border-cyan-200` with pulsing dot (`bg-cyan-500 animate-pulse`)
- **Arrived in NZ**: `bg-sky-50 text-sky-800 border-sky-200`
- **Out For Delivery**: `bg-amber-50 text-amber-800 border-amber-200` with pulsing amber dot
- **Delivered**: `bg-emerald-50 text-emerald-800 border-emerald-200`

---

### CSS Variables & Design Tokens

Defined in `app/globals.css`:
```css
:root {
  --brand-red: #e20c0c;
  --brand-red-hover: #D81419;
  --brand-red-dark: #9B0A0F;
  --brand-navy: #2B4499;
  --brand-dark-sidebar: #0C101A;
  --brand-dark-border: #1E2538;
  --brand-dark-card: #141B2B;
  --brand-dark-hover: #182033;
  --foreground-rgb: 15, 23, 42;
  --background-start-rgb: 248, 250, 252;
  --background-end-rgb: 255, 255, 255;
}
```

---

## 3. Typography

### Font Family
The system utilizes **Roboto** from `next/font/google` for its mechanical precision, neutral legibility, and geometric clarity across both high-density data tables and bold editorial headings.

- **Primary Font**: `var(--font-roboto)`, `Roboto`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `sans-serif`
- **Weights Used**:
  - `300` (Light) — Subdued technical subtitles
  - `400` (Regular) — Body copy, table cells, descriptions
  - `500` (Medium) — Table headers, input values, button labels
  - `700` (Bold) — Form labels, card headings, sub-totals
  - `900` (Black) — Display headings, hero titles, brand logos

```typescript
// app/layout.tsx
const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});
```

---

### Type Scale & Hierarchy

| Role | Font Size / Line Height | Weight | Tailwind Utility Classes | Example Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero / Display** | 48px / 1.1 (3rem) | Black (`900`) | `text-4xl sm:text-5xl font-black tracking-tight` | Landing page hero statements |
| **Page Title (H1)** | 24px - 30px (1.5rem - 1.875rem) | Black (`900`) | `text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900` | Portal header, dashboard headers |
| **Section Title (H2)** | 20px - 24px (1.25rem - 1.5rem) | Extrabold (`800`) | `text-lg sm:text-xl font-bold tracking-tight text-slate-900` | Modal headers, card section titles |
| **Card Header (H3)** | 16px - 18px (1rem - 1.125rem) | Bold (`700`) | `text-base sm:text-lg font-bold text-slate-900` | Widget card titles, invoice items |
| **Eyebrow / Form Label** | 12px / 1.2 (0.75rem) | Bold (`700`) | `text-xs font-bold uppercase tracking-wider text-slate-700` | Input labels, table category caps |
| **Body (Default)** | 14px / 1.5 (0.875rem) | Regular (`400`) | `text-sm font-normal text-slate-700 leading-relaxed` | General body, table cell text |
| **Body (Prominent)** | 16px / 1.5 (1rem) | Regular/Medium | `text-base text-slate-800 leading-relaxed` | Value propositions, quote intros |
| **Caption / Meta** | 12px / 1.4 (0.75rem) | Medium (`500`) | `text-xs text-slate-500 font-medium` | Timestamps, helper notes, badges |
| **Micro Caption** | 11px / 1.3 | Semi/Medium | `text-[11px] font-semibold text-slate-400` | Keyboard hints (`⌘K`), micro tags |

---

### Tabular Numerics & Monospace References
To prevent misalignment in pricing breakdowns, part codes, and vehicle chassis codes:
- **Tabular Numbers**: Enabled globally for all `<table>` elements via `font-variant-numeric: tabular-nums;`.
- **Reference Identifiers**: Formatted in monospaced or high-clarity medium weights (e.g., `AH-P-000123`, `RB26-DETT-049102`, `NZD $1,450.00`).

---

### Letter Spacing & Casing Rules
1. **Headings**: Always use `tracking-tight` (`letter-spacing: -0.025em`) for titles `text-lg` and above to maintain punchy optical density.
2. **Category Eyebrows & Form Labels**: Always use `uppercase tracking-wider` (`letter-spacing: 0.05em`) with `text-xs font-bold`.
3. **Reference Badges**: Use `uppercase` for SKU codes, VINs, and trade currencies (`NZD`, `JPY`, `USD`).

---

## 4. UI Components

The JDMHub UI component library is built with modular React components styled with Tailwind CSS, utilizing `clsx` and `tailwind-merge` (`cn(...)` utility) for reliable class composition.

---

### Button
**File**: `components/ui/button.tsx`

The `Button` component is the workhorse of user interaction, featuring five stylistic variants, three sizes, built-in loading states with Lucide spinners, and slots for left/right icons.

#### Variants
- **`primary`**: Red background (`bg-[#e20c0c] hover:bg-[#D81419]`), white text, subtle shadow, ring focus.
- **`secondary`**: Dark slate (`bg-slate-900 hover:bg-slate-800`), white text, high contrast.
- **`outline`**: White card background (`bg-white hover:bg-slate-50`), slate border (`border-slate-300`), dark slate text.
- **`ghost`**: Transparent background (`hover:bg-slate-100`), clean icon/dismiss trigger.
- **`danger`**: Red alert background (`bg-red-600 hover:bg-red-700`), destructive actions.

#### Sizes
- **`sm`**: `h-9 px-3.5 text-xs gap-1.5` (compact table action buttons)
- **`md`**: `h-12 px-5 text-sm gap-2` (standard forms and dialogs)
- **`lg`**: `h-[50px] px-6 text-base gap-2.5` (primary landing CTAs)

#### Code Example
```tsx
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";

// Primary with Left Icon
<Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
  New Part Request
</Button>

// Loading State
<Button variant="primary" size="md" isLoading loadingText="Submitting...">
  Submit Request
</Button>

// Outline with Right Icon
<Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
  View Details
</Button>
```

---

### Input
**File**: `components/ui/input.tsx`

An accessible form input supporting upper-case labels, contextual helper text, inline error messages, and icon adornments.

#### Key Features
- **Red Focus Ring**: `focus:border-[#e20c0c] focus:ring-2 focus:ring-[#e20c0c]/20`
- **Icon Slots**: Automatic padding adjustments (`pl-11` when `leftIcon` is present, `pr-11` when `rightIcon` is present)
- **Error Styling**: Distinctive red border, tinted background (`bg-red-50/20`), and error copy with alert icon

#### Code Example
```tsx
import { Input } from "@/components/ui/input";
import { Search, Hash } from "lucide-react";

<Input
  label="CHASSIS NUMBER / VIN"
  placeholder="e.g. BNR32-005123"
  leftIcon={<Hash className="w-4 h-4" />}
  helperText="17-digit VIN or Japanese chassis prefix"
/>

<Input
  label="PART NUMBER"
  placeholder="OEM part code"
  error="Part code is required for genuine quotes"
/>
```

---

### Alert
**File**: `components/ui/alert.tsx`

Provides critical feedback, warnings, and system notices.

#### Variants
- **`error`**: `bg-red-50 border-red-200 text-red-900` with Lucide `AlertCircle`
- **`warning`**: `bg-amber-50 border-amber-200 text-amber-900` with Lucide `AlertTriangle`
- **`success`**: `bg-emerald-50 border-emerald-200 text-emerald-900` with Lucide `CheckCircle2`
- **`info`**: `bg-blue-50 border-blue-200 text-blue-900` with Lucide `Info`

#### Code Example
```tsx
import { Alert } from "@/components/ui/alert";

<Alert
  variant="warning"
  title="Action Required"
  description="Payment is pending for Invoice #INV-2026-089. Sourcing will proceed upon clearance."
  onDismiss={() => handleDismiss()}
/>
```

---

### Status & Milestone Badges
**File**: `components/admin/status-badge.tsx` & `lib/status-styles.ts`

Compact, pill-shaped indicators (`rounded-full border shadow-xs`) that immediately communicate order lifecycle and payment state.

#### Components
- `<StatusBadge status={request.status} size="sm" | "md" | "lg" />`
- `<PaymentStatusBadge status={payment.status} size="sm" | "md" />`
- `<ShipmentMilestoneBadge milestone={shipment.milestone} />`
- `<CustomerResponseBadge response={quote.customerResponse} />`

#### Visual Indicators
- Live pulsing dot (`w-1.5 h-1.5 rounded-full bg-[#e20c0c] animate-pulse`) for unpaid actions or in-transit shipments.
- Solid dot for confirmed/delivered states.

---

### Global Search Modal (⌘K Command Palette)
**File**: `components/shared/global-search-modal.tsx`

A keyboard-first overlay activated anywhere across the application using `⌘K` (Mac) or `Ctrl+K` (Windows/Linux).

#### Capabilities
- Instant fuzzy search across Requests, Orders, Invoices, Shipments, and Customers.
- Quick navigation shortcuts with keyboard arrow selection and Enter jump.
- Backdrop blur with `bg-slate-950/70 backdrop-blur-sm`.

---

### Sidebar Navigation (Dark Chrome)
**Files**: `components/portal/portal-sidebar.tsx`, `components/admin/admin-sidebar.tsx`

The anchor of the navigation system:
- **Surface**: Solid `#0C101A` background with `#1E2538` borders.
- **Brand Plaque**: Header featuring `#e20c0c` brand block and bold typography.
- **State Feedback**: Active item highlighted with `bg-gradient-to-r from-red-600 to-[#e20c0c] text-white shadow-sm`.
- **Collapsible Mode**: Smooth width transition (`w-64` expanded, `w-20` collapsed) with tooltip reveals.
- **Mobile Off-Canvas**: Left slide-out drawer on `< lg` breakpoints with animated backdrop.

---

### Header & App Bar
**Files**: `components/portal/portal-header.tsx`, `components/admin/admin-header.tsx`

- **Visual Treatment**: Frosted glass effect (`bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs`).
- **Dynamic Synchronization**: Automatically updates page title and document title on tab switch.
- **Interactive Triggers**: Quick-access global search bar with `⌘K` badge and interactive notification popover bell.

---

### Modals & Drawers
Modal overlays enforce focus and prevent accidental data loss:
- **Backdrop**: `fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50`
- **Surface Card**: `bg-white rounded-2xl border border-slate-200 shadow-2xl`
- **Header**: Sticky header with clear title, reference badge, and close button (`X`).
- **Footer**: Sticky action bar with secondary dismiss and primary affirmative buttons.

---

### Tables & Tabular Data
- **Class Structure**: Compact rows with `hover:bg-slate-50/80 transition-colors`.
- **Header Row**: `bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600`.
- **Alignment**:
  - Text & Names: Left aligned (`text-left`)
  - Statuses & Badges: Center aligned (`text-center`)
  - Currencies & Quantities: Right aligned (`text-right font-medium font-mono tabular-nums`)
- **Responsive Wrapper**: Wrapped in `<div className="overflow-x-auto custom-scrollbar">` to prevent layout breaking.

---

### Custom Scrollbar & Print Styles
**Defined in**: `app/globals.css`

#### Custom Subtle Scrollbar
```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #f8fafc;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

#### Invoice Print Optimization
When printing official quotes, packing slips, or tax invoices (`@media print`):
- Navigation sidebars, app headers, search bars, and interactive buttons are automatically hidden (`display: none !important`).
- Page background resets to pure white (`#ffffff !important`).
- High-fidelity print color adjustment enabled (`print-color-adjust: exact`).

---

## 5. Summary & Best Practices

1. **Colors**: Always use semantic tokens (`#e20c0c` for brand actions, `lib/status-styles.ts` for lifecycle tags) rather than arbitrary color values.
2. **Typography**: Pair bold section headings (`font-black tracking-tight`) with clear uppercase labels (`text-xs font-bold uppercase tracking-wider`).
3. **Numbers**: Use `tabular-nums` on all currencies, dimensions, and financial data tables.
4. **Interactive States**: Every interactive element must support `:hover`, `:focus-visible`, and `:active` states.
5. **Accessibility**: Maintain at least 4.5:1 text-to-background contrast ratios and supply proper ARIA labels on icon-only triggers.
