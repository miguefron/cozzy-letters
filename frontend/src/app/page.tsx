"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import CozyButton from "@/components/cozy/CozyButton";
import Skeleton from "@/components/cozy/Skeleton";

/* ─── Floating envelope decorations ─── */

const envelopes = [
  { x: "8%", y: "12%", size: 48, delay: 0, duration: 18, rotation: 12 },
  { x: "85%", y: "8%", size: 36, delay: 2, duration: 22, rotation: -8 },
  { x: "75%", y: "65%", size: 42, delay: 4, duration: 20, rotation: 15 },
  { x: "15%", y: "70%", size: 32, delay: 1, duration: 24, rotation: -12 },
  { x: "50%", y: "20%", size: 28, delay: 3, duration: 19, rotation: 6 },
  { x: "92%", y: "40%", size: 38, delay: 5, duration: 21, rotation: -10 },
  { x: "5%", y: "42%", size: 34, delay: 2.5, duration: 23, rotation: 8 },
];

function EnvelopeSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* envelope body */}
      <rect
        x="4"
        y="16"
        width="56"
        height="36"
        rx="4"
        fill="#D4A574"
        fillOpacity="0.25"
        stroke="#D4A574"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      {/* envelope flap */}
      <path
        d="M4 18 L32 38 L60 18"
        stroke="#C4756B"
        strokeOpacity="0.3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* small heart on envelope */}
      <path
        d="M29 28 C29 26 32 24 32 27 C32 24 35 26 35 28 C35 31 32 33 32 33 C32 33 29 31 29 28Z"
        fill="#C4756B"
        fillOpacity="0.3"
      />
    </svg>
  );
}

function FloatingEnvelopes({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  /* Each envelope gets a parallax depth based on its size.
     Larger envelopes = bigger depth (faster, foreground).
     Smaller envelopes = smaller depth (slower, background). */
  const depths = envelopes.map((env) => env.size * 3);

  const y0 = useTransform(scrollYProgress, [0, 1], [0, -depths[0]]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -depths[1]]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -depths[2]]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -depths[3]]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -depths[4]]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, -depths[5]]);
  const y6 = useTransform(scrollYProgress, [0, 1], [0, -depths[6]]);

  const parallaxValues = [y0, y1, y2, y3, y4, y5, y6];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {envelopes.map((env, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: env.x, top: env.y, y: parallaxValues[i] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 0, rotate: env.rotation }}
            animate={{
              opacity: [0, 0.7, 0.7, 0],
              y: [0, -30, -60, -30, 0],
              x: [0, 15, -10, 20, 0],
              rotate: [
                env.rotation,
                env.rotation + 5,
                env.rotation - 5,
                env.rotation,
              ],
            }}
            transition={{
              duration: env.duration,
              delay: env.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <EnvelopeSVG size={env.size} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── How-it-works step data ─── */

const steps = [
  {
    icon: (
      <svg className="h-10 w-10 text-terracotta" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 40 L8 12 C8 10 10 8 12 8 L36 8 C38 8 40 10 40 12 L40 40" />
        <line x1="14" y1="16" x2="34" y2="16" />
        <line x1="14" y1="22" x2="30" y2="22" />
        <line x1="14" y1="28" x2="26" y2="28" />
        <path d="M20 36 C20 34 24 32 24 35 C24 32 28 34 28 36 C28 38 24 40 24 40 C24 40 20 38 20 36Z" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Write from the heart",
    description: "Pour your thoughts into a warm letter — a word of encouragement, a story, or a kind note.",
  },
  {
    icon: (
      <svg className="h-10 w-10 text-moss" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="14" width="36" height="24" rx="3" />
        <path d="M6 16 L24 30 L42 16" />
        <circle cx="38" cy="12" r="6" fill="currentColor" stroke="none" opacity="0.3" />
        <path d="M36 12 L38 14 L41 10" strokeWidth="2" />
      </svg>
    ),
    title: "Send to a random soul",
    description: "Your letter finds its way to 5 random people across the community — complete strangers.",
  },
  {
    icon: (
      <svg className="h-10 w-10 text-wood" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="16" />
        <path d="M18 22 C18 22 20 20 22 22" />
        <path d="M26 22 C26 22 28 20 30 22" />
        <path d="M17 28 C17 28 20 34 24 34 C28 34 31 28 31 28" />
        <path d="M10 10 L14 14" />
        <path d="M38 10 L34 14" />
        <path d="M24 2 L24 6" />
      </svg>
    ),
    title: "Brighten someone's day",
    description: "A cozy surprise lands in someone's mailbox, spreading warmth one letter at a time.",
  },
];

/* ─── Fade-in animation variant ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

/* ─── Animated Counter Component ─── */

function AnimatedCounter() {
  const [letterCount, setLetterCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    fetch(`${apiUrl}/letters/count`)
      .then((res) => res.json())
      .then((data) => {
        const count = typeof data === "number" ? data : data.count ?? 0;
        setLetterCount(count);
      })
      .catch(() => setLetterCount(0));
  }, []);

  useEffect(() => {
    if (!isInView || letterCount === null || letterCount === 0) return;

    const duration = 2000;
    const start = performance.now();
    let rafId: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(eased * letterCount!));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, letterCount]);

  return (
    <motion.div
      ref={counterRef}
      className="mx-auto max-w-xl rounded-3xl bg-warm-white p-10 text-center shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-5xl font-serif font-bold text-terracotta sm:text-7xl">
        {letterCount === null ? "--" : displayCount.toLocaleString()}
      </span>
      <p className="mt-3 text-lg text-foreground/60">letters sent with love</p>
    </motion.div>
  );
}

/* ─── Interactive Letter Preview ─── */

function InteractiveLetterPreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ["start end", "end start"],
  });

  const flapRotate = useTransform(scrollYProgress, [0.2, 0.5], [0, 180]);
  const letterY = useTransform(scrollYProgress, [0.3, 0.6], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);

  return (
    <div ref={previewRef} className="mx-auto mt-12 max-w-sm w-full">
      <div style={{ perspective: 1000 }}>
        {/* Envelope container */}
        <div className="relative mx-auto w-64 sm:w-72">
          {/* Letter paper that slides up */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-[85%] rounded-xl bg-[#FEFCF9] p-5 shadow-md z-0"
            style={{ y: letterY, bottom: "50%" }}
          >
            <motion.p
              className="text-sm leading-relaxed text-foreground/80"
              style={{
                opacity: contentOpacity,
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
              }}
            >
              Dear friend, I just wanted you to know that you&apos;re doing
              great. The world is a little brighter because you&apos;re in it.
              Keep going — someone out there is cheering for you.
            </motion.p>
          </motion.div>

          {/* Envelope body */}
          <div className="relative z-10 h-36 sm:h-40 rounded-xl bg-[#D4A574] shadow-lg overflow-hidden">
            {/* Inner shadow / fold line */}
            <div className="absolute inset-x-0 top-0 h-px bg-[#C4756B]/20" />
            {/* Small heart decoration */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="#C4756B"
                opacity="0.4"
              >
                <path d="M10 18 C10 18 0 11 0 5 C0 2 2 0 5 0 C7 0 9 1.5 10 3 C11 1.5 13 0 15 0 C18 0 20 2 20 5 C20 11 10 18 10 18Z" />
              </svg>
            </div>
          </div>

          {/* Envelope flap */}
          <motion.div
            className="absolute top-0 left-0 w-full z-20"
            style={{
              rotateX: flapRotate,
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
            }}
          >
            <svg
              viewBox="0 0 288 80"
              className="w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0 H288 V4 L144 80 L0 4 Z"
                fill="#C9936E"
                stroke="#D4A574"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */

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
      {/* ──── Section 1: Hero ──── */}
      <section className="relative snap-start min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Subtle radial gradient backdrop */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,117,107,0.08)_0%,_transparent_70%)]" />

        <FloatingEnvelopes scrollYProgress={scrollYProgress} />

        <motion.div
          className="relative z-10 mx-auto max-w-2xl text-center"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-serif text-5xl font-bold tracking-tight text-terracotta sm:text-7xl"
            variants={fadeUp}
            custom={0}
          >
            CozyLetters
          </motion.h1>

          <motion.p
            className="mt-6 text-lg leading-relaxed text-foreground/70 sm:text-xl"
            variants={fadeUp}
            custom={1}
          >
            Send warm, anonymous letters to random souls around the world.
            Write from the heart, and let a cozy surprise land in someone&apos;s
            mailbox.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            variants={fadeUp}
            custom={2}
          >
            {!mounted ? (
              <>
                <Skeleton className="h-12 w-40 rounded-2xl" />
                <Skeleton className="h-12 w-40 rounded-2xl" />
              </>
            ) : isLoggedIn ? (
              <CozyButton as="link" href="/inbox">
                Go to Inbox
              </CozyButton>
            ) : (
              <>
                <CozyButton as="link" href="/login">
                  Write a Letter
                </CozyButton>
                <CozyButton as="link" href="/register" variant="secondary">
                  Sign Up
                </CozyButton>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            className="h-6 w-6 text-wood/60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ──── Section 2: How It Works ──── */}
      <section className="snap-start min-h-screen flex flex-col items-center justify-center px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            className="text-center font-serif text-3xl font-bold text-terracotta sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className="flex flex-col items-center rounded-2xl bg-warm-white p-8 text-center shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={i}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream">
                  {step.icon}
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                  {step.description}
                </p>

              </motion.div>
            ))}
          </div>

          {/* Step connectors for mobile */}
          <div className="mt-6 flex justify-center gap-2 sm:hidden">
            {steps.map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-wood/30"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ──── Section 3: Counter + Preview + CTA + Footer ──── */}
      <section className="snap-start min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Letter Counter */}
        <AnimatedCounter />

        {/* Interactive Letter Preview */}
        <InteractiveLetterPreview />

        {/* CTA card */}
        <motion.div
          className="mx-auto mt-12 max-w-xl rounded-3xl bg-warm-white p-10 text-center shadow-sm sm:p-14"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-2xl font-bold text-terracotta sm:text-3xl">
            Ready to spread some warmth?
          </h2>
          <p className="mt-4 text-foreground/60">
            It only takes a moment to make a stranger&apos;s day a little
            brighter. Pick up your pen and send a cozy letter today.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {!mounted ? (
              <Skeleton className="h-12 w-44 rounded-2xl" />
            ) : isLoggedIn ? (
              <CozyButton as="link" href="/inbox">
                Go to Inbox
              </CozyButton>
            ) : (
              <>
                <CozyButton as="link" href="/register">
                  Get Started
                </CozyButton>
                <CozyButton as="link" href="/login" variant="secondary">
                  Log In
                </CozyButton>
              </>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-12 py-10 text-center">
          <p className="text-sm text-wood">Made with warmth and care</p>
        </footer>
      </section>
    </div>
  );
}
