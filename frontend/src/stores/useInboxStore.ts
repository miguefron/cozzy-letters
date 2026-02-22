import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export interface InboxLetter {
  id: number;
  letterId: number;
  title: string;
  content: string;
  senderName: string;
  isRead: boolean;
  deliveredAt: string;
}

interface InboxState {
  letters: InboxLetter[];
  isLoading: boolean;
  error: string | null;
  selectedLetter: InboxLetter | null;
  fetchInbox(): Promise<void>;
  markAsRead(id: number): Promise<void>;
  selectLetter(letter: InboxLetter): void;
  clearSelection(): void;
}

const API_URL = "http://localhost:8080/api/letters";

export const useInboxStore = create<InboxState>((set, get) => ({
  letters: [],
  isLoading: false,
  error: null,
  selectedLetter: null,

  fetchInbox: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: "Not authenticated" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`${API_URL}/inbox`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load inbox");

      const data: InboxLetter[] = await res.json();
      set({ letters: data, isLoading: false });
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  },

  markAsRead: async (id: number) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    try {
      await fetch(`${API_URL}/inbox/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        letters: state.letters.map((l) =>
          l.id === id ? { ...l, isRead: true } : l
        ),
        selectedLetter:
          state.selectedLetter?.id === id
            ? { ...state.selectedLetter, isRead: true }
            : state.selectedLetter,
      }));
    } catch {
      // Silently fail — the letter will stay unread in the UI
    }
  },

  selectLetter: (letter) => set({ selectedLetter: letter }),
  clearSelection: () => set({ selectedLetter: null }),
}));
