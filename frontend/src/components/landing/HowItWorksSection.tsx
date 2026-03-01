"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeUp, slideFromLeft, slideFromRight } from "./animations";

/* ─── Inline SVG Icons ─── */

function WriteIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="28" height="36" rx="3" fill="#D4A574" fillOpacity="0.2" stroke="#D4A574" strokeWidth="2" />
      <line x1="14" y1="14" x2="30" y2="14" stroke="#C4756B" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="20" x2="28" y2="20" stroke="#C4756B" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="26" x2="24" y2="26" stroke="#C4756B" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 30 C30 28 33 26 33 29 C33 26 36 28 36 30 C36 33 33 35 33 35 C33 35 30 33 30 30Z" fill="#C4756B" fillOpacity="0.5" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="36" height="22" rx="3" fill="#D4A574" fillOpacity="0.2" stroke="#D4A574" strokeWidth="2" />
      <path d="M6 16 L24 30 L42 16" stroke="#C4756B" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M2 18 C0 14 4 10 8 12" stroke="#7A8B69" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M2 22 C-1 18 3 15 6 16" stroke="#7A8B69" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M46 18 C48 14 44 10 40 12" stroke="#7A8B69" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M46 22 C49 18 45 15 42 16" stroke="#7A8B69" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function ReceiveIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="14" fill="#D4A574" fillOpacity="0.2" stroke="#D4A574" strokeWidth="2" />
      <circle cx="18" cy="21" r="2" fill="#C4756B" fillOpacity="0.5" />
      <circle cx="30" cy="21" r="2" fill="#C4756B" fillOpacity="0.5" />
      <path d="M18 29 C20 32 28 32 30 29" stroke="#C4756B" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="38" y1="8" x2="40" y2="4" stroke="#D4A574" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="12" x2="46" y2="10" stroke="#D4A574" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="40" y1="16" x2="44" y2="18" stroke="#D4A574" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Steps Data ─── */

const steps = [
  {
    number: "1",
    title: "Write from the heart",
    description:
      "Pour your thoughts into a warm letter \u2014 a word of encouragement, a story, or a kind note.",
    icon: <WriteIcon />,
  },
  {
    number: "2",
    title: "Send to a random soul",
    description:
      "Your letter finds its way to 5 random people across the community \u2014 complete strangers.",
    icon: <SendIcon />,
  },
  {
    number: "3",
    title: "Brighten someone\u2019s day",
    description:
      "A cozy surprise lands in someone\u2019s mailbox, spreading warmth one letter at a time.",
    icon: <ReceiveIcon />,
  },
];

/* ─── Connector Line ─── */

function ConnectorLine() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <svg
      ref={ref}
      className="absolute left-10 sm:left-14 top-0 h-full w-4 pointer-events-none hidden sm:block"
      viewBox="0 0 16 400"
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.line
        x1="8" y1="0" x2="8" y2="400"
        stroke="var(--color-wood)"
        strokeOpacity="0.3"
        strokeWidth="2"
        strokeDasharray="6 6"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

/* ─── Main Component ─── */

export default function HowItWorksSection() {
  return (
    <section className="snap-start min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-5xl flex flex-col items-center gap-12">
        {/* Title */}
        <motion.h2
          className="font-serif text-3xl sm:text-5xl font-bold text-terracotta text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          How It Works
        </motion.h2>

        {/* Cards container with connector */}
        <div className="relative w-full flex flex-col gap-6">
          <ConnectorLine />

          {steps.map((step, i) => {
            const variant = i % 2 === 0 ? slideFromLeft : slideFromRight;

            return (
              <motion.div
                key={step.number}
                className="relative bg-warm-white rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-6 overflow-hidden"
                variants={variant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
              >
                {/* Watermark number */}
                <span className="absolute top-2 right-4 text-8xl font-serif font-bold text-terracotta/10 select-none pointer-events-none leading-none">
                  {step.number}
                </span>

                {/* Icon circle */}
                <motion.div
                  className="flex-shrink-0 w-20 h-20 rounded-full bg-cream flex items-center justify-center"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {step.icon}
                </motion.div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-foreground/60 leading-relaxed text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
