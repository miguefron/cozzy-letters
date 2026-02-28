"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import LetterContent from "./LetterContent";
import type { InboxLetter } from "@/stores/useInboxStore";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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
              className="rounded-2xl bg-warm-white p-8 shadow-xl sm:p-10"
            >
              {/* Header */}
              <p className="text-sm font-medium text-foreground/60">
                From {letter.senderName}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-terracotta">
                {letter.title}
              </h2>
              <p className="mt-1 text-xs text-foreground/40">
                {formatDate(letter.deliveredAt)}
              </p>

              <hr className="my-6 border-wood/10" />

              {/* Body */}
              <div className="max-h-[50vh] overflow-y-auto">
                <LetterContent html={letter.content} />
              </div>

              <hr className="my-6 border-wood/10" />

              {/* Footer */}
              <div className="flex items-center justify-between">
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
