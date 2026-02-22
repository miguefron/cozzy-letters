"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiFetch } from "@/lib/api";

interface ProfileData {
  email: string;
  displayName: string;
  hasPassword: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { token, updateUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Display name editing
  const [displayName, setDisplayName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState("");
  const [nameError, setNameError] = useState("");

  // Password changing
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => setMounted(true), []);

  // Auth guard
  useEffect(() => {
    if (mounted && !token) {
      router.push("/login");
    }
  }, [mounted, token, router]);

  // Fetch profile data
  useEffect(() => {
    if (!mounted || !token) return;

    async function fetchProfile() {
      try {
        const res = await apiFetch("/auth/me");
        if (!res.ok) throw new Error("Failed to load profile");
        const data: ProfileData = await res.json();
        setProfile(data);
        setDisplayName(data.displayName);
      } catch {
        // apiFetch handles 401 redirect
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [mounted, token]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameSaving(true);
    setNameSuccess("");
    setNameError("");

    try {
      const res = await apiFetch("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ displayName }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Failed to update display name");
      }

      const data: ProfileData = await res.json();
      setProfile(data);
      updateUser({ email: data.email, displayName: data.displayName });
      setNameSuccess("Display name updated!");
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Failed to update display name");
    } finally {
      setNameSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSuccess("");
    setPwError("");

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match");
      return;
    }

    setPwSaving(true);

    try {
      const res = await apiFetch("/auth/me/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Failed to change password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwSuccess("Password changed successfully!");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  if (!mounted || !token) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <p className="text-wood/70">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <p className="text-red-500">Failed to load profile.</p>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const inputClass =
    "w-full rounded-xl border border-wood/30 bg-cream/50 px-5 py-3 text-foreground placeholder:text-wood/50 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition-colors";

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full max-w-md rounded-2xl bg-warm-white p-8 shadow-md"
      >
        {/* Header */}
        <h1 className="font-serif text-3xl font-bold text-terracotta">
          Your Profile
        </h1>
        <p className="mt-2 text-wood/70">Manage your account details</p>

        {/* Profile Info */}
        <div className="mt-8 space-y-2">
          <p className="text-sm text-foreground/60">
            <span className="font-medium">Email:</span>{" "}
            <span className="text-foreground">{profile.email}</span>
          </p>
          <p className="text-sm text-foreground/60">
            <span className="font-medium">Member since:</span>{" "}
            <span className="text-foreground">{memberSince}</span>
          </p>
        </div>

        {/* Edit Display Name */}
        <form onSubmit={handleNameSubmit} className="mt-8 flex flex-col gap-5">
          <div>
            <label
              htmlFor="displayName"
              className="mb-2 block text-sm font-medium text-foreground/60"
            >
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setNameSuccess("");
                setNameError("");
              }}
              className={inputClass}
            />
          </div>

          {nameSuccess && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-moss"
            >
              {nameSuccess}
            </motion.p>
          )}

          {nameError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500"
            >
              {nameError}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={nameSaving}
            className="w-full rounded-xl bg-terracotta px-6 py-3 font-medium text-warm-white transition-colors hover:bg-terracotta/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nameSaving ? "Saving..." : "Save"}
          </button>
        </form>

        {/* Change Password (only for users with a password) */}
        {profile.hasPassword && (
          <>
            <div className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-wood/20" />
              <span className="text-sm text-wood/50">Change Password</span>
              <div className="h-px flex-1 bg-wood/20" />
            </div>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-medium text-foreground/60"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  required
                  placeholder="Your current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPwSuccess("");
                    setPwError("");
                  }}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-foreground/60"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  placeholder="Choose a new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPwSuccess("");
                    setPwError("");
                  }}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-foreground/60"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPwSuccess("");
                    setPwError("");
                  }}
                  className={inputClass}
                />
              </div>

              {pwSuccess && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-moss"
                >
                  {pwSuccess}
                </motion.p>
              )}

              {pwError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500"
                >
                  {pwError}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={pwSaving}
                className="w-full rounded-xl bg-terracotta px-6 py-3 font-medium text-warm-white transition-colors hover:bg-terracotta/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pwSaving ? "Changing..." : "Change Password"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
