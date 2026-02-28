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
  recipientId: number | null;
  recipientName: string | null;
  isSending: boolean;
  isSent: boolean;
  error: string | null;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setRecipient: (id: number, name: string) => void;
  clearRecipient: () => void;
  sendLetter: () => Promise<void>;
  reset: () => void;
}

export const useLetterStore = create<LetterState>((set, get) => ({
  title: "",
  content: "",
  recipientId: null,
  recipientName: null,
  isSending: false,
  isSent: false,
  error: null,

  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setRecipient: (id, name) => set({ recipientId: id, recipientName: name }),
  clearRecipient: () => set({ recipientId: null, recipientName: null }),

  sendLetter: async () => {
    const { title, content, recipientId } = get();

    set({ isSending: true, error: null });

    try {
      const body: Record<string, unknown> = { title, content };
      if (recipientId) body.recipientId = recipientId;

      const res = await apiFetch("/letters", {
        method: "POST",
        body: JSON.stringify(body),
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
    set({ title: "", content: "", recipientId: null, recipientName: null, isSending: false, isSent: false, error: null }),
}));
