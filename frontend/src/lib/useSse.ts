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
    console.log("[SSE] Hook effect running, enabled:", enabled);
    if (!enabled) return;

    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn("[SSE] No token available");
      return;
    }

    const url = `${API_BASE}/sse/subscribe?token=${encodeURIComponent(token)}`;
    console.log("[SSE] Creating EventSource:", url.substring(0, 80) + "...");
    const es = new EventSource(url);

    es.onopen = () => {
      console.log("[SSE] Connection opened, readyState:", es.readyState);
    };

    es.addEventListener("new_letter", (e) => {
      console.log("[SSE] Received new_letter event:", e.data);
      try {
        const data = JSON.parse(e.data);
        onEventRef.current("new_letter", data);
      } catch (err) {
        console.error("[SSE] Failed to parse event data:", err);
      }
    });

    es.onerror = (e) => {
      console.warn("[SSE] Error, readyState:", es.readyState, "event:", e);
    };

    return () => {
      console.log("[SSE] Closing EventSource");
      es.close();
    };
  }, [enabled]);
}
