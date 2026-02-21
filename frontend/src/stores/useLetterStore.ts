import { create } from "zustand";

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
  token: string | null;
  isSending: boolean;
  isSent: boolean;
  error: string | null;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setToken: (token: string) => void;
  sendLetter: () => Promise<void>;
  reset: () => void;
}

export const useLetterStore = create<LetterState>((set, get) => ({
  title: "",
  content: "",
  token: null,
  isSending: false,
  isSent: false,
  error: null,

  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setToken: (token) => set({ token }),

  sendLetter: async () => {
    const { title, content, token } = get();

    if (!token) {
      set({ error: "Not authenticated" });
      return;
    }

    set({ isSending: true, error: null });

    try {
      const res = await fetch("http://localhost:8080/api/letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
