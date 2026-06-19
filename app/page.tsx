// app/page.tsx
"use client";

import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import HowItWorks from "@/components/howItWork";
import Features from "@/components/features";
import CTA from "@/components/callToAction";
import { PricingSection } from "@/components/PricingSection";
import { useAuthContext } from "@/components/auth-provider";
import Footer from "@/components/footer";
import Testimonials from "@/components/Testimonials";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();

  const isAuthenticated = !!user;
    const currentPlanId = ((user as any)?.plan || "free") as
      | "free"
      | "starter"
      | "pro"
      | "enterprise";

  const handleLandingSelectPlan = (
    planId: "free" | "starter" | "pro" | "enterprise"
  ) => {
    if (!isAuthenticated) {
      router.push("/auth/login?plan=" + planId);
      return;
    }
    router.push("/company/billing?plan=" + planId);
  };

  return (
    <main className="bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <PricingSection
        isAuthenticated={isAuthenticated}
        currentPlanId={currentPlanId}
        onSelectPlan={handleLandingSelectPlan}
      />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}