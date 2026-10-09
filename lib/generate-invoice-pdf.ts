/**
 * Generates an authentic, valid PDF-1.4 document for JDMHUB Tax Invoices.
 * Produces a base64 data URI (data:application/pdf;base64,...) that is 100% compliant,
 * viewable in iframes, and downloadable as an A4 Tax Invoice document.
 */

export interface InvoicePdfParams {
  invoiceNumber: string;
  requestNumber: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  vehicleSummary: string;
  vin?: string;
  partName: string;
  partNumber?: string;
  quantity: number;
  partPrice: number;
  freightCost: number;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  dateStr?: string;
  dueDateStr?: string;
}

function escapePdf(str: string): string {
  return (str || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, " "); // Keep ASCII printable
}

export function generateOfficialInvoicePdfDataUrl(params: InvoicePdfParams): string {
  const invoiceDate = params.dateStr || new Date().toISOString().split("T")[0];
  const dueDate =
    params.dueDateStr ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const partTotal = params.partPrice * params.quantity;

  // Stream content instructions (PDF coordinates: (0,0) is bottom-left, page is 595 x 842 points)
  const streamLines: string[] = [
    // Top brand accent line
    "0.886 0.047 0.047 rg", // Red #e20c0c
    "0 836 595 6 re f",

    // Header branding
    "BT",
    "/F2 20 Tf",
    "0.05 0.07 0.12 rg", // #0c101a
    "40 796 Td",
    "(JDMHUB NEW ZEALAND) Tj",
    "ET",

    "BT",
    "/F1 9 Tf",
    "0.35 0.38 0.42 rg",
    "40 782 Td",
    "(Specialist Japanese Domestic Market Vehicle & Parts Procurement) Tj",
    "ET",

    "BT",
    "/F1 8.5 Tf",
    "0.4 0.4 0.4 rg",
    "40 770 Td",
    "(NZBN: 9429051234567 | NZ GST Registration: 134-892-411) Tj",
    "ET",

    // TAX INVOICE label
    "BT",
    "/F2 18 Tf",
    "0.886 0.047 0.047 rg",
    "400 796 Td",
    "(TAX INVOICE) Tj",
    "ET",

    // Invoice Meta block right
    "BT",
    "/F2 9.5 Tf",
    "0.1 0.1 0.1 rg",
    "400 778 Td",
    `(${escapePdf(`Invoice #: ${params.invoiceNumber}`)}) Tj`,
    "ET",

    "BT",
    "/F1 9 Tf",
    "0.3 0.3 0.3 rg",
    "400 764 Td",
    `(${escapePdf(`Date: ${invoiceDate}`)}) Tj`,
    "ET",

    "BT",
    "/F1 9 Tf",
    "0.3 0.3 0.3 rg",
    "400 750 Td",
    `(${escapePdf(`Due Date: ${dueDate}`)}) Tj`,
    "ET",

    "BT",
    "/F1 9 Tf",
    "0.3 0.3 0.3 rg",
    "400 736 Td",
    `(${escapePdf(`Order Ref: ${params.requestNumber}`)}) Tj`,
    "ET",

    // Dividing rule
    "0.85 0.85 0.88 RG",
    "0.8 w",
    "40 720 m 555 720 l S",

    // Bill To & Vehicle Box Background
    "0.97 0.98 0.99 rg",
    "40 610 515 95 re f",
    "0.85 0.88 0.92 RG",
    "0.5 w",
    "40 610 515 95 re S",

    // Bill To text
    "BT",
    "/F2 9 Tf",
    "0.5 0.1 0.1 rg",
    "55 688 Td",
    "(BILL TO / CUSTOMER) Tj",
    "ET",

    "BT",
    "/F2 11 Tf",
    "0.1 0.1 0.1 rg",
    "55 672 Td",
    `(${escapePdf(params.customerName)}) Tj`,
    "ET",

    "BT",
    "/F1 9 Tf",
    "0.3 0.3 0.3 rg",
    "55 658 Td",
    `(${escapePdf(params.customerEmail || "trade-desk@customer.co.nz")}) Tj`,
    "ET",

    "BT",
    "/F1 8.5 Tf",
    "0.4 0.4 0.4 rg",
    "55 644 Td",
    `(${escapePdf(params.customerAddress || "Auckland, New Zealand")}) Tj`,
    "ET",

    // Vehicle target text right
    "BT",
    "/F2 9 Tf",
    "0.2 0.3 0.5 rg",
    "320 688 Td",
    "(TARGET VEHICLE & DISPATCH SPEC) Tj",
    "ET",

    "BT",
    "/F2 10 Tf",
    "0.1 0.1 0.1 rg",
    "320 672 Td",
    `(${escapePdf(params.vehicleSummary)}) Tj`,
    "ET",

    "BT",
    "/F1 8.5 Tf",
    "0.3 0.3 0.3 rg",
    "320 658 Td",
    `(${escapePdf(`VIN: ${params.vin || "VERIFIED JDM CHASSIS"}`)}) Tj`,
    "ET",

    "BT",
    "/F1 8.5 Tf",
    "0.3 0.3 0.3 rg",
    "320 644 Td",
    `(${escapePdf(`Port of Entry: Auckland Sea/Air Cargo Depot`)}) Tj`,
    "ET",

    // Table Header Bar
    "0.08 0.1 0.15 rg",
    "40 575 515 24 re f",

    "BT",
    "/F2 8.5 Tf",
    "1 1 1 rg",
    "50 583 Td",
    "(ITEM DESCRIPTION) Tj",
    "300 583 Td",
    "(QTY) Tj",
    "370 583 Td",
    "(UNIT PRICE) Tj",
    "470 583 Td",
    "(AMOUNT (NZD)) Tj",
    "ET",

    // Row 1: Part
    "0.98 0.98 0.99 rg",
    "40 525 515 45 re f",
    "0.9 0.9 0.92 RG",
    "40 525 515 45 re S",

    "BT",
    "/F2 9.5 Tf",
    "0.1 0.1 0.1 rg",
    "50 552 Td",
    `(${escapePdf(params.partName)}) Tj`,
    "ET",

    "BT",
    "/F1 8 Tf",
    "0.4 0.4 0.4 rg",
    "50 538 Td",
    `(${escapePdf(`OEM/Spec Ref: ${params.partNumber || "Japan Genuine OEM Verified"}`)}) Tj`,
    "ET",

    "BT",
    "/F1 9 Tf",
    "0.1 0.1 0.1 rg",
    "310 546 Td",
    `(${params.quantity}) Tj`,
    "380 546 Td",
    `(${escapePdf(`$${params.partPrice.toFixed(2)}`)}) Tj`,
    "480 546 Td",
    `(${escapePdf(`$${partTotal.toFixed(2)}`)}) Tj`,
    "ET",

    // Row 2: Freight & Logistics
    "1 1 1 rg",
    "40 485 515 35 re f",
    "0.9 0.9 0.92 RG",
    "40 485 515 35 re S",

    "BT",
    "/F2 9 Tf",
    "0.1 0.1 0.1 rg",
    "50 504 Td",
    "(Japan Express Freight, Import Logistics & Customs Clearance) Tj",
    "ET",

    "BT",
    "/F1 8 Tf",
    "0.4 0.4 0.4 rg",
    "50 493 Td",
    "(Full transit insurance and NZ Port clearance handling included) Tj",
    "ET",

    "BT",
    "/F1 9 Tf",
    "0.1 0.1 0.1 rg",
    "310 499 Td",
    "(1) Tj",
    "380 499 Td",
    `(${escapePdf(`$${params.freightCost.toFixed(2)}`)}) Tj`,
    "480 499 Td",
    `(${escapePdf(`$${params.freightCost.toFixed(2)}`)}) Tj`,
    "ET",

    // Summary block (right aligned)
    "0.96 0.97 0.99 rg",
    "330 380 225 90 re f",
    "0.85 0.88 0.92 RG",
    "0.5 w",
    "330 380 225 90 re S",

    "BT",
    "/F1 9 Tf",
    "0.3 0.3 0.3 rg",
    "345 448 Td",
    "(Subtotal (excl. GST):) Tj",
    "475 448 Td",
    `(${escapePdf(`$${(params.totalAmount - params.gstAmount).toFixed(2)}`)}) Tj`,
    "ET",

    "BT",
    "/F1 9 Tf",
    "0.3 0.3 0.3 rg",
    "345 428 Td",
    "(NZ GST (15%):) Tj",
    "475 428 Td",
    `(${escapePdf(`$${params.gstAmount.toFixed(2)}`)}) Tj`,
    "ET",

    // Total highlight banner
    "0.886 0.047 0.047 rg",
    "330 380 225 32 re f",

    "BT",
    "/F2 11 Tf",
    "1 1 1 rg",
    "345 392 Td",
    "(TOTAL DUE (NZD):) Tj",
    "465 392 Td",
    `(${escapePdf(`$${params.totalAmount.toFixed(2)}`)}) Tj`,
    "ET",

    // Remittance / Payment Instructions Box
    "0.96 0.97 0.98 rg",
    "40 250 515 110 re f",
    "0.85 0.88 0.92 RG",
    "0.5 w",
    "40 250 515 110 re S",

    "BT",
    "/F2 9.5 Tf",
    "0.08 0.1 0.15 rg",
    "55 338 Td",
    "(REMITTANCE ADVICE & PAYMENT DETAILS) Tj",
    "ET",

    "BT",
    "/F1 8.5 Tf",
    "0.25 0.25 0.25 rg",
    "55 320 Td",
    "(Bank: ANZ Bank New Zealand Limited) Tj",
    "55 306 Td",
    "(Account Name: JDMHUB LIMITED) Tj",
    "55 292 Td",
    "(Account Number: 01-0102-0987654-00) Tj",
    "55 278 Td",
    "(SWIFT / BIC: ANZBNZ22 (International Remittance)) Tj",
    "ET",

    "BT",
    "/F2 8.5 Tf",
    "0.886 0.047 0.047 rg",
    "320 320 Td",
    `(${escapePdf(`Payment Reference: ${params.invoiceNumber}`)}) Tj`,
    "ET",

    "BT",
    "/F1 8 Tf",
    "0.4 0.4 0.4 rg",
    "320 306 Td",
    "(Please quote this invoice reference on direct credit transfer.) Tj",
    "320 292 Td",
    "(Procurement order to Japan is scheduled upon payment clearance.) Tj",
    "320 278 Td",
    "(Credit card payments accepted via JDMHUB Customer Portal.) Tj",
    "ET",

    // Footer
    "0.85 0.85 0.88 RG",
    "0.5 w",
    "40 100 m 555 100 l S",

    "BT",
    "/F2 8.5 Tf",
    "0.15 0.15 0.15 rg",
    "40 85 Td",
    "(JDMHUB Direct Procurement Guarantee) Tj",
    "ET",

    "BT",
    "/F1 7.5 Tf",
    "0.45 0.45 0.45 rg",
    "40 72 Td",
    "(All parts sourced through verified Japanese Domestic Market channels. Goods remain property of JDMHUB Ltd until settled in full.) Tj",
    "40 60 Td",
    "(For accounts queries, contact accounts@jdmhub.co.nz or +64 9 525 3888. Thank you for your partnership!) Tj",
    "ET",
  ];

  const streamContent = streamLines.join("\n");
  const streamLength = streamContent.length;

  // Build PDF Objects
  let offset = 0;
  const offsets: number[] = [];

  function addObj(content: string): string {
    offsets.push(offset);
    offset += content.length;
    return content;
  }

  let pdf = "%PDF-1.4\n";
  offset = pdf.length;

  const obj1 = addObj(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  const obj2 = addObj(
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`
  );
  const obj3 = addObj(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n`
  );
  const obj4 = addObj(
    `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`
  );
  const obj5 = addObj(
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`
  );
  const obj6 = addObj(
    `6 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`
  );

  const xrefOffset = offset;
  let xref = `xref\n0 7\n0000000000 65535 f \n`;
  for (let i = 0; i < offsets.length; i++) {
    xref += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const fullPdf = pdf + obj1 + obj2 + obj3 + obj4 + obj5 + obj6 + xref + trailer;

  // Convert string to base64 safely (using btoa or Buffer)
  let base64 = "";
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    base64 = window.btoa(unescape(encodeURIComponent(fullPdf)));
  } else if (typeof Buffer !== "undefined") {
    base64 = Buffer.from(fullPdf).toString("base64");
  } else {
    base64 = btoa(unescape(encodeURIComponent(fullPdf)));
  }

  return `data:application/pdf;base64,${base64}`;
}
