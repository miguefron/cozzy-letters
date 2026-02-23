"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import FAB from "./FAB";
import QuickLetterModal from "./QuickLetterModal";
import { useAuthStore } from "@/stores/useAuthStore";

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
    </>
  );
}
