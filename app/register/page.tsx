import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterView } from "@/components/auth/register-view";

export const metadata: Metadata = {
  title: "Register Business Account | JDMHUB Trade Portal",
  description:
    "Register your automotive workshop, dealership, or fleet operation for commercial parts procurement on the JDMHUB B2B platform.",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterView />
    </Suspense>
  );
}
