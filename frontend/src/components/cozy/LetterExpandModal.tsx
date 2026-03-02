"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import CozyLetterCard from "./CozyLetterCard";
import type { InboxLetter } from "@/stores/useInboxStore";

interface LetterExpandModalProps {
  letter: InboxLetter;
  onClose: () => void;
}

export default function LetterExpandModal({
  letter,
  onClose,
}: LetterExpandModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (typeof window === "undefined") return null;

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
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-3xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-warm-white text-foreground/60 shadow-md transition-colors hover:text-terracotta"
          >
            &times;
          </button>

          <CozyLetterCard
            senderName={letter.senderName}
            title={letter.title}
            content={letter.content}
            signature={letter.signature}
            deliveredAt={letter.deliveredAt}
            maxContentHeight="70vh"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
