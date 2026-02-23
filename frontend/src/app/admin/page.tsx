"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useAdminStore,
  type AdminLetter,
} from "@/stores/useAdminStore";
import CozyButton from "@/components/cozy/CozyButton";

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

type Tab = "letters" | "users";

export default function AdminPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const {
    letters,
    users,
    isLoadingLetters,
    isLoadingUsers,
    error,
    fetchLetters,
    fetchUsers,
    deleteLetter,
    deleteUser,
  } = useAdminStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("letters");
  const [expandedLetterId, setExpandedLetterId] = useState<number | null>(null);
  const [letterSearch, setLetterSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!token || !user || user.role !== "ADMIN") {
      router.push("/");
    }
  }, [mounted, token, user, router]);

  useEffect(() => {
    if (mounted && token && user?.role === "ADMIN") {
      fetchLetters();
      fetchUsers();
    }
  }, [mounted, token, user, fetchLetters, fetchUsers]);

  if (!mounted || !token || !user || user.role !== "ADMIN") return null;

  const handleDeleteLetter = (id: number) => {
    if (window.confirm("Are you sure you want to delete this letter?")) {
      deleteLetter(id);
    }
  };

  const handleDeleteUser = (id: number, displayName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${displayName}"? This cannot be undone.`
      )
    ) {
      deleteUser(id);
    }
  };

  const toggleLetterExpand = (id: number) => {
    setExpandedLetterId(expandedLetterId === id ? null : id);
  };

  const filteredLetters = letters.filter((l) => {
    if (!letterSearch) return true;
    const q = letterSearch.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.senderName.toLowerCase().includes(q) ||
      l.senderEmail.toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch = !userSearch ||
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-cream px-4 py-8 sm:py-12 sm:pt-24">
      <div className="mx-auto w-full max-w-4xl">
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

          <h1 className="mb-2 font-serif text-3xl font-semibold text-terracotta">
            Admin Panel
          </h1>
          <p className="mb-8 text-sm text-wood/70">
            Manage letters and users
          </p>

          {/* Tabs */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setActiveTab("letters")}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "letters"
                  ? "bg-terracotta text-warm-white"
                  : "bg-warm-white text-wood hover:bg-wood/10"
              }`}
            >
              Letters ({letterSearch ? `${filteredLetters.length}/${letters.length}` : letters.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "users"
                  ? "bg-terracotta text-warm-white"
                  : "bg-warm-white text-wood hover:bg-wood/10"
              }`}
            >
              Users ({userSearch || roleFilter !== "ALL" ? `${filteredUsers.length}/${users.length}` : users.length})
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-warm-white p-4 text-center shadow-sm">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Letters Tab */}
          {activeTab === "letters" && (
            <motion.div
              key="letters"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by title or sender..."
                  value={letterSearch}
                  onChange={(e) => setLetterSearch(e.target.value)}
                  className="w-full rounded-xl border border-wood/20 bg-warm-white px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>
              {isLoadingLetters ? (
                <div className="rounded-2xl bg-warm-white p-12 text-center shadow-lg">
                  <p className="text-foreground/60">Loading letters...</p>
                </div>
              ) : letters.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-warm-white p-12 text-center shadow-lg">
                  <span className="text-4xl">📭</span>
                  <p className="text-foreground/60">No letters yet</p>
                </div>
              ) : filteredLetters.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-warm-white p-12 text-center shadow-lg">
                  <p className="text-foreground/60">No letters match your search</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLetters.map((letter, i) => (
                    <LetterCard
                      key={letter.id}
                      letter={letter}
                      index={i}
                      isExpanded={expandedLetterId === letter.id}
                      onToggle={() => toggleLetterExpand(letter.id)}
                      onDelete={() => handleDeleteLetter(letter.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="flex-1 rounded-xl border border-wood/20 bg-warm-white px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
                <div className="flex gap-1.5">
                  {(["ALL", "USER", "ADMIN"] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        roleFilter === role
                          ? "bg-terracotta text-warm-white"
                          : "bg-warm-white text-wood hover:bg-wood/10"
                      }`}
                    >
                      {role === "ALL" ? "All" : role === "USER" ? "User" : "Admin"}
                    </button>
                  ))}
                </div>
              </div>
              {isLoadingUsers ? (
                <div className="rounded-2xl bg-warm-white p-12 text-center shadow-lg">
                  <p className="text-foreground/60">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-warm-white p-12 text-center shadow-lg">
                  <span className="text-4xl">👤</span>
                  <p className="text-foreground/60">No users yet</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-warm-white p-12 text-center shadow-lg">
                  <p className="text-foreground/60">No users match your filters</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((u, i) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="rounded-2xl bg-warm-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {u.displayName}
                            </p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                u.role === "ADMIN"
                                  ? "bg-terracotta/15 text-terracotta"
                                  : "bg-moss/15 text-moss"
                              }`}
                            >
                              {u.role}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-sm text-foreground/60">
                            {u.email}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/40">
                            <span>
                              {u.hasPassword ? "Password" : "OAuth"}
                            </span>
                            <span>Member since {formatDate(u.createdAt)}</span>
                          </div>
                        </div>
                        {u.role !== "ADMIN" && (
                          <CozyButton
                            variant="danger"
                            onClick={() =>
                              handleDeleteUser(u.id, u.displayName)
                            }
                            className="flex-shrink-0 px-3 py-2 text-xs sm:py-1.5"
                          >
                            Delete
                          </CozyButton>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function LetterCard({
  letter,
  index,
  isExpanded,
  onToggle,
  onDelete,
}: {
  letter: AdminLetter;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="rounded-2xl bg-warm-white shadow-sm"
    >
      <button
        onClick={onToggle}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">{letter.title}</p>
            <p className="mt-0.5 text-sm text-foreground/60">
              {letter.senderName} ({letter.senderEmail})
            </p>
            <div className="mt-1.5 flex items-center gap-3 text-xs text-foreground/40">
              <span>{letter.recipientCount} recipients</span>
              <span>{formatDate(letter.createdAt)}</span>
            </div>
          </div>
          <svg
            className={`h-4 w-4 flex-shrink-0 text-wood/40 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="border-t border-wood/10 px-5 pb-5"
        >
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/70">
            {letter.content}
          </p>
          {/* Recipients section */}
          {letter.recipients && letter.recipients.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/40">
                Recipients
              </p>
              <div className="space-y-2">
                {letter.recipients.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-cream/50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{r.displayName}</p>
                      <p className="truncate text-xs text-foreground/50">{r.email}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.isRead
                          ? "bg-moss/15 text-moss"
                          : "bg-terracotta/15 text-terracotta"
                      }`}
                    >
                      {r.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <CozyButton
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="px-3 py-1.5 text-xs"
            >
              Delete Letter
            </CozyButton>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
