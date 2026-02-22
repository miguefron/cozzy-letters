"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Skeleton from "@/components/cozy/Skeleton";
import CozyButton from "@/components/cozy/CozyButton";

export default function HomeActions() {
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLoggedIn = mounted && !!token;

  if (!mounted) {
    return (
      <div className="mt-8 flex gap-4 justify-center">
        <Skeleton className="h-12 w-36 rounded-2xl" />
        <Skeleton className="h-12 w-36 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mt-8 flex gap-4 justify-center">
      {isLoggedIn ? (
        <CozyButton as="link" href="/write-letter" className="rounded-2xl">
          Write a Letter
        </CozyButton>
      ) : (
        <>
          <CozyButton as="link" href="/login" className="rounded-2xl">
            Write a Letter
          </CozyButton>
          <CozyButton as="link" href="/register" variant="secondary" className="rounded-2xl">
            Sign Up
          </CozyButton>
        </>
      )}
    </div>
  );
}
