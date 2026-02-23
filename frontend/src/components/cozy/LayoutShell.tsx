"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <>
      {!isLanding && <Navbar />}
      <main className={isLanding ? "" : "pt-16"}>{children}</main>
    </>
  );
}
