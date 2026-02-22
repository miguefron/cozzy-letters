"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Navbar() {
  const { user, token, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const isLoggedIn = mounted && !!token && !!user;

  return (
    <nav ref={menuRef} className="fixed top-0 z-50 w-full border-b border-wood/10 bg-warm-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-serif text-xl font-bold text-terracotta">
          CozyLetters
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
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
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-terracotta hover:underline"
                >
                  Admin
                </Link>
              )}
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-wood transition-colors hover:bg-cream md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`overflow-hidden border-t border-wood/10 bg-warm-white/95 backdrop-blur-sm transition-[max-height] duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-80" : "max-h-0 border-t-0"
        }`}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
          {isLoggedIn ? (
            <>
              <span className="px-3 py-2 text-sm text-wood">
                Hello, {user.displayName}
              </span>
              <Link
                href="/write-letter"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-terracotta transition-colors hover:bg-cream"
              >
                Write a Letter
              </Link>
              <Link
                href="/inbox"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-moss transition-colors hover:bg-cream"
              >
                Inbox
              </Link>
              <Link
                href="/profile"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-wood transition-colors hover:bg-cream"
              >
                Profile
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-terracotta transition-colors hover:bg-cream"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="rounded-lg px-3 py-2.5 text-left text-sm text-wood/60 transition-colors hover:bg-cream hover:text-terracotta"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2.5 text-sm text-wood transition-colors hover:bg-cream hover:text-terracotta"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-terracotta transition-colors hover:bg-cream"
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
