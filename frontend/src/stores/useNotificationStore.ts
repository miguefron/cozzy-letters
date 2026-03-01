import { create } from "zustand";

export interface LetterNotification {
  id: string;
  letterId: number;
  letterRecipientId: number;
  title: string;
  senderName: string;
  deliveredAt: string;
}

interface NotificationState {
  notifications: LetterNotification[];
  addNotification: (n: Omit<LetterNotification, "id">) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

// crypto.randomUUID() requires HTTPS; fall back for plain HTTP
function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      // Secure context required – fall through
    }
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (n) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...n, id: generateId() },
      ],
    })),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}));
