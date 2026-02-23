"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { useInboxStore, type InboxLetter } from "@/stores/useInboxStore";
import Skeleton from "@/components/cozy/Skeleton";
import CozyCard from "@/components/cozy/CozyCard";
import CozyButton from "@/components/cozy/CozyButton";
import LetterContent from "@/components/cozy/LetterContent";

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

export default function InboxPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const {
    letters,
    isLoading,
    error,
    selectedLetter,
    fetchInbox,
    markAsRead,
    selectLetter,
    clearSelection,
  } = useInboxStore();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  useEffect(() => {
    if (token) fetchInbox();
  }, [token, fetchInbox]);

  const handleSelect = (letter: InboxLetter) => {
    selectLetter(letter);
    if (!letter.isRead) markAsRead(letter.id);
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:py-12 sm:pt-24">
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1 text-sm text-wood transition-colors hover:text-terracotta"
          >
            &larr; Back home
          </Link>

          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-serif text-3xl font-semibold text-terracotta">
              Your Inbox
            </h1>
          </div>

          {isLoading && (
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Skeleton left panel — letter list */}
              <div className="flex flex-col gap-3 md:w-2/5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-warm-white p-4 shadow-sm border-l-4 border-transparent"
                  >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-2 h-4 w-48" />
                    <Skeleton className="mt-2 h-3 w-20" />
                  </div>
                ))}
              </div>
              {/* Skeleton right panel — open letter */}
              <div className="hidden md:block md:w-3/5">
                <div className="rounded-2xl bg-warm-white p-8 shadow-lg sm:p-10">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-3 h-7 w-56" />
                  <Skeleton className="mt-2 h-3 w-24" />
                  <div className="my-6 h-px bg-wood/10" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-warm-white p-12 text-center shadow-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {!isLoading && !error && letters.length === 0 && (
            <CozyCard variant="hero" animated
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center gap-4 text-center shadow-lg"
            >
              <span className="text-5xl">📭</span>
              <h2 className="font-serif text-2xl font-semibold text-terracotta">
                Your mailbox is empty
              </h2>
              <p className="max-w-sm text-foreground/70">
                No letters yet — but they&apos;ll come! In the meantime, why not
                brighten someone else&apos;s day?
              </p>
            </CozyCard>
          )}

          {!isLoading && !error && letters.length > 0 && (
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Left panel — Letter list */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={`flex flex-col gap-3 md:w-2/5 ${
                  selectedLetter ? "hidden md:flex" : "flex"
                }`}
              >
                <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                  {letters.map((letter, i) => (
                    <motion.button
                      key={letter.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      onClick={() => handleSelect(letter)}
                      className={`w-full rounded-xl bg-warm-white p-4 text-left shadow-sm transition-all hover:shadow-md ${
                        selectedLetter?.id === letter.id
                          ? "ring-2 ring-terracotta/40"
                          : ""
                      } ${
                        !letter.isRead
                          ? "border-l-4 border-terracotta"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm ${
                            !letter.isRead
                              ? "font-semibold text-foreground"
                              : "text-foreground/70"
                          }`}
                        >
                          {letter.senderName}
                        </p>
                        {!letter.isRead && (
                          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-terracotta" />
                        )}
                      </div>
                      <p
                        className={`mt-1 truncate text-sm ${
                          !letter.isRead
                            ? "font-medium text-foreground/90"
                            : "text-foreground/60"
                        }`}
                      >
                        {letter.title}
                      </p>
                      <p className="mt-1 text-xs text-foreground/40">
                        {formatDate(letter.deliveredAt)}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Right panel — Letter content */}
              <div
                className={`md:w-3/5 ${
                  selectedLetter ? "block" : "hidden md:block"
                }`}
              >
                {selectedLetter ? (
                  <motion.div
                    key={selectedLetter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl bg-warm-white p-8 shadow-lg sm:p-10"
                  >
                    <button
                      onClick={clearSelection}
                      className="mb-6 text-sm text-wood transition-colors hover:text-terracotta md:hidden"
                    >
                      &larr; Back to inbox
                    </button>

                    <p className="text-sm font-medium text-foreground/60">
                      From {selectedLetter.senderName}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-semibold text-terracotta">
                      {selectedLetter.title}
                    </h2>
                    <p className="mt-1 text-xs text-foreground/40">
                      {formatDate(selectedLetter.deliveredAt)}
                    </p>

                    <hr className="my-6 border-wood/10" />

                    <LetterContent html={selectedLetter.content} />
                  </motion.div>
                ) : (
                  <div className="hidden h-full items-center justify-center rounded-2xl bg-warm-white p-12 shadow-lg md:flex">
                    <p className="text-foreground/40">
                      Select a letter to read it
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
