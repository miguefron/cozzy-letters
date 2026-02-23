"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const displayName = searchParams.get("displayName");
    const role = searchParams.get("role") ?? "USER";

    if (token && email && displayName) {
      if (typeof window !== "undefined") {
        localStorage.setItem("cl_token", JSON.stringify(token));
        localStorage.setItem("cl_user", JSON.stringify({ email, displayName, role }));
      }

      useAuthStore.setState({
        token,
        user: { email, displayName, role },
        isLoading: false,
        error: null,
      });

      router.push("/inbox");
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <p className="text-wood">Completing sign in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <p className="text-wood">Loading...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
