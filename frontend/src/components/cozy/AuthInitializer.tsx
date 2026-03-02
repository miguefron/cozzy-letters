"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePushStore } from "@/stores/usePushStore";

export default function AuthInitializer() {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
    usePushStore.getState().initialize();
  }, []);

  return null;
}
