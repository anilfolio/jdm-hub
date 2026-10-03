import type { Metadata } from "next";
import { LandingPageView } from "@/components/landing/landing-page-view";

export const metadata: Metadata = {
  title: "JDMHub — B2B Automotive Procurement Platform | Need a Part? We'll Handle the Rest",
  description:
    "JDMHub helps automotive businesses source parts, manage quotes, coordinate freight and track delivery — all in one place. One Request. One Workflow.",
  keywords: [
    "JDMHub",
    "B2B Automotive Procurement",
    "Auto Parts Sourcing",
    "Japanese Automotive Parts",
    "OEM Parts Sourcing",
    "Automotive Freight Logistics",
    "Car Workshop Parts Procurement",
  ],
  openGraph: {
    title: "JDMHub — B2B Automotive Procurement Platform",
    description: "Need a Part? We'll Handle the Rest. One Request. One Workflow.",
    type: "website",
  },
};

export default function RootPage() {
  return <LandingPageView />;
}
