"use client";

import { motion } from "framer-motion";
import { fadeUp, slideFromLeft, slideFromRight, staggerContainer } from "./animations";

/* ─── Inline SVG Icons ─── */

function EditorIcon() {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3" width="24" height="26" rx="3" stroke="currentColor" strokeWidth="2" />
      <line x1="9" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="20" x2="17" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 22 C21 20.5 23 19.5 23 21 C23 19.5 25 20.5 25 22 C25 24 23 25.5 23 25.5 C23 25.5 21 24 21 22Z" fill="currentColor" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4 C11 4 8 8 8 13 L8 20 L5 23 L27 23 L24 20 L24 13 C24 8 21 4 16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13 23 C13 25.2 14.3 27 16 27 C17.7 27 19 25.2 19 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="23" cy="7" r="3.5" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3 L4 8 L4 16 C4 23 9 28 16 30 C23 28 28 23 28 16 L28 8 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13 17 C13 15 16 13.5 16 16 C16 13.5 19 15 19 17 C19 19.5 16 21.5 16 21.5 C16 21.5 13 19.5 13 17Z" fill="currentColor" />
    </svg>
  );
}

function PaperPlanesIcon() {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8 L14 14 L4 16 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
      <path d="M28 8 L18 14 L28 16 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
      <path d="M14 14 Q16 20 18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="2 2" />
    </svg>
  );
}

/* ─── Features Data ─── */

const features = [
  {
    icon: EditorIcon,
    title: "Rich Text Editor",
    subtitle: "Express yourself beautifully",
    description:
      "Format your letters with bold, italic, headings, and more. Make every word count with our cozy text editor.",
    color: "text-terracotta" as const,
  },
  {
    icon: BellIcon,
    title: "Real-time Notifications",
    subtitle: "Never miss a letter",
    description:
      "Get notified instantly when a warm letter arrives in your mailbox. Every message is a little surprise.",
    color: "text-moss" as const,
  },
  {
    icon: ShieldIcon,
    title: "Privacy First",
    subtitle: "Your safe space",
    description:
      "Write anonymously or share your name — the choice is always yours. Your thoughts, your rules.",
    color: "text-terracotta" as const,
  },
  {
    icon: PaperPlanesIcon,
    title: "Direct Messages",
    subtitle: "Connect deeper",
    description:
      "Found a kindred spirit? Send a direct letter to continue the conversation.",
    color: "text-moss" as const,
  },
];

/* ─── Slide direction per grid position ─── */

const slideVariants = [slideFromLeft, slideFromRight, slideFromLeft, slideFromRight];

/* ─── Component ─── */

export default function FeaturesSection() {
  return (
    <section className="snap-start min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full flex flex-col items-center gap-16">
        {/* Header */}
        <motion.div
          className="text-center flex flex-col gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.h2
            className="font-serif text-3xl sm:text-5xl font-bold text-terracotta"
            variants={fadeUp}
          >
            Everything You Need
          </motion.h2>
          <motion.p className="text-foreground/60 text-lg max-w-xl mx-auto" variants={fadeUp}>
            Thoughtfully crafted features for meaningful connections
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-warm-white rounded-2xl p-8 shadow-sm"
              variants={slideVariants[index]}
              custom={index * 0.5}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {/* Icon */}
                <motion.div variants={fadeUp}>
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center"
                    whileHover={{ rotate: 12, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className={feature.color}>
                      <feature.icon />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Title & Subtitle */}
                <motion.div variants={fadeUp} className="mt-4">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/40 text-xs mt-1 italic">
                    {feature.subtitle}
                  </p>
                </motion.div>

                {/* Description */}
                <motion.p
                  className="text-foreground/60 text-sm leading-relaxed mt-2"
                  variants={fadeUp}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
