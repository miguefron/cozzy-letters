import { create } from "zustand";
import { apiFetch } from "@/lib/api";

export interface LetterResponse {
  id: number;
  title: string;
  content: string;
  senderName: string;
  recipientCount: number;
  createdAt: string;
}

interface LetterState {
  title: string;
  content: string;
  isSending: boolean;
  isSent: boolean;
  error: string | null;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  sendLetter: () => Promise<void>;
  reset: () => void;
}

export const useLetterStore = create<LetterState>((set, get) => ({
  title: "",
  content: "",
  isSending: false,
  isSent: false,
  error: null,

  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),

  sendLetter: async () => {
    const { title, content } = get();

    set({ isSending: true, error: null });

    try {
      const res = await apiFetch("/letters", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to send letter");
      }

      set({ isSending: false, isSent: true });
    } catch (e) {
      set({
        isSending: false,
        error: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  },

  reset: () =>
    set({ title: "", content: "", isSending: false, isSent: false, error: null }),
}));
