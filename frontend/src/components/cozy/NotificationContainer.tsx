"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/stores/useNotificationStore";
import NotificationToast from "./NotificationToast";

export default function NotificationContainer() {
  const [mounted, setMounted] = useState(false);
  const notifications = useNotificationStore((s) => s.notifications);
  const dismissNotification = useNotificationStore((s) => s.dismissNotification);

  useEffect(() => setMounted(true), []);

  const handleDismiss = useCallback(
    (id: string) => dismissNotification(id),
    [dismissNotification]
  );

  if (!mounted) return null;

  const visible = notifications.slice(-3);

  return createPortal(
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {visible.map((n) => (
          <NotificationToast
            key={n.id}
            notification={n}
            onDismiss={handleDismiss}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
