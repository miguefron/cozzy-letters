"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import FAB from "./FAB";
import QuickLetterModal from "./QuickLetterModal";
import NotificationContainer from "./NotificationContainer";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useSse } from "@/lib/useSse";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { token } = useAuthStore();
  const isLanding = pathname === "/";
  const isWriteLetter = pathname === "/write-letter";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // DEBUG: Fire a test notification 3s after mount to verify rendering works
  useEffect(() => {
    if (!mounted || !token) return;
    const t = setTimeout(() => {
      useNotificationStore.getState().addNotification({
        letterId: 0,
        letterRecipientId: 0,
        title: "SSE Debug - if you see this, rendering works",
        senderName: "System Test",
        deliveredAt: new Date().toISOString(),
      });
    }, 3000);
    return () => clearTimeout(t);
  }, [mounted, token]);

  const handleSseEvent = useCallback((eventName: string, data: unknown) => {
    console.log("[SSE] LayoutShell received event:", eventName, data);
    if (eventName === "new_letter") {
      console.log("[SSE] Adding notification to store");
      useNotificationStore.getState().addNotification(data as {
        letterId: number;
        letterRecipientId: number;
        title: string;
        senderName: string;
        deliveredAt: string;
      });
      console.log("[SSE] Store notifications:", useNotificationStore.getState().notifications);
    }
  }, []);

  useSse({ enabled: mounted && !!token, onEvent: handleSseEvent });

  const showFAB = mounted && !!token && !isLanding && !isWriteLetter;

  return (
    <>
      {!isLanding && <Navbar />}
      <main className={isLanding ? "" : "pt-16"}>{children}</main>

      <AnimatePresence>
        {showFAB && <FAB onClick={() => setIsModalOpen(true)} />}
      </AnimatePresence>

      <QuickLetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <NotificationContainer />
    </>
  );
}
