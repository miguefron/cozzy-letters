"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";

export default function HomeActions() {
  const { token } = useAuthStore();
  const isLoggedIn = !!token;

  return (
    <div className="mt-8 flex gap-4 justify-center">
      {isLoggedIn ? (
        <Link
          href="/write-letter"
          className="rounded-2xl bg-terracotta px-6 py-3 font-medium text-warm-white transition-colors hover:bg-terracotta/90"
        >
          Write a Letter
        </Link>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-2xl bg-terracotta px-6 py-3 font-medium text-warm-white transition-colors hover:bg-terracotta/90"
          >
            Write a Letter
          </Link>
          <Link
            href="/register"
            className="rounded-2xl border-2 border-moss px-6 py-3 font-medium text-moss transition-colors hover:bg-moss/10"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}
