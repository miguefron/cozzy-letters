import { create } from "zustand";
import { apiFetch } from "@/lib/api";

export interface LetterResponse {
  id: number;
  title: string;
  content: string;
  senderName: string;
  signature?: string;
  recipientCount: number;
  createdAt: string;
}

interface LetterState {
  title: string;
  content: string;
  signature: string;
  recipientId: number | null;
  recipientName: string | null;
  isSending: boolean;
  isSent: boolean;
  error: string | null;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setSignature: (signature: string) => void;
  setRecipient: (id: number, name: string) => void;
  clearRecipient: () => void;
  sendLetter: () => Promise<void>;
  reset: () => void;
}

export const useLetterStore = create<LetterState>((set, get) => ({
  title: "",
  content: "",
  signature: "",
  recipientId: null,
  recipientName: null,
  isSending: false,
  isSent: false,
  error: null,

  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setSignature: (signature) => set({ signature }),
  setRecipient: (id, name) => set({ recipientId: id, recipientName: name }),
  clearRecipient: () => set({ recipientId: null, recipientName: null }),

  sendLetter: async () => {
    const { title, content, recipientId, signature } = get();

    set({ isSending: true, error: null });

    try {
      const body: Record<string, unknown> = { title, content };
      if (recipientId) body.recipientId = recipientId;
      if (signature) body.signature = signature;

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
    set({ title: "", content: "", signature: "", recipientId: null, recipientName: null, isSending: false, isSent: false, error: null }),
}));
