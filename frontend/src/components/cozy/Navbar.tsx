"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Navbar() {
  const { user, token, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLoggedIn = mounted && !!token && !!user;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-wood/10 bg-warm-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-serif text-xl font-bold text-terracotta">
          CozyLetters
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-wood">
                Hello, {user.displayName}
              </span>
              <Link
                href="/profile"
                className="text-sm font-medium text-wood hover:underline"
              >
                Profile
              </Link>
              <Link
                href="/inbox"
                className="text-sm font-medium text-moss hover:underline"
              >
                Inbox
              </Link>
              <Link
                href="/write-letter"
                className="text-sm font-medium text-terracotta hover:underline"
              >
                Write a Letter
              </Link>
              <button
                onClick={logout}
                className="text-sm text-wood/60 transition-colors hover:text-terracotta"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-wood transition-colors hover:text-terracotta"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-terracotta px-4 py-2 text-sm font-medium text-warm-white transition-colors hover:bg-terracotta/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
