"use client";

import LetterContent from "./LetterContent";

function WaxSeal() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#C4756B" fillOpacity="0.8" />
      <circle
        cx="16"
        cy="16"
        r="12"
        fill="none"
        stroke="#FFF8F0"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <path
        d="M14 14 C14 12.5 16 11 16 13 C16 11 18 12.5 18 14 C18 16 16 18 16 18 C16 18 14 16 14 14Z"
        fill="#FFF8F0"
        fillOpacity="0.6"
      />
    </svg>
  );
}

interface CozyLetterCardProps {
  senderName: string;
  title: string;
  content: string;
  signature?: string;
  deliveredAt: string;
  maxContentHeight?: string;
  onBack?: () => void;
}

export default function CozyLetterCard({
  senderName,
  title,
  content,
  signature,
  deliveredAt,
  maxContentHeight,
  onBack,
}: CozyLetterCardProps) {
  const formattedDate = new Date(deliveredAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="relative rounded-2xl bg-[#FEFCF9] p-8 shadow-lg sm:p-10 border border-wood/10">
      {/* Wax seal */}
      <div
        className="absolute top-4 right-4 animate-pulse"
        style={{ animationDuration: "3s" }}
      >
        <WaxSeal />
      </div>

      {/* Mobile back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 text-sm text-wood transition-colors hover:text-terracotta md:hidden"
        >
          &larr; Back to inbox
        </button>
      )}

      {/* Header metadata */}
      <p className="text-sm font-medium text-foreground/60">
        From {senderName}
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-terracotta pr-10">
        {title}
      </h2>
      <p className="mt-1 text-xs text-foreground/40">{formattedDate}</p>

      <hr className="my-6 border-wood/10" />

      {/* Decorative opening quote */}
      <span className="block font-serif text-4xl text-terracotta/20 leading-none select-none mb-2">
        &ldquo;
      </span>

      {/* Letter content */}
      <div
        className={maxContentHeight ? "overflow-y-auto" : ""}
        style={maxContentHeight ? { maxHeight: maxContentHeight } : undefined}
      >
        <LetterContent html={content} />
      </div>

      {/* Divider + Signature */}
      {signature && (
        <>
          <div className="mt-6 mb-3 h-px w-16 ml-auto bg-wood/30" />
          <p className="text-sm text-wood text-right">— {signature}</p>
        </>
      )}
    </div>
  );
}
