"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

interface NavLinkProps {
  href: string;
  label: string;
  className?: string;
  pathname: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function NavLink({ href, label, className = "", pathname }: NavLinkProps) {
  const isActive = pathname === href;
  return (
    <Link href={href} className={`relative px-2 py-1 text-sm font-medium transition-colors ${className}`}>
      {label}
      {isActive && (
        <motion.span
          layoutId="navbar-underline"
          className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-terracotta"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

export default function Navbar() {
  const { user, token, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Detect scroll for shadow
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Close mobile menu on outside click
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

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  const isLoggedIn = mounted && !!token && !!user;

  return (
    <motion.nav
      ref={menuRef}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full border-b border-wood/10 bg-warm-white/80 backdrop-blur-sm transition-shadow duration-300 ${
        scrolled ? "shadow-md shadow-wood/5" : ""
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/">
          <motion.span
            className="font-serif text-xl font-bold text-terracotta"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            CozyLetters
          </motion.span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 md:flex">
          {isLoggedIn ? (
            <>
              <NavLink
                href="/write-letter"
                label="Write a Letter"
                className="text-terracotta hover:text-terracotta/80"
                pathname={pathname}
              />
              <NavLink
                href="/inbox"
                label="Inbox"
                className="text-moss hover:text-moss/80"
                pathname={pathname}
              />
              {user.role === "ADMIN" && (
                <NavLink
                  href="/admin"
                  label="Admin"
                  className="text-terracotta hover:text-terracotta/80"
                  pathname={pathname}
                />
              )}
              <div ref={profileRef} className="relative">
                <motion.button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-cream"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-warm-white">
                    {getInitials(user.displayName)}
                  </div>
                  <span className="text-sm font-medium text-wood">{user.displayName}</span>
                </motion.button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-wood/10 bg-warm-white shadow-lg"
                    >
                      <div className="border-b border-wood/10 px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{user.displayName}</p>
                        <p className="mt-0.5 text-xs text-foreground/50">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-wood transition-colors hover:bg-cream"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          Profile
                        </Link>
                        <button
                          onClick={logout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-wood/60 transition-colors hover:bg-cream hover:text-terracotta"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                          </svg>
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-wood transition-colors hover:text-terracotta"
              >
                Log In
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/register"
                  className="rounded-xl bg-terracotta px-4 py-2 text-sm font-medium text-warm-white transition-colors hover:bg-terracotta/90"
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile hamburger button */}
        <motion.button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-wood transition-colors hover:bg-cream md:hidden"
          whileTap={{ scale: 0.9 }}
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
        </motion.button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-wood/10 bg-warm-white/95 backdrop-blur-sm md:hidden"
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 border-b border-wood/10 px-3 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-warm-white">
                      {getInitials(user.displayName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.displayName}</p>
                      <p className="text-xs text-foreground/50">{user.email}</p>
                    </div>
                  </div>
                  <MobileLink href="/write-letter" active={pathname === "/write-letter"} className="text-terracotta">
                    Write a Letter
                  </MobileLink>
                  <MobileLink href="/inbox" active={pathname === "/inbox"} className="text-moss">
                    Inbox
                  </MobileLink>
                  <MobileLink href="/profile" active={pathname === "/profile"} className="text-wood">
                    Profile
                  </MobileLink>
                  {user.role === "ADMIN" && (
                    <MobileLink href="/admin" active={pathname === "/admin"} className="text-terracotta">
                      Admin
                    </MobileLink>
                  )}
                  <motion.button
                    onClick={logout}
                    className="rounded-lg px-3 py-2.5 text-left text-sm text-wood/60 transition-colors hover:bg-cream hover:text-terracotta"
                    whileTap={{ scale: 0.97 }}
                  >
                    Log Out
                  </motion.button>
                </>
              ) : (
                <>
                  <MobileLink href="/login" active={pathname === "/login"} className="text-wood">
                    Log In
                  </MobileLink>
                  <MobileLink href="/register" active={pathname === "/register"} className="text-terracotta font-medium">
                    Sign Up
                  </MobileLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function MobileLink({
  href,
  active,
  className = "",
  children,
}: {
  href: string;
  active: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div whileTap={{ scale: 0.97 }}>
      <Link
        href={href}
        className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-cream ${className} ${
          active ? "bg-cream/80" : ""
        }`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
