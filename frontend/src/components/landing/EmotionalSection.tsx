"use client";

import { motion } from "framer-motion";
import { fadeUp, scaleFade, staggerContainer, floatAnimation } from "./animations";

/* Small SVG leaf used as a floating decorative element */
const Leaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
  </svg>
);

/* Tiny heart SVG for floating accents */
const Heart = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

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
      {/* TODO: Replace gradients with <Image src="/emotional-desk.webp" fill /> for full-bleed background */}

      {/* Floating decorative elements */}
      <motion.div animate={{ ...floatAnimation }} className="absolute top-16 left-[12%]">
        <Leaf className="w-6 h-6 text-moss/20 rotate-[-30deg]" />
      </motion.div>
      <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1.2 } }} className="absolute top-28 right-[10%]">
        <Heart className="w-5 h-5 text-terracotta/15" />
      </motion.div>
      <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 2.4 } }} className="absolute bottom-24 left-[8%]">
        <Heart className="w-4 h-4 text-terracotta/10 rotate-12" />
      </motion.div>
      <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 0.8 } }} className="absolute bottom-32 right-[14%]">
        <Leaf className="w-7 h-7 text-moss/15 rotate-[45deg]" />
      </motion.div>

      {/* Corner botanical accents */}
      <Leaf className="absolute top-8 left-8 w-10 h-10 text-moss/10 rotate-[-60deg]" />
      <Leaf className="absolute bottom-8 right-8 w-10 h-10 text-moss/10 rotate-[120deg]" />

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
