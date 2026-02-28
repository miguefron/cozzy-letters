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

    let abortController: AbortController | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;

    async function connect() {
      if (stopped) return;

      const token = useAuthStore.getState().token;
      if (!token) return;

      abortController = new AbortController();

      try {
        const res = await fetch(`${API_BASE}/sse/subscribe`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
          signal: abortController.signal,
        });

        if (!res.ok || !res.body) return;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            const lines = part.split("\n");
            let eventName = "message";
            let dataLines: string[] = [];

            for (const line of lines) {
              if (line.startsWith("event:")) {
                eventName = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                dataLines.push(line.slice(5).trim());
              }
            }

            if (eventName === "heartbeat" || dataLines.length === 0) continue;

            const raw = dataLines.join("\n");
            let parsed: unknown;
            try {
              parsed = JSON.parse(raw);
            } catch {
              parsed = raw;
            }

            onEventRef.current(eventName, parsed);
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }

      // Auto-reconnect after 5s
      if (!stopped) {
        reconnectTimeout = setTimeout(connect, 5000);
      }
    }

    connect();

    return () => {
      stopped = true;
      abortController?.abort();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [enabled]);
}
