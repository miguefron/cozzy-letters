"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthInitializer() {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return null;
}
