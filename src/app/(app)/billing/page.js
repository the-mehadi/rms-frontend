import { Suspense } from "react";
import BillingPageContent from "@/components/billing/BillingPageContent";
import BillingLoadingSkeleton from "@/components/billing/BillingLoadingSkeleton";

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingLoadingSkeleton />}>
      <BillingPageContent />
    </Suspense>
  );
}

