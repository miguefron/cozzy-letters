"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useAnimate,
} from "framer-motion";
import CozyButton from "@/components/cozy/CozyButton";
import Skeleton from "@/components/cozy/Skeleton";
import { scaleFade } from "./animations";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/* ─── Props ─── */

interface CtaFooterSectionProps {
  isLoggedIn: boolean;
  mounted: boolean;
}

/* ─── Watercolor Stamp SVG ─── */

function StampSVG() {
  return (
    <svg width="36" height="42" viewBox="0 0 36 42" fill="none">
      {/* Perforated edge stamp */}
      <rect x="2" y="2" width="32" height="38" rx="2" fill="#FEFCF9" />
      <rect x="2" y="2" width="32" height="38" rx="2" fill="url(#stampWash)" />
      <rect x="2" y="2" width="32" height="38" rx="2" stroke="#D4A574" strokeWidth="1" strokeDasharray="3 2" />
      {/* Inner border */}
      <rect x="5" y="5" width="26" height="32" rx="1" stroke="#D4A574" strokeOpacity="0.3" strokeWidth="0.5" />
      {/* Heart */}
      <path d="M14 16 C14 13 18 11 18 15 C18 11 22 13 22 16 C22 20 18 23 18 23 C18 23 14 20 14 16Z" fill="#C4756B" fillOpacity="0.5" />
      {/* Watercolor wash on heart */}
      <path d="M14 16 C14 13 18 11 18 15 C18 11 22 13 22 16 C22 20 18 23 18 23 C18 23 14 20 14 16Z" fill="url(#heartWash)" fillOpacity="0.3" />
      {/* Text */}
      <text x="18" y="32" textAnchor="middle" fontSize="5.5" fill="#D4A574" fontFamily="serif" fontWeight="600" letterSpacing="1">LOVE</text>
      <defs>
        <radialGradient id="stampWash" cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#F5E6D3" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="heartWash" cx="0.4" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#E8A090" />
          <stop offset="100%" stopColor="#C4756B" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Wax Seal SVG ─── */

function WaxSealSVG() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Outer wax blob — organic shape */}
      <path
        d="M22 2 C26 3 30 2 33 5 C36 8 38 7 40 11 C42 15 41 19 40 22 C41 25 43 28 40 32 C37 36 34 37 30 39 C26 41 24 42 22 42 C20 42 18 41 14 39 C10 37 7 36 4 32 C1 28 3 25 4 22 C3 19 2 15 4 11 C6 7 8 8 11 5 C14 2 18 3 22 2Z"
        fill="url(#waxGrad)"
      />
      {/* Inner ring */}
      <circle cx="22" cy="22" r="14" fill="none" stroke="#FFF8F0" strokeOpacity="0.2" strokeWidth="0.8" />
      {/* Highlight blob */}
      <ellipse cx="17" cy="16" rx="5" ry="4" fill="#E8A090" fillOpacity="0.3" />
      {/* Heart emboss */}
      <path d="M19 19 C19 16.5 22 14.5 22 18 C22 14.5 25 16.5 25 19 C25 22 22 25 22 25 C22 25 19 22 19 19Z" fill="#FFF8F0" fillOpacity="0.35" />
      {/* Subtle shadow under heart */}
      <path d="M19 19 C19 16.5 22 14.5 22 18 C22 14.5 25 16.5 25 19 C25 22 22 25 22 25 C22 25 19 22 19 19Z" fill="none" stroke="#8B3A30" strokeOpacity="0.15" strokeWidth="0.5" />
      <defs>
        <radialGradient id="waxGrad" cx="0.4" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#D4847A" />
          <stop offset="50%" stopColor="#C4756B" />
          <stop offset="100%" stopColor="#A85D54" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Floral Corner SVG ─── */

function FloralCorner({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="48" height="48" viewBox="0 0 48 48" fill="none"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* Stem */}
      <path d="M4 44 Q12 36 18 28 Q22 22 24 16" stroke="#7A8B69" strokeOpacity="0.3" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Leaves */}
      <path d="M12 36 Q8 32 14 30 Q18 34 12 36Z" fill="#7A8B69" fillOpacity="0.2" />
      <path d="M20 26 Q24 22 22 28 Q18 30 20 26Z" fill="#7A8B69" fillOpacity="0.15" />
      {/* Tiny flower bud */}
      <circle cx="24" cy="14" r="3" fill="#C4756B" fillOpacity="0.2" />
      <circle cx="24" cy="14" r="1.5" fill="#C4756B" fillOpacity="0.3" />
    </svg>
  );
}

/* ─── Animated Counter ─── */

function useAnimatedCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView || target <= 0) return;
    const duration = 1800;
    let start: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setCount(target);
        setDone(true);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return { count, done };
}

/* ─── Letter text ─── */

const letterText =
  "Dear friend, I just wanted you to know that you\u2019re doing great. The world is a little brighter because you\u2019re in it. Keep going \u2014 someone out there is cheering for you.";

/* ─── Component ─── */

export default function CtaFooterSection({ isLoggedIn, mounted }: CtaFooterSectionProps) {
  /* Counter data */
  const [letterCount, setLetterCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);
  const counterInView = useInView(counterRef, { once: true, margin: "-100px" });
  const { count, done } = useAnimatedCounter(letterCount, counterInView);
  const [counterScope, animateCounter] = useAnimate();

  useEffect(() => {
    fetch(`${apiUrl}/letters/count`)
      .then((r) => r.json())
      .then((data) => {
        const n = typeof data === "number" ? data : data?.count ?? 0;
        setLetterCount(n);
      })
      .catch(() => setLetterCount(0));
  }, []);

  /* Bounce when counter finishes */
  useEffect(() => {
    if (!done || !counterScope.current) return;
    (async () => {
      await animateCounter(counterScope.current!, { scale: 1.05 }, { type: "spring", stiffness: 300, damping: 10 });
      await animateCounter(counterScope.current!, { scale: 1 }, { type: "spring", stiffness: 300, damping: 15 });
    })();
  }, [done, animateCounter, counterScope]);

  /* Envelope auto-play animation triggered when section scrolls into view */
  const envelopeRef = useRef<HTMLDivElement>(null);
  const envelopeInView = useInView(envelopeRef, { once: true, margin: "-80px" });
  const [flapOpen, setFlapOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);

  useEffect(() => {
    if (!envelopeInView) return;
    // Sequence: wait a beat, open flap, then reveal letter
    const t1 = setTimeout(() => setFlapOpen(true), 400);
    const t2 = setTimeout(() => setLetterVisible(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [envelopeInView]);

  return (
    <section className="snap-start min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* ── Animated Counter ── */}
      <motion.div
        ref={counterRef}
        className="bg-warm-white rounded-3xl p-10 sm:p-14 shadow-sm max-w-xl mx-auto text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div ref={counterScope}>
          <p className="text-6xl sm:text-8xl font-serif font-bold text-terracotta">
            {count.toLocaleString()}
          </p>
        </div>
        <p className="text-lg text-foreground/60 mt-3">letters sent with love</p>
      </motion.div>

      {/* ── Interactive Envelope ── */}
      <div ref={envelopeRef} className="relative mt-14 flex justify-center" style={{ perspective: 800 }}>
        <motion.div
          className="relative w-80 sm:w-96"
          initial={{ opacity: 0, y: 20 }}
          animate={envelopeInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ boxShadow: flapOpen ? "0 20px 40px rgba(164,93,84,0.2)" : "0 8px 20px rgba(164,93,84,0.12)" }}
        >

          {/* Floral corners */}
          <div className="absolute -top-6 -left-6 z-30 pointer-events-none opacity-60">
            <FloralCorner />
          </div>
          <div className="absolute -top-6 -right-6 z-30 pointer-events-none opacity-60">
            <FloralCorner flip />
          </div>

          {/* Envelope body — watercolor gradient with soft edges */}
          <div
            className="relative rounded-2xl h-48 sm:h-56 overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #E8CDB5 0%, #D4A574 30%, #CCAA80 60%, #D9B68C 100%)",
            }}
          >
            {/* Paper grain texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.07] mix-blend-multiply pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Soft inner shadow at top */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/[0.06] to-transparent pointer-events-none" />

            {/* Watercolor wash accents */}
            <div className="absolute top-4 left-4 w-24 h-20 rounded-full bg-[#C4956B]/10 blur-xl pointer-events-none" />
            <div className="absolute bottom-6 right-8 w-20 h-16 rounded-full bg-[#E8B090]/10 blur-xl pointer-events-none" />

            {/* Stamp — top right */}
            <div className="absolute top-3 right-3 z-10">
              <StampSVG />
            </div>

            {/* Wax seal — center, scales down as flap opens */}
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
              animate={flapOpen ? { scale: 0.85, opacity: 0.7 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <WaxSealSVG />
            </motion.div>

            {/* Diagonal fold line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 384 224" fill="none" preserveAspectRatio="none">
              <path d="M0 224 L192 120 L384 224" stroke="#C4956B" strokeOpacity="0.15" strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* Letter paper — outside envelope body so it's not clipped by overflow-hidden */}
          <motion.div
            className="absolute left-5 right-5 rounded-xl px-6 py-5 z-10"
            initial={{ y: 0, opacity: 0 }}
            animate={letterVisible ? { y: -180, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              bottom: 0,
              background: "linear-gradient(180deg, #FEFCF9 0%, #FBF5EE 100%)",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Subtle ruled lines */}
            <div className="absolute inset-x-6 top-[2.1rem] space-y-[1.35rem] pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-px bg-[#D4A574]/10" />
              ))}
            </div>
            <p className="relative font-serif italic text-sm sm:text-base text-foreground/70 leading-[1.75]">
              {letterText}
            </p>
            <p className="relative text-right text-xs text-wood/50 mt-2 font-serif">
              &mdash; A fellow soul
            </p>
          </motion.div>

          {/* Envelope flap — watercolor gradient with soft triangle */}
          <motion.div
            className={`absolute -top-[1px] left-0 right-0 ${flapOpen ? "z-0" : "z-20"}`}
            initial={{ rotateX: 0 }}
            animate={flapOpen ? { rotateX: 180 } : {}}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{
              transformOrigin: "top center",
              backfaceVisibility: "hidden",
            }}
          >
            <svg viewBox="0 0 384 110" fill="none" className="w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="flapGrad" x1="0" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#D9A07A" />
                  <stop offset="50%" stopColor="#C4876B" />
                  <stop offset="100%" stopColor="#B87060" />
                </linearGradient>
              </defs>
              {/* Main flap shape */}
              <path d="M0 0 H384 V6 L192 110 L0 6 Z" fill="url(#flapGrad)" />
              {/* Fold highlight */}
              <path d="M0 6 L192 110 L384 6" stroke="#FFF8F0" strokeOpacity="0.1" strokeWidth="1" fill="none" />
              {/* Paper texture hint */}
              <path d="M0 0 H384 V6 L192 110 L0 6 Z" fill="url(#flapGrad)" opacity="0.02" />
            </svg>
          </motion.div>

          {/* Bottom edge shadow for depth */}
          <div className="absolute -bottom-2 left-4 right-4 h-3 rounded-b-2xl bg-gradient-to-b from-[#B8906A]/10 to-transparent blur-sm pointer-events-none" />
        </motion.div>
      </div>

      {/* ── CTA Card ── */}
      <motion.div
        className="bg-warm-white rounded-3xl p-10 sm:p-14 shadow-sm max-w-xl mx-auto text-center mt-12"
        variants={scaleFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-terracotta">
          Ready to spread some warmth?
        </h2>
        <p className="text-foreground/60 mt-4 leading-relaxed">
          A single kind letter can turn someone&apos;s whole day around. Take a moment, write from the
          heart, and make a stranger smile.
        </p>
        <div className="flex justify-center gap-4 mt-8">
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
                <CozyButton as="link" href="/register" variant="primary">
                  Get Started
                </CozyButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <CozyButton as="link" href="/login" variant="secondary">
                  Log In
                </CozyButton>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {/* ── Footer ── */}
      <footer className="mt-12 py-10 text-center">
        <div className="flex items-center justify-center gap-4">
          <a href="#" className="text-sm text-wood hover:text-terracotta transition-colors">About</a>
          <span className="text-wood/40">&middot;</span>
          <a href="#" className="text-sm text-wood hover:text-terracotta transition-colors">Privacy</a>
        </div>
        <p className="text-sm text-wood/60 mt-4">Made with warmth and care</p>
      </footer>
    </section>
  );
}
