"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LetterNotification } from "@/stores/useNotificationStore";

interface NotificationToastProps {
  notification: LetterNotification;
  onDismiss: (id: string) => void;
}

export default function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative w-80 rounded-2xl border border-[#D4A574]/15 bg-[#FEFCF9] p-4 shadow-lg"
    >
      <button
        onClick={() => onDismiss(notification.id)}
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-[#A68B6B]/60 transition-colors hover:text-[#A68B6B]"
        aria-label="Dismiss notification"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="flex items-start gap-3 pr-4">
        <span className="mt-0.5 text-xl" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="#C4756B" strokeWidth="1.5" />
            <path d="M2 7L12 13L22 7" stroke="#C4756B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#5C4033]">
            New letter from <span className="text-[#C4756B]">{notification.senderName}</span>
          </p>
          <p className="mt-0.5 truncate text-xs text-[#A68B6B]">
            {notification.title}
          </p>
          <Link
            href="/inbox"
            className="mt-2 inline-block text-xs font-medium text-[#C4756B] transition-colors hover:text-[#A85F55]"
          >
            Read it &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
