"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import HeroSection from "@/components/landing/HeroSection";
import EmotionalSection from "@/components/landing/EmotionalSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ExampleLettersSection from "@/components/landing/ExampleLettersSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CtaFooterSection from "@/components/landing/CtaFooterSection";

export default function Home() {
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const isLoggedIn = mounted && !!token;

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto snap-y snap-mandatory bg-cream text-foreground"
    >
      <HeroSection scrollYProgress={scrollYProgress} isLoggedIn={isLoggedIn} mounted={mounted} />
      <EmotionalSection />
      <HowItWorksSection />
      <ExampleLettersSection />
      <FeaturesSection />
      <CtaFooterSection isLoggedIn={isLoggedIn} mounted={mounted} />
    </div>
  );
}
