import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { UnifiedDataProvider } from "@/context/unified-data-context";
import { GlobalSearchProvider } from "@/context/global-search-context";
import { GlobalSearchModal } from "@/components/shared/global-search-modal";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "JDMHub | Unified Autohub Admin & Customer Platform",
  description: "JDMHub — B2B Automotive Procurement Platform built with Next.js, TypeScript, and Tailwind CSS.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#e20c0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={`${roboto.className} min-h-screen bg-slate-50 text-slate-900 antialiased font-sans`}>
        <AuthProvider>
          <UnifiedDataProvider>
            <GlobalSearchProvider>
              {children}
              <GlobalSearchModal />
            </GlobalSearchProvider>
          </UnifiedDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
