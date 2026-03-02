"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import CozyLetterCard from "./CozyLetterCard";
import type { InboxLetter } from "@/stores/useInboxStore";

interface LetterQueueOverlayProps {
  letters: InboxLetter[];
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
}

export default function LetterQueueOverlay({
  letters,
  onClose,
  onMarkAsRead,
}: LetterQueueOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const letter = letters[currentIndex];
  const isLast = currentIndex === letters.length - 1;

  // Mark current letter as read when it appears
  useEffect(() => {
    if (letter && !letter.isRead) {
      onMarkAsRead(letter.id);
    }
  }, [letter, onMarkAsRead]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleNext = useCallback(() => {
    if (isLast) {
      onClose();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [isLast, onClose]);

  if (typeof window === "undefined" || !letter) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Card */}
        <div
          className="relative w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-warm-white text-foreground/60 shadow-md transition-colors hover:text-terracotta"
          >
            &times;
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <CozyLetterCard
                senderName={letter.senderName}
                title={letter.title}
                content={letter.content}
                signature={letter.signature}
                deliveredAt={letter.deliveredAt}
                maxContentHeight="50vh"
              />

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#FEFCF9] px-8 py-4 shadow-lg border border-wood/10">
                <p className="text-sm text-foreground/40">
                  Letter {currentIndex + 1} of {letters.length}
                </p>
                <button
                  onClick={handleNext}
                  className="rounded-xl bg-terracotta px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-terracotta/90"
                >
                  {isLast ? "Done \u2713" : "Next \u2192"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
