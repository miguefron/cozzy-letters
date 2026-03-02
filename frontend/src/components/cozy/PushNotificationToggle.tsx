"use client";

import { usePushStore } from "@/stores/usePushStore";

export default function PushNotificationToggle() {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
  } = usePushStore();

  if (!isSupported) return null;

  const isDenied = permission === "denied";

  const handleToggle = async () => {
    if (isDenied) return;
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground/80">
          Push notifications
        </p>
        <p className="mt-0.5 text-xs text-wood/50">
          {isDenied
            ? "Notifications blocked by your browser \u2014 update site permissions to enable"
            : "Get notified when you receive a new letter, even when the app is closed"}
        </p>
      </div>
      <button
        type="button"
        disabled={isLoading || isDenied}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
          isSubscribed ? "bg-moss" : "bg-wood/30"
        } ${isLoading || isDenied ? "opacity-50 cursor-not-allowed" : ""}`}
        role="switch"
        aria-checked={isSubscribed}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
            isSubscribed ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
