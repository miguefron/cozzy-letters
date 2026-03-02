"use client";

import { motion } from "framer-motion";
import { fadeUp, letterFlip, staggerContainer, floatAnimation } from "./animations";

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

/* ─── Letter Data ─── */

const letters = [
  {
    body: "Dear stranger, I hope this letter finds you on a good day. If not, I hope it makes it a little better. You are seen, you are valued, and somewhere in this big world, someone is thinking of you right now.",
    signature: "— A soul who believes in you",
    rotation: -4,
  },
  {
    body: "To whoever reads this: I was having the worst week when I decided to write. And somehow, putting kindness into words for someone I\u2019ll never meet made everything feel lighter. Thank you for being on the other end.",
    signature: "— A grateful heart",
    rotation: 0,
  },
  {
    body: "Querido desconocido, el mundo puede parecer ruidoso y apresurado, pero este momento \u2014 t\u00fa leyendo estas palabras \u2014 es un peque\u00f1o acto de calma. Respira hondo. Todo va a estar bien.",
    signature: "— Un alma que te quiere bien",
    rotation: 4,
  },
];

/* ─── Wax Seal ─── */

function WaxSeal() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#C4756B" fillOpacity="0.8" />
      <circle
        cx="16"
        cy="16"
        r="12"
        fill="none"
        stroke="#FFF8F0"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <path
        d="M14 14 C14 12.5 16 11 16 13 C16 11 18 12.5 18 14 C18 16 16 18 16 18 C16 18 14 16 14 14Z"
        fill="#FFF8F0"
        fillOpacity="0.6"
      />
    </svg>
  );
}

/* ─── Z-index for fan stacking (center card on top) ─── */

const zIndexMap = [1, 3, 2];

/* ─── Letter Card ─── */

function LetterCard({
  body,
  signature,
  rotation,
  index,
}: {
  body: string;
  signature: string;
  rotation: number;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={letterFlip}
      whileHover={{
        y: -8,
        rotate: 0,
        boxShadow:
          "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      style={{ rotate: rotation, zIndex: zIndexMap[index] }}
      className="relative w-72 sm:w-80 bg-[#FEFCF9] rounded-2xl shadow-lg p-8 sm:p-10
                 border border-wood/20 cursor-default"
    >
      {/* Wax seal */}
      <div
        className="absolute top-4 right-4 animate-pulse"
        style={{ animationDuration: "3s" }}
      >
        <WaxSeal />
      </div>

      {/* Decorative opening quote */}
      <span className="block font-serif text-4xl text-terracotta/20 leading-none select-none mb-1">
        &ldquo;
      </span>

      {/* Letter body */}
      <p className="font-serif italic text-foreground/80 leading-relaxed text-sm sm:text-base pr-8">
        {body}
      </p>

      {/* Divider */}
      <div className="mt-5 mb-3 h-px w-16 ml-auto bg-wood/30" />

      {/* Signature */}
      <p className="text-sm text-wood mt-4 text-right">{signature}</p>
    </motion.div>
  );
}

/* ─── Section ─── */

export default function ExampleLettersSection() {
  return (
    <section className="snap-start min-h-screen flex flex-col items-center justify-center px-4 py-20 sm:py-24 relative overflow-hidden">
      {/* Floating envelopes */}
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 5.2, delay: 0.3 }} className="absolute pointer-events-none" style={{ top: "10%", left: "5%", rotate: -10 }}>
        <EnvelopeSVG size={36} />
      </motion.div>
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 5.8, delay: 1.5 }} className="absolute pointer-events-none" style={{ top: "12%", left: "88%", rotate: 15 }}>
        <EnvelopeSVG size={42} />
      </motion.div>
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 4.6, delay: 2.0 }} className="absolute pointer-events-none" style={{ top: "70%", left: "8%", rotate: 22 }}>
        <EnvelopeSVG size={30} />
      </motion.div>
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 5.4, delay: 0.8 }} className="absolute pointer-events-none" style={{ top: "65%", left: "90%", rotate: -14 }}>
        <EnvelopeSVG size={38} />
      </motion.div>
      <motion.div animate={floatAnimation} transition={{ ...floatAnimation.transition, duration: 5.0, delay: 1.2 }} className="absolute pointer-events-none" style={{ top: "40%", left: "3%", rotate: 18 }}>
        <EnvelopeSVG size={26} />
      </motion.div>

      {/* Heading */}
      <motion.div
        className="text-center mb-14 sm:mb-18"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeUp}
          className="font-serif text-3xl sm:text-5xl font-bold text-terracotta"
        >
          Letters That Warm the Heart
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={1}
          className="mt-4 text-foreground/60 text-base sm:text-lg"
        >
          Real words from our community
        </motion.p>
      </motion.div>

      {/* Fan of cards */}
      <motion.div
        className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0 lg:-space-x-4"
        style={{ perspective: 1200 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {letters.map((letter, i) => (
          <LetterCard
            key={i}
            body={letter.body}
            signature={letter.signature}
            rotation={letter.rotation}
            index={i}
          />
        ))}
      </motion.div>
    </section>
  );
}
