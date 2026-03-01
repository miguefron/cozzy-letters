"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import CozyButton from "@/components/cozy/CozyButton";
import Skeleton from "@/components/cozy/Skeleton";
import { springIn, floatAnimation } from "./animations";

/* ─── Inline Envelope SVG ─── */

function EnvelopeSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="16" width="56" height="36" rx="4" fill="#D4A574" fillOpacity="0.25" stroke="#D4A574" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M4 18 L32 38 L60 18" stroke="#C4756B" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M29 28 C29 26 32 24 32 27 C32 24 35 26 35 28 C35 31 32 33 32 33 C32 33 29 31 29 28Z" fill="#C4756B" fillOpacity="0.3" />
    </svg>
  );
}

/* ─── Envelope config ─── */

const envelopes = [
  { top: "8%",  left: "5%",  size: 38, delay: 0,   dur: 5.2, rotate: -12, range: [0, 80]  as [number, number] },
  { top: "15%", left: "85%", size: 44, delay: 0.8, dur: 6.0, rotate: 18,  range: [0, 120] as [number, number] },
  { top: "30%", left: "10%", size: 32, delay: 1.4, dur: 4.8, rotate: -8,  range: [0, 60]  as [number, number] },
  { top: "55%", left: "90%", size: 36, delay: 0.3, dur: 5.5, rotate: 22,  range: [0, 100] as [number, number] },
  { top: "70%", left: "8%",  size: 42, delay: 1.0, dur: 6.2, rotate: -15, range: [0, 90]  as [number, number] },
  { top: "80%", left: "88%", size: 30, delay: 1.8, dur: 4.5, rotate: 10,  range: [0, 70]  as [number, number] },
  { top: "25%", left: "92%", size: 28, delay: 0.5, dur: 5.0, rotate: -20, range: [0, 110] as [number, number] },
  { top: "45%", left: "3%",  size: 34, delay: 1.2, dur: 5.8, rotate: 14,  range: [0, 85]  as [number, number] },
  { top: "60%", left: "15%", size: 26, delay: 0.6, dur: 4.6, rotate: -18, range: [0, 95]  as [number, number] },
  { top: "40%", left: "82%", size: 40, delay: 1.6, dur: 5.4, rotate: 25,  range: [0, 75]  as [number, number] },
];

/* ─── Props ─── */

interface HeroSectionProps {
  scrollYProgress: MotionValue<number>;
  isLoggedIn: boolean;
  mounted: boolean;
}

/* ─── Component ─── */

export default function HeroSection({ scrollYProgress, isLoggedIn, mounted }: HeroSectionProps) {
  // All useTransform hooks called unconditionally at the top level
  const envY0  = useTransform(scrollYProgress, [0, 1], [0, envelopes[0].range[1]]);
  const envY1  = useTransform(scrollYProgress, [0, 1], [0, envelopes[1].range[1]]);
  const envY2  = useTransform(scrollYProgress, [0, 1], [0, envelopes[2].range[1]]);
  const envY3  = useTransform(scrollYProgress, [0, 1], [0, envelopes[3].range[1]]);
  const envY4  = useTransform(scrollYProgress, [0, 1], [0, envelopes[4].range[1]]);
  const envY5  = useTransform(scrollYProgress, [0, 1], [0, envelopes[5].range[1]]);
  const envY6  = useTransform(scrollYProgress, [0, 1], [0, envelopes[6].range[1]]);
  const envY7  = useTransform(scrollYProgress, [0, 1], [0, envelopes[7].range[1]]);
  const envY8  = useTransform(scrollYProgress, [0, 1], [0, envelopes[8].range[1]]);
  const envY9  = useTransform(scrollYProgress, [0, 1], [0, envelopes[9].range[1]]);
  const parallaxYs = [envY0, envY1, envY2, envY3, envY4, envY5, envY6, envY7, envY8, envY9];

  return (
    <section className="snap-start relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-cream)_0%,_var(--color-warm-white)_70%)]" />

      {/* Illustration placeholder */}
      {/* TODO: Replace with <Image src="/illustrations/hero-mailbox.webp" /> when asset is ready */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 opacity-0 pointer-events-none" aria-hidden="true" />

      {/* Floating envelopes */}
      {envelopes.map((env, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: env.top, left: env.left, rotate: env.rotate, y: parallaxYs[i] }}
          animate={floatAnimation}
          transition={{ ...floatAnimation.transition, duration: env.dur, delay: env.delay }}
        >
          <EnvelopeSVG size={env.size} />
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 gap-6 max-w-3xl"
        variants={springIn}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1
          className="text-6xl sm:text-8xl font-serif font-bold text-terracotta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          CozyLetters
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl text-foreground/70 max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Send warm, anonymous letters to strangers around the world. A cozy corner of the
          internet where kind words find their way to someone who needs them.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex gap-4 mt-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {!mounted ? (
            <>
              <Skeleton className="w-36 h-12" />
              <Skeleton className="w-36 h-12" />
            </>
          ) : isLoggedIn ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <CozyButton as="link" href="/inbox" variant="primary">
                Go to Inbox
              </CozyButton>
            </motion.div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <CozyButton as="link" href="/login" variant="primary">
                  Write a Letter
                </CozyButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <CozyButton as="link" href="/register" variant="secondary">
                  Sign Up
                </CozyButton>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div
          className="relative"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-terracotta/30"
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-terracotta/60">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
