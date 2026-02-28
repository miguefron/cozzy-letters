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

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (n) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...n, id: crypto.randomUUID() },
      ],
    })),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}));
