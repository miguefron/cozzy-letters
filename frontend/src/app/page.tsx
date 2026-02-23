"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

function FloatingEnvelopes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {envelopes.map((env, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: env.x, top: env.y }}
          initial={{ opacity: 0, y: 0, rotate: env.rotation }}
          animate={{
            opacity: [0, 0.7, 0.7, 0],
            y: [0, -30, -60, -30, 0],
            x: [0, 15, -10, 20, 0],
            rotate: [env.rotation, env.rotation + 5, env.rotation - 5, env.rotation],
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

/* ─── Page ─── */

export default function Home() {
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoggedIn = mounted && !!token;

  return (
    <div className="bg-cream text-foreground">
      {/* ──── Hero Section ──── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        {/* Subtle radial gradient backdrop */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,117,107,0.08)_0%,_transparent_70%)]" />

        <FloatingEnvelopes />

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
              <CozyButton as="link" href="/write-letter">
                Write a Letter
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

      {/* ──── How It Works Section ──── */}
      <section className="px-4 py-24 sm:py-32">
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

          {/* Step connectors for desktop */}
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

      {/* ──── Call-to-Action Section ──── */}
      <section className="px-4 py-20">
        <motion.div
          className="mx-auto max-w-xl rounded-3xl bg-warm-white p-10 text-center shadow-sm sm:p-14"
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
              <CozyButton as="link" href="/write-letter">
                Write a Letter
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
      </section>

      {/* ──── Footer ──── */}
      <footer className="py-10 text-center">
        <p className="text-sm text-wood">Made with warmth and care</p>
      </footer>
    </div>
  );
}
