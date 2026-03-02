import { create } from "zustand";
import {
  isPushSupported,
  registerServiceWorker,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/pushNotifications";
import { apiFetch } from "@/lib/api";

interface PushState {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  permission: NotificationPermission | "default";
  registration: ServiceWorkerRegistration | null;
  initialize: () => Promise<void>;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export const usePushStore = create<PushState>((set, get) => ({
  isSupported: false,
  isSubscribed: false,
  isLoading: false,
  permission: "default",
  registration: null,

  initialize: async () => {
    if (!isPushSupported()) return;

    set({ isSupported: true, permission: Notification.permission });

    const registration = await registerServiceWorker();
    if (!registration) return;

    set({ registration });

    const subscription = await registration.pushManager.getSubscription();
    set({ isSubscribed: !!subscription });
  },

  subscribe: async () => {
    const { registration } = get();
    if (!registration) return;

    set({ isLoading: true });
    try {
      const sub = await subscribeToPush(registration, async (data) => {
        await apiFetch("/push/subscribe", {
          method: "POST",
          body: JSON.stringify(data),
        });
      });
      set({
        isSubscribed: !!sub,
        permission: Notification.permission,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  unsubscribe: async () => {
    const { registration } = get();
    if (!registration) return;

    set({ isLoading: true });
    try {
      await unsubscribeFromPush(registration, async (endpoint) => {
        await apiFetch(
          `/push/subscribe?endpoint=${encodeURIComponent(endpoint)}`,
          { method: "DELETE" }
        );
      });
      set({ isSubscribed: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
