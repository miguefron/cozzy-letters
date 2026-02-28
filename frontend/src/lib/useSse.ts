"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface UseSseOptions {
  enabled: boolean;
  onEvent: (eventName: string, data: unknown) => void;
}

export function useSse({ enabled, onEvent }: UseSseOptions) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!enabled) return;

    const token = useAuthStore.getState().token;
    if (!token) return;

    const url = `${API_BASE}/sse/subscribe?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.addEventListener("new_letter", (e) => {
      try {
        const data = JSON.parse(e.data);
        onEventRef.current("new_letter", data);
      } catch {
        // ignore parse errors
      }
    });

    es.onerror = () => {
      // EventSource auto-reconnects on error
    };

    return () => {
      es.close();
    };
  }, [enabled]);
}
