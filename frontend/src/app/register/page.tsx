"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register(email, password, displayName);
    if (ok) router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full max-w-md rounded-2xl bg-warm-white p-8 shadow-md"
      >
        <h1 className="font-serif text-3xl font-bold text-terracotta">
          Create Your Account
        </h1>
        <p className="mt-2 text-wood/70">Join and send warm letters to the world</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div>
            <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-foreground/60">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              required
              placeholder="Your name"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); clearError(); }}
              className="w-full rounded-xl border border-wood/30 bg-cream/50 px-5 py-3 text-foreground placeholder:text-wood/50 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground/60">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              className="w-full rounded-xl border border-wood/30 bg-cream/50 px-5 py-3 text-foreground placeholder:text-wood/50 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground/60">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="Choose a password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              className="w-full rounded-xl border border-wood/30 bg-cream/50 px-5 py-3 text-foreground placeholder:text-wood/50 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition-colors"
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
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-terracotta px-6 py-3 font-medium text-warm-white transition-colors hover:bg-terracotta/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-wood/20" />
          <span className="text-sm text-wood/50">or</span>
          <div className="h-px flex-1 bg-wood/20" />
        </div>

        <button
          disabled
          className="w-full rounded-xl border-2 border-wood/30 px-6 py-3 font-medium text-wood/50 opacity-50 cursor-not-allowed"
        >
          Continue with Google — Coming soon
        </button>

        <p className="mt-6 text-center text-sm text-wood/70">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-terracotta hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
