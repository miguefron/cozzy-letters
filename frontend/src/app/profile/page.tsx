"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiFetch } from "@/lib/api";
import Skeleton from "@/components/cozy/Skeleton";
import CozyCard from "@/components/cozy/CozyCard";
import CozyInput from "@/components/cozy/CozyInput";
import CozyButton from "@/components/cozy/CozyButton";

interface ProfileData {
  email: string;
  displayName: string;
  hasPassword: boolean;
  searchable: boolean;
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

  // Privacy
  const [searchable, setSearchable] = useState(true);
  const [searchableSaving, setSearchableSaving] = useState(false);

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
        setSearchable(data.searchable ?? true);
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
      updateUser({ ...useAuthStore.getState().user!, email: data.email, displayName: data.displayName });
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
        <div className="w-full max-w-md rounded-2xl bg-warm-white p-8 shadow-md">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-3 h-4 w-32" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="mt-8 space-y-5">
            <div>
              <Skeleton className="mb-2 h-4 w-28" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <CozyCard animated className="w-full max-w-md">
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
          <CozyInput
            id="displayName"
            type="text"
            required
            label="Display Name"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setNameSuccess("");
              setNameError("");
            }}
          />

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

          <CozyButton type="submit" disabled={nameSaving} fullWidth>
            {nameSaving ? "Saving..." : "Save"}
          </CozyButton>
        </form>

        {/* Privacy */}
        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-wood/20" />
          <span className="text-sm text-wood/50">Privacy</span>
          <div className="h-px flex-1 bg-wood/20" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground/80">
              Allow others to find and send me letters
            </p>
            <p className="mt-0.5 text-xs text-wood/50">
              When disabled, you won&apos;t appear in user search results
            </p>
          </div>
          <button
            type="button"
            disabled={searchableSaving}
            onClick={async () => {
              const newValue = !searchable;
              setSearchableSaving(true);
              try {
                const res = await apiFetch("/auth/me/searchable", {
                  method: "PATCH",
                  body: JSON.stringify({ searchable: newValue }),
                });
                if (res.ok) {
                  setSearchable(newValue);
                  const currentUser = useAuthStore.getState().user;
                  if (currentUser) {
                    updateUser({ ...currentUser, searchable: newValue });
                  }
                }
              } catch {
                // revert on failure
              } finally {
                setSearchableSaving(false);
              }
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
              searchable ? "bg-moss" : "bg-wood/30"
            } ${searchableSaving ? "opacity-50" : ""}`}
            role="switch"
            aria-checked={searchable}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                searchable ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Change Password (only for users with a password) */}
        {profile.hasPassword && (
          <>
            <div className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-wood/20" />
              <span className="text-sm text-wood/50">Change Password</span>
              <div className="h-px flex-1 bg-wood/20" />
            </div>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
              <CozyInput
                id="currentPassword"
                type="password"
                required
                label="Current Password"
                placeholder="Your current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPwSuccess("");
                  setPwError("");
                }}
              />

              <CozyInput
                id="newPassword"
                type="password"
                required
                label="New Password"
                placeholder="Choose a new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPwSuccess("");
                  setPwError("");
                }}
              />

              <CozyInput
                id="confirmPassword"
                type="password"
                required
                label="Confirm New Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPwSuccess("");
                  setPwError("");
                }}
              />

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

              <CozyButton type="submit" disabled={pwSaving} fullWidth>
                {pwSaving ? "Changing..." : "Change Password"}
              </CozyButton>
            </form>
          </>
        )}
      </CozyCard>
    </div>
  );
}
