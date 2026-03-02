"use client";

import { motion } from "framer-motion";
import { fadeUp, scaleFade, staggerContainer, floatAnimation } from "./animations";

/* ─── Inline Envelope SVG (identical to HeroSection) ─── */

function EnvelopeSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="16" width="56" height="36" rx="4" fill="#D4A574" fillOpacity="0.25" stroke="#D4A574" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M4 18 L32 38 L60 18" stroke="#C4756B" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M29 28 C29 26 32 24 32 27 C32 24 35 26 35 28 C35 31 32 33 32 33 C32 33 29 31 29 28Z" fill="#C4756B" fillOpacity="0.3" />
    </svg>
  );
}

const quoteLines = [
  "In a world of instant messages and fleeting notifications,",
  "a letter is a quiet rebellion \u2014 a promise that someone sat down,",
  "thought of you, and chose their words with care.",
];

export default function EmotionalSection() {
  return (
    <section
      className="snap-start min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 30% 50%, rgba(196,117,107,0.05) 0%, transparent 70%),
          radial-gradient(ellipse at 70% 60%, rgba(212,165,116,0.06) 0%, transparent 60%),
          linear-gradient(180deg, #FEFCF9 0%, #FFF8F0 100%)
        `,
      }}
    >
      {/* Floating envelopes */}
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 5.2 }} className="absolute pointer-events-none" style={{ top: "10%", left: "6%", rotate: -15 }}>
        <EnvelopeSVG size={36} />
      </motion.div>
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 5.8, delay: 1.0 }} className="absolute pointer-events-none" style={{ top: "18%", left: "88%", rotate: 20 }}>
        <EnvelopeSVG size={42} />
      </motion.div>
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 4.8, delay: 0.5 }} className="absolute pointer-events-none" style={{ top: "55%", left: "4%", rotate: 10 }}>
        <EnvelopeSVG size={30} />
      </motion.div>
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 6.0, delay: 1.6 }} className="absolute pointer-events-none" style={{ top: "65%", left: "90%", rotate: -18 }}>
        <EnvelopeSVG size={38} />
      </motion.div>
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 5.4, delay: 0.3 }} className="absolute pointer-events-none" style={{ top: "80%", left: "12%", rotate: 22 }}>
        <EnvelopeSVG size={28} />
      </motion.div>
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 5.0, delay: 1.8 }} className="absolute pointer-events-none" style={{ top: "75%", left: "85%", rotate: -8 }}>
        <EnvelopeSVG size={34} />
      </motion.div>

      {/* Content card */}
      <motion.div
        variants={scaleFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative max-w-2xl w-full mx-4 p-10 sm:p-14 backdrop-blur-sm bg-warm-white/70 rounded-3xl shadow-sm"
      >
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {/* Opening quote mark */}
          <motion.span variants={fadeUp} className="block font-serif text-6xl text-terracotta/30 leading-none select-none">
            &ldquo;
          </motion.span>

          {/* Decorative divider */}
          <motion.div variants={fadeUp} className="w-12 h-px bg-wood/30 mb-6" />

          {/* Quote lines with stagger */}
          {quoteLines.map((line, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              custom={i}
              className="font-serif italic text-lg sm:text-xl text-foreground/80 leading-relaxed"
            >
              {line}
            </motion.p>
          ))}

          {/* Decorative divider */}
          <motion.div variants={fadeUp} className="w-12 h-px bg-wood/30 mt-6 mb-4" />

          {/* Attribution */}
          <motion.p variants={fadeUp} className="text-sm text-wood text-right">
            &mdash; The CozyLetters Philosophy
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
