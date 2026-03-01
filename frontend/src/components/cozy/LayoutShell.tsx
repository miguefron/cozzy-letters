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
import { useInboxStore } from "@/stores/useInboxStore";
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

  const handleSseEvent = useCallback((eventName: string, data: unknown) => {
    if (eventName === "new_letter") {
      useNotificationStore.getState().addNotification(data as {
        letterId: number;
        letterRecipientId: number;
        title: string;
        senderName: string;
        deliveredAt: string;
      });
      useInboxStore.getState().fetchInbox();
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
