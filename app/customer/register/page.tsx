import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterView } from "@/components/auth/register-view";

export const metadata: Metadata = {
  title: "Register Business Account | JDMHub Customer Portal",
  description:
    "Register your automotive workshop, dealership, or fleet operation for commercial parts procurement on the JDMHub B2B platform.",
};

export default function CustomerRegisterPage() {
  return (
    <Suspense>
      <RegisterView />
    </Suspense>
  );
}
