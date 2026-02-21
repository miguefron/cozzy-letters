"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLetterStore } from "@/stores/useLetterStore";
import { useAuthStore } from "@/stores/useAuthStore";

type Phase = "writing" | "folding" | "flying" | "success";

export default function WriteLetterPage() {
  const { title, content, isSending, isSent, error, setTitle, setContent, setToken, sendLetter, reset } =
    useLetterStore();
  const { token } = useAuthStore();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("writing");

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) return;
    const currentToken = useAuthStore.getState().token;
    if (currentToken) setToken(currentToken);
    setPhase("folding");
    await sendLetter();
  };

  if (!token) return null;

  const handleWriteAnother = useCallback(() => {
    reset();
    setPhase("writing");
  }, [reset]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Phase 1: Writing — the form */}
          {phase === "writing" && (
            <motion.div
              key="letter-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="rounded-2xl bg-warm-white p-8 shadow-lg sm:p-12"
            >
              <Link
                href="/"
                className="mb-8 inline-flex items-center gap-1 text-sm text-wood transition-colors hover:text-terracotta"
              >
                &larr; Back home
              </Link>

              <h2 className="mb-8 font-serif text-3xl font-semibold text-terracotta">
                Write a Letter
              </h2>

              <div className="flex flex-col gap-6">
                <div>
                  <label htmlFor="letter-title" className="mb-2 block text-sm font-medium text-foreground/60">
                    Subject
                  </label>
                  <input
                    id="letter-title"
                    type="text"
                    placeholder="A warm greeting..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-wood/30 bg-cream/50 px-5 py-3 font-serif text-xl text-foreground placeholder:text-wood/50 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="letter-content" className="mb-2 block text-sm font-medium text-foreground/60">
                    Your letter
                  </label>
                  <textarea
                    id="letter-content"
                    placeholder="Dear friend, I wanted to share something with you..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="w-full resize-none rounded-xl border border-wood/30 bg-cream/50 px-5 py-4 text-foreground leading-relaxed placeholder:text-wood/50 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition-colors"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  onClick={handleSend}
                  disabled={isSending || !title.trim() || !content.trim()}
                  className="mt-2 w-full rounded-xl bg-terracotta px-6 py-3.5 font-medium text-warm-white transition-colors hover:bg-terracotta/85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSending ? "Sending..." : "Send Letter"}
                </button>
              </div>
            </motion.div>
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
              className="rounded-2xl bg-warm-white p-8 shadow-lg sm:p-12"
            >
              <h2 className="mb-4 font-serif text-3xl font-semibold text-terracotta">
                {title || "Your Letter"}
              </h2>
              <p className="whitespace-pre-wrap text-foreground/70 leading-relaxed line-clamp-6">
                {content}
              </p>
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
              className="flex flex-col items-center gap-6 rounded-2xl bg-warm-white p-12 text-center shadow-lg"
            >
              <span className="text-5xl">💌</span>
              <h2 className="font-serif text-3xl font-semibold text-terracotta">
                Letter Sent!
              </h2>
              <p className="max-w-sm text-foreground/70">
                Your letter is on its way to a random soul. Someone out there is about
                to receive a little warmth.
              </p>
              <div className="mt-2 flex gap-4">
                <button
                  onClick={handleWriteAnother}
                  className="rounded-xl bg-terracotta px-6 py-3 font-medium text-warm-white transition-colors hover:bg-terracotta/85"
                >
                  Write Another
                </button>
                <Link
                  href="/"
                  className="rounded-xl border-2 border-moss px-6 py-3 font-medium text-moss transition-colors hover:bg-moss/10"
                >
                  Go Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
