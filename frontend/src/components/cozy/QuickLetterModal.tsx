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
  const [sendMode, setSendMode] = useState<"random" | "specific">("random");
  const [recipientId, setRecipientId] = useState<number | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{id: number; displayName: string}[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

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
        setSendMode("random");
        setRecipientId(null);
        setRecipientName("");
        setSearchQuery("");
        setSearchResults([]);
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

  // Debounced user search
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await apiFetch(`/users/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch { /* ignore */ } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [searchQuery]);

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
        body: JSON.stringify({
          title,
          content: htmlContent,
          ...(signature && { signature }),
          ...(recipientId && { recipientId }),
        }),
      });

      if (!res.ok) throw new Error("Failed to send letter");
      setIsSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSending(false);
    }
  }, [title, content, signature, recipientId]);

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
                  {recipientName
                    ? `Your letter is on its way to ${recipientName}.`
                    : "Your letter is on its way to a random soul."}
                </p>
              </motion.div>
            ) : (
              <>
                <h3 className="mb-4 font-serif text-xl font-semibold text-terracotta">
                  Quick Letter
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Recipient selector */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                      To
                    </label>
                    {sendMode === "specific" && recipientId ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A574]/15 px-3 py-1.5 text-sm font-medium text-[#5C4033]">
                          {recipientName}
                          <button
                            type="button"
                            onClick={() => {
                              setRecipientId(null);
                              setRecipientName("");
                              setSendMode("random");
                              setSearchQuery("");
                            }}
                            className="ml-1 text-[#A68B6B]/60 transition-colors hover:text-[#A68B6B]"
                            aria-label="Clear recipient"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    ) : sendMode === "specific" ? (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-xl border border-wood/20 bg-warm-white px-4 py-2.5 text-sm text-foreground placeholder:text-wood/40 focus:border-terracotta/40 focus:outline-none focus:ring-2 focus:ring-terracotta/10"
                          autoFocus
                        />
                        {searchLoading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-wood/20 border-t-terracotta" />
                          </div>
                        )}
                        {searchResults.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full rounded-xl border border-wood/10 bg-warm-white py-1 shadow-lg">
                            {searchResults.map((u) => (
                              <button
                                key={u.id}
                                type="button"
                                onClick={() => {
                                  setRecipientId(u.id);
                                  setRecipientName(u.displayName);
                                  setSearchResults([]);
                                  setSearchQuery("");
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-cream/60"
                              >
                                {u.displayName}
                              </button>
                            ))}
                          </div>
                        )}
                        {searchQuery.trim().length >= 2 && !searchLoading && searchResults.length === 0 && (
                          <div className="absolute z-10 mt-1 w-full rounded-xl border border-wood/10 bg-warm-white px-4 py-3 text-sm text-wood/60 shadow-lg">
                            No users found
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSendMode("specific")}
                        className="flex items-center gap-2 rounded-xl border border-dashed border-wood/20 px-4 py-2.5 text-sm text-wood/50 transition-colors hover:border-terracotta/30 hover:text-wood/70"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <line x1="19" y1="8" x2="19" y2="14" />
                          <line x1="16" y1="11" x2="22" y2="11" />
                        </svg>
                        Random souls — tap to choose someone
                      </button>
                    )}
                  </div>

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
