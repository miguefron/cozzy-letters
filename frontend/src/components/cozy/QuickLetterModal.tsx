"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CozyInput from "./CozyInput";
import CozyButton from "./CozyButton";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";

interface QuickLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickLetterModal({
  isOpen,
  onClose,
}: QuickLetterModalProps) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [signature, setSignature] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state after modal close animation
  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setTitle("");
        setContent("");
        setSignature("");
        setIsSending(false);
        setIsSent(false);
        setError(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const signatureInitialized = useRef(false);
  useEffect(() => {
    if (isOpen && !signatureInitialized.current && !signature && user?.displayName) {
      setSignature(user.displayName);
      signatureInitialized.current = true;
    }
    if (!isOpen) {
      signatureInitialized.current = false;
    }
  }, [isOpen, user?.displayName, signature]);

  // Auto-close after success
  useEffect(() => {
    if (!isSent) return;
    const timeout = setTimeout(onClose, 2000);
    return () => clearTimeout(timeout);
  }, [isSent, onClose]);

  const handleSend = useCallback(async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSending(true);
    setError(null);

    try {
      // Convert plain text to HTML paragraphs
      const htmlContent = content
        .split("\n\n")
        .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
        .join("");

      const res = await apiFetch("/letters", {
        method: "POST",
        body: JSON.stringify({ title, content: htmlContent, ...(signature && { signature }) }),
      });

      if (!res.ok) throw new Error("Failed to send letter");
      setIsSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSending(false);
    }
  }, [title, content, signature]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 mb-24 w-full max-w-md rounded-2xl bg-warm-white p-6 shadow-xl sm:mb-0"
          >
            {isSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-4 text-center"
              >
                <span className="text-4xl">💌</span>
                <h3 className="font-serif text-xl font-semibold text-terracotta">
                  Letter Sent!
                </h3>
                <p className="text-sm text-foreground/60">
                  Your letter is on its way to a random soul.
                </p>
              </motion.div>
            ) : (
              <>
                <h3 className="mb-4 font-serif text-xl font-semibold text-terracotta">
                  Quick Letter
                </h3>

                <div className="flex flex-col gap-4">
                  <CozyInput
                    id="quick-title"
                    type="text"
                    variant="serif"
                    label="Subject"
                    placeholder="A warm greeting..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <CozyInput
                    as="textarea"
                    id="quick-content"
                    label="Your letter"
                    placeholder="Dear friend..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="resize-none leading-relaxed"
                  />

                  <CozyInput
                    id="quick-signature"
                    type="text"
                    label="Sign as"
                    placeholder="— A kind soul"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                  />

                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}

                  <CozyButton
                    onClick={handleSend}
                    disabled={isSending || !title.trim() || !content.trim()}
                    fullWidth
                  >
                    {isSending ? "Sending..." : "Send Letter"}
                  </CozyButton>

                  <CozyButton
                    as="link"
                    href="/write-letter"
                    variant="ghost"
                    fullWidth
                    className="text-center"
                    onClick={onClose}
                  >
                    Use advanced editor
                  </CozyButton>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
