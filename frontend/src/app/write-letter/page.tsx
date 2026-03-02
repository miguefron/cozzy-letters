"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLetterStore } from "@/stores/useLetterStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiFetch } from "@/lib/api";
import CozyCard from "@/components/cozy/CozyCard";
import CozyInput from "@/components/cozy/CozyInput";
import CozyButton from "@/components/cozy/CozyButton";
import TiptapEditor from "@/components/cozy/TiptapEditor";

type Phase = "writing" | "folding" | "flying" | "success";
type SendMode = "random" | "specific";

interface UserSearchResult {
  id: number;
  displayName: string;
}

export default function WriteLetterPage() {
  const { title, content, signature, isSending, isSent, error, setTitle, setContent, setSignature, sendLetter, reset, recipientId, recipientName, setRecipient, clearRecipient } =
    useLetterStore();
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("writing");
  const [editorKey, setEditorKey] = useState(0);

  // Recipient search
  const [sendMode, setSendMode] = useState<SendMode>("random");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sendMode === "random") {
      clearRecipient();
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [sendMode, clearRecipient]);

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
      } catch {
        // ignore
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!signature && user?.displayName) {
      setSignature(user.displayName);
    }
  }, [user?.displayName, signature, setSignature]);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  useEffect(() => {
    if (phase === "success") {
      reset();
      setEditorKey((k) => k + 1);
    }
  }, [phase, reset]);

  const handleWriteAnother = useCallback(() => {
    setSendMode("random");
    setPhase("writing");
  }, []);

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) return;
    setPhase("folding");
    await sendLetter();
  };

  if (!token) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Phase 1: Writing — the form */}
          {phase === "writing" && (
            <CozyCard
              key="letter-card"
              variant="large"
              animated
              exit={{ opacity: 0 }}
            >
              <Link
                href="/"
                className="mb-8 inline-flex items-center gap-1 text-sm text-wood transition-colors hover:text-terracotta"
              >
                &larr; Back home
              </Link>

              <h2 className="mb-6 font-serif text-3xl font-semibold text-terracotta">
                Write a Letter
              </h2>

              {/* Send mode toggle */}
              <div className="mb-6">
                <div className="flex rounded-xl bg-cream/60 p-1">
                  <button
                    type="button"
                    onClick={() => setSendMode("random")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      sendMode === "random"
                        ? "bg-warm-white text-terracotta shadow-sm"
                        : "text-wood/60 hover:text-wood"
                    }`}
                  >
                    Random souls
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendMode("specific")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      sendMode === "specific"
                        ? "bg-warm-white text-terracotta shadow-sm"
                        : "text-wood/60 hover:text-wood"
                    }`}
                  >
                    Specific person
                  </button>
                </div>

                {sendMode === "specific" && (
                  <div className="mt-4">
                    {recipientId && recipientName ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A574]/15 px-3 py-1.5 text-sm font-medium text-[#5C4033]">
                          {recipientName}
                          <button
                            type="button"
                            onClick={() => {
                              clearRecipient();
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
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-xl border border-wood/20 bg-warm-white px-4 py-2.5 text-sm text-foreground placeholder:text-wood/40 focus:border-terracotta/40 focus:outline-none focus:ring-2 focus:ring-terracotta/10"
                        />
                        {searchLoading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-wood/20 border-t-terracotta" />
                          </div>
                        )}
                        {searchResults.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full rounded-xl border border-wood/10 bg-warm-white py-1 shadow-lg">
                            {searchResults.map((user) => (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => {
                                  setRecipient(user.id, user.displayName);
                                  setSearchResults([]);
                                  setSearchQuery("");
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-cream/60"
                              >
                                {user.displayName}
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
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <CozyInput
                  id="letter-title"
                  type="text"
                  variant="serif"
                  label="Subject"
                  placeholder="A warm greeting..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <div>
                  <label
                    htmlFor="letter-content"
                    className="mb-1.5 block text-sm font-medium text-foreground/70"
                  >
                    Your letter
                  </label>
                  <TiptapEditor
                    key={editorKey}
                    content={content}
                    onChange={(html) => setContent(html)}
                    placeholder="Dear friend, I wanted to share something with you..."
                  />
                </div>

                <CozyInput
                  id="letter-signature"
                  type="text"
                  label="Sign as"
                  placeholder="— A kind soul"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}

                <CozyButton
                  onClick={handleSend}
                  disabled={isSending || !title.trim() || !content.trim()}
                  fullWidth
                  className="mt-2"
                >
                  {isSending ? "Sending..." : "Send Letter"}
                </CozyButton>
              </div>
            </CozyCard>
          )}

          {/* Phase 2: Folding — letter folds into an envelope */}
          {phase === "folding" && (
            <motion.div
              key="folding"
              initial={{ opacity: 1, scaleY: 1 }}
              animate={{ opacity: 1, scaleY: 0.05 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              onAnimationComplete={() => setPhase("flying")}
              style={{ transformOrigin: "top center" }}
              className="rounded-2xl bg-warm-white p-6 shadow-lg sm:p-8 md:p-12"
            >
              <h2 className="mb-4 font-serif text-3xl font-semibold text-terracotta">
                {title || "Your Letter"}
              </h2>
              <div
                className="cozy-prose line-clamp-6"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </motion.div>
          )}

          {/* Phase 3: Flying — CSS-only envelope flies away */}
          {phase === "flying" && (
            <motion.div
              key="envelope"
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: 0, x: 300, y: -400, rotate: 15 }}
              transition={{ duration: 1, ease: "easeIn" }}
              onAnimationComplete={() => {
                if (isSent) {
                  setPhase("success");
                } else {
                  // API hasn't finished yet — wait and retry
                  const check = setInterval(() => {
                    const state = useLetterStore.getState();
                    if (state.isSent) {
                      clearInterval(check);
                      setPhase("success");
                    } else if (state.error) {
                      clearInterval(check);
                      setPhase("writing");
                    }
                  }, 200);
                }
              }}
              className="flex items-center justify-center"
            >
              {/* Envelope */}
              <div className="relative h-48 w-72">
                {/* Envelope body */}
                <div className="absolute inset-0 rounded-lg bg-[#D4A574] shadow-xl" />

                {/* Envelope flap (triangle) */}
                <div
                  className="absolute top-0 left-0 w-full h-24"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    backgroundColor: "#BF9060",
                  }}
                />

                {/* Inner V fold line */}
                <div
                  className="absolute bottom-0 left-0 w-full h-28"
                  style={{
                    clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
                    backgroundColor: "#C89B6E",
                  }}
                />

                {/* Wax seal */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-[#C4756B] shadow-md flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full border-2 border-[#A85F55]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 4: Success */}
          {phase === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center gap-6 rounded-2xl bg-warm-white p-8 text-center shadow-lg sm:p-12"
            >
              <span className="text-5xl">💌</span>
              <h2 className="font-serif text-3xl font-semibold text-terracotta">
                Letter Sent!
              </h2>
              <p className="max-w-sm text-foreground/70">
                Your letter is on its way to a random soul. Someone out there is about
                to receive a little warmth.
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <CozyButton onClick={handleWriteAnother}>
                  Write Another
                </CozyButton>
                <CozyButton as="link" href="/" variant="secondary" className="text-center">
                  Go Home
                </CozyButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
